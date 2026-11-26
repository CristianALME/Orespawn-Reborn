
import { system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import { getAllRecipes, getRecipeStatus } from "./crafting.js";
import { getDiscoveredRecipes } from "./recipeDiscovery.js";
import { openProcessingStation } from "./processingStations.js";

const STATIONS = {
    general_forge: {
        name: "Forja general",
        subtitle: "Minerales y aleaciones",
        icon: "textures/blocks/or_forge_general"
    },
    weaponsmith_table: {
        name: "Mesa de armero",
        subtitle: "Armas y equipo de combate",
        icon: "textures/blocks/or_weaponsmith_table"
    },
    armor_station: {
        name: "Mesa de armaduras",
        subtitle: "Piezas y conjuntos de armadura",
        icon: "textures/blocks/or_armor_station"
    },
    arcane_altar: {
        name: "Altar arcano",
        subtitle: "Creaciones mágicas y legendarias",
        icon: "textures/blocks/or_arcane_altar"
    }
};

function showStation(player, stationId) {
    const station = STATIONS[stationId];
    if (!station) return;

    const discovered = getDiscoveredRecipes(player);

    const recipes = getAllRecipes().filter(recipe =>
        recipe.station === station.name &&
        discovered.includes(recipe.id)
    );

    const hasProcessing = stationId === "general_forge";

    const form = new ActionFormData()
        .title(`§6§l${station.name.toUpperCase()}`)
        .body(
            `§7${station.subtitle}\n\n` +
            `§eRecetas descubiertas: §f${recipes.length}\n\n` +
            (recipes.length
                ? "§aSelecciona una receta para consultar sus materiales."
                : "§7Todavía no has descubierto recetas para esta estación.")
        );

    for (const recipe of recipes) {
        form.button(`§f${recipe.name}\n§7${recipe.rarity}`);
    }

    if (hasProcessing) {
        form.button("§bProcesar materiales\n§7Fundir y transformar recursos");
    }

    form.button("§cCerrar");

    form.show(player).then(response => {
        if (response.canceled || response.selection === undefined) return;

        if (response.selection < recipes.length) {
            showStationRecipe(
                player,
                stationId,
                recipes[response.selection]
            );
            return;
        }

        if (hasProcessing && response.selection === recipes.length) {
            openProcessingStation(player, station.name);
        }

    }).catch(error => {
        console.warn(`[Orespawn Reborn] Error abriendo estación: ${error}`);
    });
}

function showStationRecipe(player, stationId, recipe) {
    const status = getRecipeStatus(player, recipe);

    let body =
        `§6Rareza: §f${recipe.rarity}\n` +
        `§6Estación: §f${recipe.station}\n\n` +
        `§eMATERIALES NECESARIOS\n\n`;

    for (const ingredient of status.ingredients) {
        const ready = ingredient.missing === 0;

        body += `${ready ? "§a✓" : "§c✗"} §f${ingredient.name}\n`;
        body += `§7Tienes ${ingredient.owned} / ${ingredient.amount}`;

        if (!ready) {
            body += ` §c(Faltan ${ingredient.missing})`;
        }

        body += "\n\n";
    }

    body += status.canCraft
        ? "§aTienes todos los ingredientes.\n§7La fabricación se conectará cuando incorporemos los objetos finales."
        : "§cAún te faltan materiales para esta receta.";

    const form = new ActionFormData()
        .title(`§6${recipe.name}`)
        .body(body)
        .button("§eVolver a la estación");

    form.show(player).then(response => {
        if (!response.canceled) {
            showStation(player, stationId);
        }
    }).catch(error => {
        console.warn(`[Orespawn Reborn] Error mostrando receta: ${error}`);
    });
}

export function initializeCraftingStations() {
    system.beforeEvents.startup.subscribe(event => {
        event.blockComponentRegistry.registerCustomComponent(
            "orespawn:open_station",
            {
                onPlayerInteract: (interaction, componentParameters) => {
                    const player = interaction.player;
                    if (!player) return;

                    const stationId = componentParameters?.params?.station;

                    system.run(() => showStation(player, stationId));
                }
            }
        );
    });
}
