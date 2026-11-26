
import { countItem } from "./crafting.js";

// ==========================================
// ORESPAWN REBORN - MOTOR DE PROCESAMIENTO
// ==========================================

const PROCESSES = new Map();

const VALID_PROCESS_TYPES = new Set([
    "smelting",
    "refining",
    "alloying",
    "arcane"
]);

const VALID_ITEM_ID = /^[a-z0-9_]+:[a-z0-9_]+$/;
const VALID_PROCESS_ID = /^[a-z0-9_]+$/;

// ==========================================
// VALIDACIÓN
// ==========================================

function validateProcess(process) {
    if (!process || typeof process !== "object" || Array.isArray(process)) {
        throw new Error("El proceso debe ser un objeto.");
    }

    if (
        typeof process.id !== "string" ||
        !VALID_PROCESS_ID.test(process.id)
    ) {
        throw new Error("El proceso necesita un ID válido.");
    }

    if (
        typeof process.name !== "string" ||
        !process.name.trim()
    ) {
        throw new Error(`Nombre inválido: ${process.id}.`);
    }

    if (!VALID_PROCESS_TYPES.has(process.type)) {
        throw new Error(`Tipo de proceso inválido: ${process.id}.`);
    }

    if (
        typeof process.station !== "string" ||
        !process.station.trim()
    ) {
        throw new Error(`Falta la estación de ${process.id}.`);
    }

    if (
        !Number.isInteger(process.minPlayerLevel) ||
        process.minPlayerLevel < 1
    ) {
        throw new Error(`Nivel requerido inválido: ${process.id}.`);
    }

    if (
        !Number.isInteger(process.durationSeconds) ||
        process.durationSeconds < 1
    ) {
        throw new Error(`Duración inválida: ${process.id}.`);
    }

    if (
        !Array.isArray(process.ingredients) ||
        process.ingredients.length === 0
    ) {
        throw new Error(`Faltan ingredientes en ${process.id}.`);
    }

    if (
        typeof process.output !== "string" ||
        !VALID_ITEM_ID.test(process.output)
    ) {
        throw new Error(`Objeto de salida inválido: ${process.id}.`);
    }

    if (
        !Number.isInteger(process.outputAmount) ||
        process.outputAmount < 1
    ) {
        throw new Error(`Cantidad de salida inválida: ${process.id}.`);
    }

    const catalysts = process.catalysts ?? [];

    if (!Array.isArray(catalysts)) {
        throw new Error(`Los catalizadores deben ser una lista: ${process.id}.`);
    }

    const allRequirements = [
        ...process.ingredients,
        ...catalysts
    ];

    for (const requirement of allRequirements) {
        if (
            !requirement ||
            typeof requirement.id !== "string" ||
            !VALID_ITEM_ID.test(requirement.id)
        ) {
            throw new Error(`Ingrediente inválido en ${process.id}.`);
        }

        if (
            !Number.isInteger(requirement.amount) ||
            requirement.amount < 1
        ) {
            throw new Error(`Cantidad inválida en ${process.id}.`);
        }
    }
}

// ==========================================
// REGISTRO DE PROCESOS
// ==========================================

export function registerProcess(process) {
    validateProcess(process);

    if (PROCESSES.has(process.id)) {
        throw new Error(`El proceso ${process.id} ya existe.`);
    }

    const safeProcess = Object.freeze({
        ...process,

        ingredients: Object.freeze(
            process.ingredients.map(item =>
                Object.freeze({ ...item })
            )
        ),

        catalysts: Object.freeze(
            (process.catalysts ?? []).map(item =>
                Object.freeze({ ...item })
            )
        )
    });

    PROCESSES.set(safeProcess.id, safeProcess);

    return safeProcess;
}

// ==========================================
// CONSULTAS
// ==========================================

export function getAllProcesses() {
    return Array.from(PROCESSES.values());
}

export function getProcessById(processId) {
    return PROCESSES.get(processId);
}

export function getProcessesByStation(stationName) {
    return getAllProcesses().filter(
        process => process.station === stationName
    );
}

export function getProcessesByType(type) {
    return getAllProcesses().filter(
        process => process.type === type
    );
}

// ==========================================
// AGRUPAR REQUISITOS REPETIDOS
// ==========================================

function aggregateRequirements(requirements) {
    const totals = new Map();

    for (const requirement of requirements ?? []) {
        const existing = totals.get(requirement.id);

        if (existing) {
            existing.amount += requirement.amount;
        } else {
            totals.set(requirement.id, {
                ...requirement
            });
        }
    }

    return Array.from(totals.values());
}

// ==========================================
// COMPROBACIÓN DEL INVENTARIO
// ==========================================

export function getProcessingStatus(player, process, playerLevel = 1) {
    if (!process) {
        throw new Error("No se puede consultar un proceso inexistente.");
    }

    const ingredients = aggregateRequirements(
        process.ingredients
    ).map(ingredient => {
        const owned = countItem(player, ingredient.id);

        return {
            ...ingredient,
            owned,
            missing: Math.max(0, ingredient.amount - owned)
        };
    });

    const catalysts = aggregateRequirements(
        process.catalysts
    ).map(catalyst => {
        const owned = countItem(player, catalyst.id);

        return {
            ...catalyst,
            owned,
            missing: Math.max(0, catalyst.amount - owned)
        };
    });

    const hasIngredients = ingredients.every(
        ingredient => ingredient.missing === 0
    );

    const hasCatalysts = catalysts.every(
        catalyst => catalyst.missing === 0
    );

    const hasRequiredLevel =
        Number.isInteger(playerLevel) &&
        playerLevel >= process.minPlayerLevel;

    return {
        ingredients,
        catalysts,
        hasIngredients,
        hasCatalysts,
        hasRequiredLevel,
        requiredLevel: process.minPlayerLevel,

        canProcess:
            hasIngredients &&
            hasCatalysts &&
            hasRequiredLevel
    };
}
