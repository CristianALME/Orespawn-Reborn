
import { registerMaterial } from "./materials.js";

const VANILLA_MATERIALS = [
    {
        id: "minecraft:iron_ingot",
        name: "Lingote de hierro",
        rarity: "common",
        category: "metal",
        properties: {
            hardness: 6,
            fragility: 2,
            temperature: 5,
            magicalAffinity: 0,
            elementalAffinity: ["earth"]
        },
        uses: [
            "weapons",
            "armor",
            "tools",
            "alloys"
        ]
    },
    {
        id: "minecraft:gold_ingot",
        name: "Lingote de oro",
        rarity: "uncommon",
        category: "metal",
        properties: {
            hardness: 3,
            fragility: 7,
            temperature: 4,
            magicalAffinity: 5,
            elementalAffinity: ["light"]
        },
        uses: [
            "jewelry",
            "magic",
            "alloys",
            "equipment"
        ]
    },
    {
        id: "minecraft:diamond",
        name: "Diamante",
        rarity: "rare",
        category: "gem",
        properties: {
            hardness: 10,
            fragility: 3,
            temperature: 2,
            magicalAffinity: 3,
            elementalAffinity: ["earth"]
        },
        uses: [
            "weapons",
            "armor",
            "tools",
            "upgrades"
        ]
    },
    {
        id: "minecraft:emerald",
        name: "Esmeralda",
        rarity: "rare",
        category: "gem",
        properties: {
            hardness: 7,
            fragility: 4,
            temperature: 2,
            magicalAffinity: 8,
            elementalAffinity: ["nature"]
        },
        uses: [
            "magic",
            "trading",
            "summoning",
            "upgrades"
        ]
    },
    {
        id: "minecraft:lapis_lazuli",
        name: "Lapislázuli",
        rarity: "uncommon",
        category: "gem",
        properties: {
            hardness: 4,
            fragility: 6,
            temperature: 2,
            magicalAffinity: 9,
            elementalAffinity: ["water", "light"]
        },
        uses: [
            "enchantments",
            "magic",
            "runes",
            "upgrades"
        ]
    }
];

export function initializeMaterialCatalog() {

    for (const material of VANILLA_MATERIALS) {
        registerMaterial(material);
    }

    console.warn(
        `[Orespawn Reborn] Materiales registrados: ${VANILLA_MATERIALS.length}`
    );
}
