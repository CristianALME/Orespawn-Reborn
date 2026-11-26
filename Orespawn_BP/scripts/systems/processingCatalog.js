
import { registerProcess } from "./processing.js";

// ==========================================
// ORESPAWN REBORN
// CATÁLOGO DE PROCESAMIENTO
// ==========================================

const PROCESSING_CATALOG = [

    {
        id: "smelt_raw_iron",
        name: "Fundir hierro en bruto",
        type: "smelting",
        station: "Forja general",
        minPlayerLevel: 1,
        durationSeconds: 8,

        ingredients: [
            {
                id: "minecraft:raw_iron",
                amount: 1
            }
        ],

        catalysts: [],

        output: "minecraft:iron_ingot",
        outputAmount: 1
    },

    {
        id: "smelt_raw_gold",
        name: "Fundir oro en bruto",
        type: "smelting",
        station: "Forja general",
        minPlayerLevel: 5,
        durationSeconds: 10,

        ingredients: [
            {
                id: "minecraft:raw_gold",
                amount: 1
            }
        ],

        catalysts: [],

        output: "minecraft:gold_ingot",
        outputAmount: 1
    },

    {
        id: "smelt_raw_copper",
        name: "Fundir cobre en bruto",
        type: "smelting",
        station: "Forja general",
        minPlayerLevel: 1,
        durationSeconds: 8,

        ingredients: [
            {
                id: "minecraft:raw_copper",
                amount: 1
            }
        ],

        catalysts: [],

        output: "minecraft:copper_ingot",
        outputAmount: 1
    },
    {
    id: "refine_raw_mithril",
    name: "Refinar mithril",
    type: "refining",
    station: "Forja general",
    minPlayerLevel: 10,
    durationSeconds: 20,
    ingredients: [
        { id: "orespawn:raw_mithril", amount: 2 }
    ],
    catalysts: [],
    output: "orespawn:mithril_ingot",
    outputAmount: 1
},
{
    id: "refine_raw_adamantium",
    name: "Refinar adamantium",
    type: "refining",
    station: "Forja general",
    minPlayerLevel: 20,
    durationSeconds: 35,
    ingredients: [
        { id: "orespawn:raw_adamantium", amount: 3 }
    ],
    catalysts: [],
    output: "orespawn:adamantium_ingot",
    outputAmount: 1
}
];

// ==========================================
// INICIALIZACIÓN DEL CATÁLOGO
// ==========================================

export function initializeProcessingCatalog() {

    for (const process of PROCESSING_CATALOG) {
        registerProcess(process);
    }

    console.warn(
        `[Orespawn Reborn] Procesos registrados: ${PROCESSING_CATALOG.length}`
    );
}
