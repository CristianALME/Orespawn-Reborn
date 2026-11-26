// ==========================================
// ORESPAWN REBORN
// CATÁLOGO DE MINERALES Y VETAS
// ==========================================

const ORE_DEPOSITS = [
    {
        id: "rose_quartz",
        blockId: "orespawn:rose_quartz_ore",
        dropId: "orespawn:rose_quartz",
        rarity: "common",
        veinSize: 5,
        attempts: 12,
        minY: -16,
        maxY: 96,
        biomes: ["mountains", "forest"]
    },
    {
        id: "fluorite",
        blockId: "orespawn:fluorite_ore",
        dropId: "orespawn:fluorite",
        rarity: "common",
        veinSize: 6,
        attempts: 14,
        minY: -32,
        maxY: 32,
        biomes: ["underground"]
    },
    {
        id: "malachite",
        blockId: "orespawn:malachite_ore",
        dropId: "orespawn:malachite",
        rarity: "common",
        veinSize: 5,
        attempts: 12,
        minY: -24,
        maxY: 48,
        biomes: ["forest"]
    },
    {
        id: "jade",
        blockId: "orespawn:jade_ore",
        dropId: "orespawn:jade",
        rarity: "uncommon",
        veinSize: 4,
        attempts: 9,
        minY: -32,
        maxY: 48,
        biomes: ["mountains"]
    },
    {
        id: "topaz",
        blockId: "orespawn:topaz_ore",
        dropId: "orespawn:topaz",
        rarity: "uncommon",
        veinSize: 4,
        attempts: 9,
        minY: -16,
        maxY: 64,
        biomes: ["mountains", "underground"]
    },
    {
        id: "mithril",
        blockId: "orespawn:mithril_ore",
        dropId: "orespawn:raw_mithril",
        rarity: "uncommon",
        veinSize: 3,
        attempts: 6,
        minY: -48,
        maxY: 16,
        biomes: ["mountains"]
    },
    {
        id: "sapphire",
        blockId: "orespawn:sapphire_ore",
        dropId: "orespawn:sapphire",
        rarity: "rare",
        veinSize: 3,
        attempts: 5,
        minY: -48,
        maxY: 16,
        biomes: ["frozen"]
    },
    {
        id: "ruby",
        blockId: "orespawn:ruby_ore",
        dropId: "orespawn:ruby",
        rarity: "rare",
        veinSize: 3,
        attempts: 5,
        minY: -48,
        maxY: 16,
        biomes: ["badlands", "underground"]
    },
    {
        id: "aquamarine",
        blockId: "orespawn:aquamarine_ore",
        dropId: "orespawn:aquamarine",
        rarity: "rare",
        veinSize: 3,
        attempts: 5,
        minY: -48,
        maxY: 16,
        biomes: ["ocean"]
    },
    {
        id: "alexandrite",
        blockId: "orespawn:alexandrite_ore",
        dropId: "orespawn:alexandrite",
        rarity: "epic",
        veinSize: 2,
        attempts: 3,
        minY: -48,
        maxY: -8,
        biomes: ["underground_structures"]
    },
    {
        id: "black_opal",
        blockId: "orespawn:black_opal_ore",
        dropId: "orespawn:black_opal",
        rarity: "epic",
        veinSize: 2,
        attempts: 3,
        minY: -56,
        maxY: -16,
        biomes: ["dark_caves"]
    },
    {
        id: "adamantium",
        blockId: "orespawn:adamantium_ore",
        dropId: "orespawn:raw_adamantium",
        rarity: "epic",
        veinSize: 2,
        attempts: 2,
        minY: -56,
        maxY: -32,
        biomes: ["underground_structures"]
    }
];

export function getAllOreDeposits() {
    return ORE_DEPOSITS;
}

export function getOreDepositById(id) {
    return ORE_DEPOSITS.find(ore => ore.id === id);
}

export function getOreDepositsByRarity(rarity) {
    return ORE_DEPOSITS.filter(ore => ore.rarity === rarity);
}

export function getOreDepositCount() {
    return ORE_DEPOSITS.length;
}