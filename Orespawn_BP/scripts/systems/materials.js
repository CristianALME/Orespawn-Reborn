
const MATERIALS = new Map();

const VALID_RARITIES = new Set([
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary",
    "mythic"
]);

const VALID_CATEGORIES = new Set([
    "ore",
    "gem",
    "metal",
    "alloy",
    "crystal",
    "organic",
    "magical",
    "boss_drop",
    "other"
]);

const VALID_ELEMENTS = new Set([
    "none",
    "fire",
    "water",
    "earth",
    "air",
    "lightning",
    "ice",
    "nature",
    "light",
    "shadow",
    "chaos"
]);

const VALID_SOURCES = new Set([
    "mining",
    "creatures",
    "bosses",
    "structures",
    "dimensions",
    "trading",
    "fishing",
    "crafting"
]);

const VALID_PROCESSING = new Set([
    "none",
    "basic",
    "advanced",
    "arcane",
    "legendary"
]);

function validateMaterial(material) {
    if (!material || typeof material !== "object" || Array.isArray(material)) {
        throw new Error("El material debe ser un objeto.");
    }

    if (
        typeof material.id !== "string" ||
        !/^[a-z0-9_]+:[a-z0-9_]+$/.test(material.id)
    ) {
        throw new Error(`ID inválido: ${material.id}`);
    }

    if (typeof material.name !== "string" || !material.name.trim()) {
        throw new Error(`Nombre inválido: ${material.id}`);
    }

    if (!VALID_RARITIES.has(material.rarity)) {
        throw new Error(`Rareza inválida: ${material.id}`);
    }

    if (!VALID_CATEGORIES.has(material.category)) {
        throw new Error(`Categoría inválida: ${material.id}`);
    }

    if (
        !material.properties ||
        typeof material.properties !== "object" ||
        Array.isArray(material.properties)
    ) {
        throw new Error(`Propiedades inválidas: ${material.id}`);
    }

    const numericProperties = [
        "hardness",
        "fragility",
        "temperature",
        "magicalAffinity"
    ];

    for (const property of numericProperties) {
        const value = material.properties[property];

        if (
            typeof value !== "number" ||
            !Number.isFinite(value) ||
            value < 0 ||
            value > 10
        ) {
            throw new Error(
                `Propiedad ${property} inválida en ${material.id}. Debe estar entre 0 y 10.`
            );
        }
    }

    if (
        !Array.isArray(material.properties.elementalAffinity) ||
        material.properties.elementalAffinity.length === 0
    ) {
        throw new Error(`Falta la afinidad elemental de ${material.id}.`);
    }

    for (const element of material.properties.elementalAffinity) {
        if (!VALID_ELEMENTS.has(element)) {
            throw new Error(`Elemento desconocido: ${element} en ${material.id}.`);
        }
    }

    if (!Array.isArray(material.uses)) {
        throw new Error(`Los usos deben ser una lista: ${material.id}`);
    }

    for (const use of material.uses) {
        if (typeof use !== "string" || !use.trim()) {
            throw new Error(`Uso inválido en ${material.id}.`);
        }
    }

    const sources = material.sources ?? [];

    if (!Array.isArray(sources)) {
        throw new Error(`Las fuentes deben ser una lista: ${material.id}`);
    }

    for (const source of sources) {
        if (!VALID_SOURCES.has(source)) {
            throw new Error(`Fuente desconocida: ${source} en ${material.id}.`);
        }
    }

    const processing = material.processing ?? "none";

    if (!VALID_PROCESSING.has(processing)) {
        throw new Error(`Procesamiento inválido: ${material.id}`);
    }

    if (
        material.description !== undefined &&
        (typeof material.description !== "string" || !material.description.trim())
    ) {
        throw new Error(`Descripción inválida: ${material.id}`);
    }
}

export function registerMaterial(material) {
    validateMaterial(material);

    if (MATERIALS.has(material.id)) {
        throw new Error(`El material ${material.id} ya está registrado.`);
    }

    const safeMaterial = Object.freeze({
        ...material,

        properties: Object.freeze({
            ...material.properties,
            elementalAffinity: Object.freeze([
                ...material.properties.elementalAffinity
            ])
        }),

        uses: Object.freeze([...material.uses]),
        sources: Object.freeze([...(material.sources ?? [])])
    });

    MATERIALS.set(safeMaterial.id, safeMaterial);

    return safeMaterial;
}

export function getAllMaterials() {
    return Array.from(MATERIALS.values());
}

export function getMaterialById(materialId) {
    return MATERIALS.get(materialId);
}

export function getMaterialsByRarity(rarity) {
    return getAllMaterials().filter(
        material => material.rarity === rarity
    );
}

export function getMaterialsByCategory(category) {
    return getAllMaterials().filter(
        material => material.category === category
    );
}

export function getMaterialsBySource(source) {
    return getAllMaterials().filter(
        material => material.sources.includes(source)
    );
}

export function isMaterialRegistered(materialId) {
    return MATERIALS.has(materialId);
}

export function getMaterialCount() {
    return MATERIALS.size;
}

export function getMaterialRegistryInfo() {
    return {
        totalMaterials: MATERIALS.size,
        availableRarities: Array.from(VALID_RARITIES),
        availableCategories: Array.from(VALID_CATEGORIES),
        availableElements: Array.from(VALID_ELEMENTS),
        availableSources: Array.from(VALID_SOURCES),
        availableProcessing: Array.from(VALID_PROCESSING)
    };
}
