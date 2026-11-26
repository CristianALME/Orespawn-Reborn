import { ActionFormData } from "@minecraft/server-ui";

import {
    getAllRecipes,
    getRecipeStatus
} from "./crafting.js";

import {
    getDiscoveredRecipes
} from "./recipeDiscovery.js";

// ======================================
// CATÁLOGO DE RECETAS
// ======================================

export function showRecipeCatalog(player) {

    const discoveredIds = getDiscoveredRecipes(player);

    const recipes = getAllRecipes().filter(
        recipe => discoveredIds.includes(recipe.id)
    );

    const form = new ActionFormData()
        .title("§6§lFORJA Y RECETAS")
        .body(
            `§eRecetas descubiertas: §f${recipes.length}\n\n` +
            `§7Las recetas aparecen cuando encuentras sus materiales.`
        );

    for (const recipe of recipes) {
        form.button(
            `§f${recipe.name}\n§7${recipe.rarity}`
        );
    }

    form.button("§cCerrar");

    form.show(player).then(response => {

        if (response.canceled) return;

        if (response.selection < recipes.length) {
            showRecipeDetails(
                player,
                recipes[response.selection]
            );
        }

    }).catch(error => {
        console.warn(
            `[Orespawn Reborn] Error del catálogo: ${error}`
        );
    });
}

// ======================================
// DETALLES DE UNA RECETA
// ======================================

function showRecipeDetails(player, recipe) {

    const status = getRecipeStatus(player, recipe);

    let body =
        `§6Rareza: §f${recipe.rarity}\n` +
        `§6Categoría: §f${recipe.category}\n` +
        `§6Estación: §f${recipe.station}\n\n` +
        `§eINGREDIENTES NECESARIOS:\n\n`;

    for (const ingredient of status.ingredients) {

        const color = ingredient.missing === 0
            ? "§a"
            : "§c";

        body +=
            `${color}${ingredient.name}\n` +
            `§7Necesitas: §f${ingredient.amount}\n` +
            `§7Tienes: §f${ingredient.owned}\n`;

        if (ingredient.missing > 0) {
            body +=
                `§cTe faltan: ${ingredient.missing}\n`;
        } else {
            body += "§aMaterial completo\n";
        }

        body += "\n";
    }

    body +=
        "\n§8La fabricación estará disponible al utilizar " +
        "la estación correspondiente.";

    const form = new ActionFormData()
        .title(`§6${recipe.name}`)
        .body(body)
        .button("§eVolver al catálogo");

    form.show(player).then(response => {

        if (response.canceled) return;

        showRecipeCatalog(player);

    }).catch(error => {
        console.warn(
            `[Orespawn Reborn] Error mostrando receta: ${error}`
        );
    });
}