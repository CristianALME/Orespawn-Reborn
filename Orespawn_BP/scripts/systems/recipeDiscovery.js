import { system, world } from "@minecraft/server";

import {
    getAllRecipes,
    countItem,
    getPlayerContainer
} from "./crafting.js";

const DISCOVERY_PROPERTY = "or_discovered_recipes";

// ======================================
// LEER RECETAS DESCUBIERTAS
// ======================================

export function getDiscoveredRecipes(player) {
    const stored = player.getDynamicProperty(
        DISCOVERY_PROPERTY
    );

    if (typeof stored !== "string") {
        return [];
    }

    try {
        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(id => typeof id === "string");

    } catch (error) {
        console.warn(
            `[Orespawn Reborn] Error leyendo recetas: ${error}`
        );

        return [];
    }
}

// ======================================
// GUARDAR DESCUBRIMIENTOS
// ======================================

function saveDiscoveredRecipes(player, recipes) {
    player.setDynamicProperty(
        DISCOVERY_PROPERTY,
        JSON.stringify(recipes)
    );
}

// ======================================
// EXAMINAR INVENTARIO
// ======================================

export function scanPlayerRecipes(player) {
    const container = getPlayerContainer(player);

    if (!container) return;

    const discovered = getDiscoveredRecipes(player);
    const newDiscoveries = [];

    for (const recipe of getAllRecipes()) {

        if (discovered.includes(recipe.id)) {
            continue;
        }

        const hasIngredient = recipe.ingredients.some(
            ingredient => countItem(player, ingredient.id) > 0
        );

        if (hasIngredient) {
            discovered.push(recipe.id);
            newDiscoveries.push(recipe);
        }
    }

    if (newDiscoveries.length === 0) return;

    saveDiscoveredRecipes(player, discovered);

    for (const recipe of newDiscoveries) {
        player.sendMessage(
            `§6[Forja] §e¡Nueva receta descubierta: §f${recipe.name}§e!`
        );
    }
}

// ======================================
// INICIALIZAR DESCUBRIMIENTO AUTOMÁTICO
// ======================================

export function initializeRecipeDiscovery() {

    // Comprobar inventarios cada 40 ticks (2 segundos).
    system.runInterval(() => {

        for (const player of world.getAllPlayers()) {

            try {
                scanPlayerRecipes(player);

            } catch (error) {
                console.warn(
                    `[Orespawn Reborn] Error examinando recetas: ${error}`
                );
            }
        }

    }, 40);

    // Examinar también al entrar en el mundo.
    world.afterEvents.playerSpawn.subscribe((event) => {

        system.runTimeout(() => {
            try {
                scanPlayerRecipes(event.player);

            } catch (error) {
                console.warn(
                    `[Orespawn Reborn] Error al iniciar descubrimientos: ${error}`
                );
            }
        }, 20);

    });
}