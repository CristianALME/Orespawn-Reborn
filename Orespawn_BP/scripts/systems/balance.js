
 // ==========================================
 // ORESPAWN REBORN
 // SISTEMA DE EQUILIBRIO Y PROGRESIÓN
 // ==========================================

const RARITY_RULES = Object.freeze({

    common: Object.freeze({
        minPlayerLevel: 1,
        difficulty: 1,
        sources: Object.freeze(["mining", "basic_creatures"]),
        processing: "basic"
    }),

    uncommon: Object.freeze({
        minPlayerLevel: 5,
        difficulty: 2,
        sources: Object.freeze(["mining", "creatures", "structures"]),
        processing: "basic"
    }),

    rare: Object.freeze({
        minPlayerLevel: 10,
        difficulty: 3,
        sources: Object.freeze(["rare_ores", "elite_creatures", "dungeons"]),
        processing: "advanced"
    }),

    epic: Object.freeze({
        minPlayerLevel: 20,
        difficulty: 4,
        sources: Object.freeze(["rare_structures", "elite_bosses", "dimensions"]),
        processing: "advanced"
    }),

    legendary: Object.freeze({
        minPlayerLevel: 30,
        difficulty: 5,
        sources: Object.freeze(["bosses", "special_dimensions"]),
        processing: "arcane"
    }),

    mythic: Object.freeze({
        minPlayerLevel: 40,
        difficulty: 6,
        sources: Object.freeze(["mythic_bosses", "endgame_events"]),
        processing: "legendary"
    })

});

// ==========================================
// CONSULTAR REGLAS DE RAREZA
// ==========================================

export function getRarityRules(rarity) {
    return RARITY_RULES[rarity];
}

// ==========================================
// COMPROBAR NIVEL DEL JUGADOR
// ==========================================

export function canAccessRarity(playerLevel, rarity) {

    const rules = getRarityRules(rarity);

    if (!rules || !Number.isInteger(playerLevel)) {
        return false;
    }

    return playerLevel >= rules.minPlayerLevel;
}

// ==========================================
// OBTENER NIVEL RECOMENDADO
// ==========================================

export function getRecommendedLevel(rarity) {

    const rules = getRarityRules(rarity);

    if (!rules) {
        return undefined;
    }

    return rules.minPlayerLevel;
}

// ==========================================
// CONSULTAR TODAS LAS RAREZAS
// ==========================================

export function getAllRarityRules() {
    return RARITY_RULES;
}

// ==========================================
// COMPROBAR SI UNA RAREZA EXISTE
// ==========================================

export function isValidRarity(rarity) {

    return Object.prototype.hasOwnProperty.call(
        RARITY_RULES,
        rarity
    );
}
