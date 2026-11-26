// ==========================================
// ORESPAWN REBORN
// FUENTES DE MATERIALES ESPECIALES
// ==========================================

const SPECIAL_SOURCES = [
    {
        materialId: "orespawn:vibranium_ingot",
        rarity: "legendary",
        sources: [
            {
                type: "creature",
                id: "orespawn:legendary_guardian"
            },
            {
                type: "structure",
                id: "orespawn:ancient_fortress"
            }
        ]
    },
    {
        materialId: "orespawn:void_crystal",
        rarity: "legendary",
        sources: [
            {
                type: "creature",
                id: "orespawn:void_guardian"
            },
            {
                type: "dimension",
                id: "orespawn:void_dimension"
            }
        ]
    },
    {
        materialId: "orespawn:chaos_material",
        rarity: "mythic",
        sources: [
            {
                type: "boss",
                id: "orespawn:chaos_overlord"
            },
            {
                type: "dimension",
                id: "orespawn:chaos_dimension"
            }
        ]
    }
];

export function getAllSpecialSources() {
    return SPECIAL_SOURCES;
}

export function getSpecialSourcesByMaterial(materialId) {
    return SPECIAL_SOURCES.find(
        entry => entry.materialId === materialId
    );
}

export function getSpecialSourcesByType(type) {
    return SPECIAL_SOURCES.filter(entry =>
        entry.sources.some(source => source.type === type)
    );
}