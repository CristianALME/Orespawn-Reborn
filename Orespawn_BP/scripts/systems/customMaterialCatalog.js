
import { registerMaterial } from "./materials.js";

// ==========================================
// ORESPAWN REBORN
// CATÁLOGO DE 15 MATERIALES ORIGINALES
// ==========================================

const CUSTOM_MATERIALS = [
    // --------------------------------------
    // MINERALES COMUNES
    // --------------------------------------

    {
        id: "orespawn:rose_quartz",
        name: "Cuarzo rosa",
        rarity: "common",
        category: "gem",
        description: "Cristal delicado con una gran afinidad curativa.",
        properties: {
            hardness: 3,
            fragility: 7,
            temperature: 2,
            magicalAffinity: 8,
            elementalAffinity: ["nature", "light"]
        },
        uses: ["healing", "pet_accessories", "amulets"],
        sources: ["mining"],
        processing: "basic"
    },
    {
        id: "orespawn:fluorite",
        name: "Fluorita",
        rarity: "common",
        category: "crystal",
        description: "Cristal sensible a las energías elementales.",
        properties: {
            hardness: 3,
            fragility: 8,
            temperature: 2,
            magicalAffinity: 9,
            elementalAffinity: ["light", "shadow"]
        },
        uses: ["runes", "catalysts", "magic_mechanisms"],
        sources: ["mining"],
        processing: "basic"
    },
    {
        id: "orespawn:malachite",
        name: "Malaquita",
        rarity: "common",
        category: "ore",
        description: "Mineral verdoso utilizado en aleaciones y mecanismos.",
        properties: {
            hardness: 4,
            fragility: 6,
            temperature: 3,
            magicalAffinity: 5,
            elementalAffinity: ["earth", "nature"]
        },
        uses: ["alloys", "mechanisms", "poison_resistance"],
        sources: ["mining"],
        processing: "basic"
    },

    // --------------------------------------
    // MATERIALES POCO COMUNES
    // --------------------------------------

    {
        id: "orespawn:jade",
        name: "Jade",
        rarity: "uncommon",
        category: "gem",
        description: "Piedra resistente asociada con la protección natural.",
        properties: {
            hardness: 8,
            fragility: 2,
            temperature: 3,
            magicalAffinity: 6,
            elementalAffinity: ["nature", "earth"]
        },
        uses: ["armor", "pet_armor", "protection"],
        sources: ["mining"],
        processing: "basic"
    },
    {
        id: "orespawn:topaz",
        name: "Topacio",
        rarity: "uncommon",
        category: "gem",
        description: "Gema de gran dureza y conducción energética.",
        properties: {
            hardness: 8,
            fragility: 3,
            temperature: 4,
            magicalAffinity: 6,
            elementalAffinity: ["fire", "light"]
        },
        uses: ["precision_weapons", "lenses", "accessories"],
        sources: ["mining"],
        processing: "basic"
    },
    {
        id: "orespawn:mithril_ingot",
        name: "Lingote de mithril",
        rarity: "uncommon",
        category: "metal",
        description: "Metal ligero y resistente ideal para equipo ágil.",
        properties: {
            hardness: 7,
            fragility: 2,
            temperature: 4,
            magicalAffinity: 6,
            elementalAffinity: ["air", "light"]
        },
        uses: ["light_armor", "fast_weapons", "mobility"],
        sources: ["mining"],
        processing: "basic"
    },

    // --------------------------------------
    // MATERIALES RAROS
    // --------------------------------------

    {
        id: "orespawn:sapphire",
        name: "Zafiro",
        rarity: "rare",
        category: "gem",
        description: "Gema estable con afinidad por el hielo y el agua.",
        properties: {
            hardness: 9,
            fragility: 3,
            temperature: 2,
            magicalAffinity: 8,
            elementalAffinity: ["ice", "water"]
        },
        uses: ["ice_weapons", "elemental_protection", "energy_storage"],
        sources: ["mining"],
        processing: "advanced"
    },
    {
        id: "orespawn:ruby",
        name: "Rubí",
        rarity: "rare",
        category: "gem",
        description: "Gema energética vinculada al fuego.",
        properties: {
            hardness: 9,
            fragility: 3,
            temperature: 8,
            magicalAffinity: 7,
            elementalAffinity: ["fire"]
        },
        uses: ["fire_weapons", "explosives", "offensive_upgrades"],
        sources: ["mining"],
        processing: "advanced"
    },
    {
        id: "orespawn:aquamarine",
        name: "Aguamarina",
        rarity: "rare",
        category: "gem",
        description: "Cristal acuático con propiedades de conducción mágica.",
        properties: {
            hardness: 7,
            fragility: 4,
            temperature: 2,
            magicalAffinity: 8,
            elementalAffinity: ["water", "ice"]
        },
        uses: ["underwater_breathing", "underwater_mobility", "water_weapons"],
        sources: ["mining"],
        processing: "advanced"
    },

    // --------------------------------------
    // MATERIALES ÉPICOS
    // --------------------------------------

    {
        id: "orespawn:alexandrite",
        name: "Alejandrita",
        rarity: "epic",
        category: "gem",
        description: "Gema adaptable que responde a diferentes energías.",
        properties: {
            hardness: 8,
            fragility: 4,
            temperature: 5,
            magicalAffinity: 9,
            elementalAffinity: ["light", "shadow", "nature"]
        },
        uses: ["elemental_adaptation", "transformation", "special_equipment"],
        sources: ["mining", "structures"],
        processing: "advanced"
    },
    {
        id: "orespawn:black_opal",
        name: "Ópalo negro",
        rarity: "epic",
        category: "gem",
        description: "Gema oscura con propiedades ilusorias.",
        properties: {
            hardness: 3,
            fragility: 9,
            temperature: 3,
            magicalAffinity: 10,
            elementalAffinity: ["shadow", "chaos"]
        },
        uses: ["illusions", "temporary_invisibility", "enchantments"],
        sources: ["mining", "structures"],
        processing: "advanced"
    },
    {
        id: "orespawn:adamantium_ingot",
        name: "Lingote de adamantium",
        rarity: "epic",
        category: "metal",
        description: "Metal extraordinariamente resistente y difícil de trabajar.",
        properties: {
            hardness: 10,
            fragility: 1,
            temperature: 9,
            magicalAffinity: 3,
            elementalAffinity: ["earth", "fire"]
        },
        uses: ["heavy_armor", "shields", "durable_weapons"],
        sources: ["mining", "structures"],
        processing: "advanced"
    },

    // --------------------------------------
    // MATERIALES LEGENDARIOS
    // --------------------------------------

    {
        id: "orespawn:vibranium_ingot",
        name: "Lingote de vibranium",
        rarity: "legendary",
        category: "metal",
        description: "Metal capaz de almacenar energía de los impactos.",
        properties: {
            hardness: 9,
            fragility: 2,
            temperature: 6,
            magicalAffinity: 9,
            elementalAffinity: ["lightning", "earth"]
        },
        uses: ["energy_shields", "counterattacks", "energy_storage"],
        sources: ["bosses", "structures"],
        processing: "arcane"
    },
    {
        id: "orespawn:void_crystal",
        name: "Cristal del Vacío",
        rarity: "legendary",
        category: "crystal",
        description: "Cristal capaz de manipular energías espaciales.",
        properties: {
            hardness: 6,
            fragility: 5,
            temperature: 1,
            magicalAffinity: 10,
            elementalAffinity: ["shadow", "chaos"]
        },
        uses: ["portals", "teleportation", "void_weapons"],
        sources: ["dimensions", "bosses"],
        processing: "arcane"
    },

    // --------------------------------------
    // MATERIAL MÍTICO
    // --------------------------------------

    {
        id: "orespawn:chaos_material",
        name: "Material del Caos",
        rarity: "mythic",
        category: "magical",
        description: "Material inestable de temperatura y poder extremos.",
        properties: {
            hardness: 10,
            fragility: 1,
            temperature: 10,
            magicalAffinity: 10,
            elementalAffinity: ["chaos", "fire"]
        },
        uses: ["mythic_weapons", "mythic_armor", "chaos_artifacts"],
        sources: ["bosses", "dimensions"],
        processing: "legendary"
    }
];

export function initializeCustomMaterialCatalog() {
    for (const material of CUSTOM_MATERIALS) {
        registerMaterial(material);
    }

    console.warn(
        `[Orespawn Reborn] Materiales originales registrados: ${CUSTOM_MATERIALS.length}`
    );
}
