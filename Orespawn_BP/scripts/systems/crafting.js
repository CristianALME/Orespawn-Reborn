import { ItemStack } from "@minecraft/server";

// ======================================
// ORESPAWN REBORN - REGISTRO DE RECETAS
// ======================================

const RECIPES = [
    {
        id: "steel_ingot",
        name: "Lingote de acero",
        category: "Aleaciones",
        rarity: "Poco común",
        station: "Forja general",
        output: "orespawn:steel_ingot",
        outputAmount: 1,
        ingredients: [
            {
                id: "minecraft:iron_ingot",
                name: "Lingote de hierro",
                amount: 2
            },
            {
                id: "minecraft:coal",
                name: "Carbón",
                amount: 1
            }
        ]
    },
    {
        id: "reinforced_iron_sword",
        name: "Espada de hierro reforzada",
        category: "Armas",
        rarity: "Rara",
        station: "Mesa de armero",
        output: "orespawn:reinforced_iron_sword",
        outputAmount: 1,
        ingredients: [
            {
                id: "minecraft:iron_ingot",
                name: "Lingote de hierro",
                amount: 2
            },
            {
                id: "minecraft:diamond",
                name: "Diamante",
                amount: 1
            }
        ]
    },
    {
        id: "chaos_sword",
        name: "Espada del Caos",
        category: "Armas legendarias",
        rarity: "Legendaria",
        station: "Altar arcano",
        output: "orespawn:chaos_sword",
        outputAmount: 1,
        ingredients: [
            {
                id: "orespawn:skeleton_boss_bone",
                name: "Hueso del jefe esqueleto",
                amount: 1
            },
            {
                id: "orespawn:zombie_titan_skin",
                name: "Piel del Titán zombi",
                amount: 2
            }
        ]
    }
];

// ======================================
// CONSULTAS DEL REGISTRO
// ======================================

export function getAllRecipes() {
    return RECIPES;
}

export function getRecipeById(recipeId) {
    return RECIPES.find(recipe => recipe.id === recipeId);
}

// ======================================
// INVENTARIO DEL JUGADOR
// ======================================

export function getPlayerContainer(player) {
    const inventory = player.getComponent("minecraft:inventory");

    if (!inventory) return undefined;

    return inventory.container;
}

export function countItem(player, itemId) {
    const container = getPlayerContainer(player);

    if (!container) return 0;

    let total = 0;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);

        if (item && item.typeId === itemId) {
            total += item.amount;
        }
    }

    return total;
}

// ======================================
// COMPROBACIÓN DE INGREDIENTES
// ======================================

export function getRecipeStatus(player, recipe) {
    const ingredients = recipe.ingredients.map(ingredient => {
        const owned = countItem(player, ingredient.id);

        return {
            ...ingredient,
            owned,
            missing: Math.max(0, ingredient.amount - owned)
        };
    });

    const canCraft = ingredients.every(
        ingredient => ingredient.missing === 0
    );

    return {
        ingredients,
        canCraft
    };
}