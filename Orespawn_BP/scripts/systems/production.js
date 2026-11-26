
import { ItemStack, system, world } from "@minecraft/server";

import { getProcessById } from "./processing.js";
import {
    countItem,
    getPlayerContainer
} from "./crafting.js";

// ======================================
// ORESPAWN REBORN - MOTOR DE PRODUCCIÓN
// ======================================

const JOB_PROPERTY = "or_active_production";
const CHECK_INTERVAL = 20;

// ======================================
// UTILIDADES
// ======================================

function getPlayerLevel(player) {
    const level = player.getDynamicProperty("or_level") ?? 1;

    return Number.isInteger(level) && level >= 1 ? level : 1;
}

function getActiveJob(player) {
    const savedJob = player.getDynamicProperty(JOB_PROPERTY);

    if (typeof savedJob !== "string") {
        return undefined;
    }

    try {
        const job = JSON.parse(savedJob);

        if (
            !job ||
            typeof job !== "object" ||
            typeof job.processId !== "string" ||
            typeof job.processName !== "string" ||
            typeof job.output !== "string" ||
            !Number.isInteger(job.remainingAmount) ||
            job.remainingAmount < 1 ||
            !Number.isFinite(job.finishAt) ||
            !["running", "waiting_output"].includes(job.state)
        ) {
            console.warn(
                `[Orespawn Reborn] Trabajo inválido de ${player.name}.`
            );

            return undefined;
        }

        return job;

    } catch (error) {
        console.warn(
            `[Orespawn Reborn] Error leyendo trabajo de ${player.name}: ${error}`
        );

        return undefined;
    }
}


export function getProductionStatus(player) {
    const job = getActiveJob(player);

    if (!job) {
        return undefined;
    }

    const remainingSeconds = job.state === "running"
        ? Math.max(0, Math.ceil((job.finishAt - Date.now()) / 1000))
        : 0;

    return {
        processId: job.processId,
        processName: job.processName,
        output: job.output,
        remainingAmount: job.remainingAmount,
        state: job.state,
        remainingSeconds,
        isFinished: job.state === "waiting_output"
    };
}


function saveJob(player, job) {
    player.setDynamicProperty(
        JOB_PROPERTY,
        JSON.stringify(job)
    );
}

function clearJob(player) {
    player.setDynamicProperty(JOB_PROPERTY, undefined);
}

// ======================================
// AGRUPAR REQUISITOS REPETIDOS
// ======================================

function aggregateRequirements(requirements) {
    const totals = new Map();

    for (const requirement of requirements ?? []) {
        const current = totals.get(requirement.id) ?? 0;

        totals.set(
            requirement.id,
            current + requirement.amount
        );
    }

    return Array.from(totals, ([id, amount]) => ({
        id,
        amount
    }));
}

// ======================================
// COMPROBAR REQUISITOS
// ======================================

function checkRequirements(player, process) {
    const ingredients = aggregateRequirements(process.ingredients);
    const catalysts = aggregateRequirements(process.catalysts);

    const missingIngredients = ingredients.filter(item =>
        countItem(player, item.id) < item.amount
    );

    const missingCatalysts = catalysts.filter(item =>
        countItem(player, item.id) < item.amount
    );

    const hasRequiredLevel =
        getPlayerLevel(player) >= process.minPlayerLevel;

    return {
        ingredients,
        catalysts,
        missingIngredients,
        missingCatalysts,
        hasRequiredLevel
    };
}

// ======================================
// RESTAURAR OBJETOS
// ======================================

function restoreItem(container, itemId, amount) {
    let remaining = amount;

    try {
        const template = new ItemStack(itemId, 1);
        const maxStack = template.maxAmount;

        while (remaining > 0) {
            const amountToAdd = Math.min(remaining, maxStack);

            const leftover = container.addItem(
                new ItemStack(itemId, amountToAdd)
            );

            if (leftover) {
                console.warn(
                    `[Orespawn Reborn] No se pudo devolver todo ${itemId}.`
                );

                return false;
            }

            remaining -= amountToAdd;
        }

        return true;

    } catch (error) {
        console.warn(
            `[Orespawn Reborn] Error restaurando ${itemId}: ${error}`
        );

        return false;
    }
}

// ======================================
// CONSUMIR INGREDIENTES
// ======================================

function removeIngredients(player, requirements) {
    const container = getPlayerContainer(player);

    if (!container) {
        throw new Error("No se pudo acceder al inventario.");
    }

    // Comprobar todo antes de retirar cualquier objeto.
    for (const requirement of requirements) {
        if (countItem(player, requirement.id) < requirement.amount) {
            throw new Error(`Faltan materiales: ${requirement.id}`);
        }
    }

    const removedItems = [];

    try {
        for (const requirement of requirements) {
            let remaining = requirement.amount;

            for (let slot = 0; slot < container.size; slot++) {
                if (remaining <= 0) break;

                const item = container.getItem(slot);

                if (!item || item.typeId !== requirement.id) {
                    continue;
                }

                const amountToRemove = Math.min(
                    item.amount,
                    remaining
                );

                const newAmount = item.amount - amountToRemove;

                if (newAmount > 0) {
                    item.amount = newAmount;
                    container.setItem(slot, item);
                } else {
                    container.setItem(slot, undefined);
                }

                removedItems.push({
                    id: requirement.id,
                    amount: amountToRemove
                });

                remaining -= amountToRemove;
            }

            if (remaining > 0) {
                throw new Error(
                    `No se pudieron retirar todos los objetos: ${requirement.id}`
                );
            }
        }

    } catch (error) {
        // Si algo falla, intentamos devolver lo retirado.
        for (const removed of removedItems) {
            restoreItem(
                container,
                removed.id,
                removed.amount
            );
        }

        throw error;
    }
}

// ======================================
// INICIAR PRODUCCIÓN
// ======================================

export function startProduction(player, processId) {
    const process = getProcessById(processId);

    if (!process) {
        player.sendMessage("§cEse proceso no existe.");
        return false;
    }

    if (getActiveJob(player)) {
        player.sendMessage(
            "§cYa tienes un proceso en marcha."
        );

        return false;
    }

    const requirements = checkRequirements(player, process);

    if (!requirements.hasRequiredLevel) {
        player.sendMessage(
            `§cNecesitas nivel ${process.minPlayerLevel}.`
        );

        return false;
    }

    if (requirements.missingIngredients.length > 0) {
        player.sendMessage("§cNo tienes todos los ingredientes.");
        return false;
    }

    if (requirements.missingCatalysts.length > 0) {
        player.sendMessage("§cTe faltan catalizadores.");
        return false;
    }

    // Validar el objeto de salida antes de consumir materiales.
    try {
        new ItemStack(process.output, 1);
    } catch (error) {
        console.warn(
            `[Orespawn Reborn] Salida inválida en ${process.id}: ${error}`
        );

        player.sendMessage(
            "§cEl objeto de salida de este proceso no existe."
        );

        return false;
    }

    const job = {
        processId: process.id,
        processName: process.name,
        output: process.output,
        remainingAmount: process.outputAmount,
        finishAt: Date.now() + process.durationSeconds * 1000,
        state: "running",
        notifiedFull: false
    };

    let ingredientsRemoved = false;

    try {
        removeIngredients(
            player,
            requirements.ingredients
        );

        ingredientsRemoved = true;

        // Guardamos el trabajo antes de enviar mensajes.
        saveJob(player, job);

    } catch (error) {
        if (ingredientsRemoved) {
            const container = getPlayerContainer(player);

            if (container) {
                for (const ingredient of requirements.ingredients) {
                    restoreItem(
                        container,
                        ingredient.id,
                        ingredient.amount
                    );
                }
            }
        }

        console.warn(
            `[Orespawn Reborn] Error iniciando producción: ${error}`
        );

        player.sendMessage(
            "§cNo se pudo iniciar el proceso. Se intentó restaurar los materiales."
        );

        return false;
    }

    player.sendMessage(
        `§6[Orespawn] §aHas iniciado: §e${process.name}`
    );

    player.sendMessage(
        `§7Tiempo de procesamiento: §f${process.durationSeconds} segundos.`
    );

    return true;
}


export function cancelProduction(player) {
    const job = getActiveJob(player);

    if (!job) {
        player.sendMessage("§cNo tienes ningún proceso activo.");
        return false;
    }

    // Si el tiempo terminó, el proceso ya no se puede cancelar.
    if (job.state !== "running" || Date.now() >= job.finishAt) {
        if (job.state === "running") {
            job.state = "waiting_output";
            saveJob(player, job);
        }

        player.sendMessage(
            "§cEl procesamiento ya ha terminado y no se puede cancelar."
        );
        return false;
    }

    const process = getProcessById(job.processId);

    if (!process) {
        player.sendMessage("§cNo se encontró la receta original.");
        return false;
    }

    const container = getPlayerContainer(player);

    if (!container) {
        player.sendMessage("§cNo se pudo acceder a tu inventario.");
        return false;
    }

    try {
        const ingredients = aggregateRequirements(process.ingredients);

        for (const ingredient of ingredients) {
            let remaining = ingredient.amount;
            const template = new ItemStack(ingredient.id, 1);

            while (remaining > 0) {
                const amount = Math.min(remaining, template.maxAmount);
                const item = new ItemStack(ingredient.id, amount);
                const leftover = container.addItem(item);

                if (leftover) {
                    player.dimension.spawnItem(leftover, player.location);
                }

                remaining -= amount;
            }
        }

        clearJob(player);

        player.sendMessage(
            "§6[Orespawn] §aProceso cancelado."
        );
        player.sendMessage(
            "§eHas recuperado todos los ingredientes."
        );

        return true;

    } catch (error) {
        console.warn(
            `[Orespawn Reborn] Error cancelando producción: ${error}`
        );

        player.sendMessage(
            "§cOcurrió un error al devolver los ingredientes."
        );

        return false;
    }
}


// ======================================
// ENTREGAR RESULTADO
// ======================================

function deliverOutput(player, job) {
    const container = getPlayerContainer(player);

    if (!container) return;

    while (job.remainingAmount > 0) {
        const template = new ItemStack(job.output, 1);
        const amountToAdd = Math.min(
            job.remainingAmount,
            template.maxAmount
        );

        const leftover = container.addItem(
            new ItemStack(job.output, amountToAdd)
        );

        const delivered = leftover
            ? amountToAdd - leftover.amount
            : amountToAdd;

        job.remainingAmount -= delivered;

        if (leftover) {
            job.state = "waiting_output";
            saveJob(player, job);

            if (!job.notifiedFull) {
                job.notifiedFull = true;
                saveJob(player, job);

                player.sendMessage(
                    "§e[Orespawn] Tu inventario está lleno. Libera espacio para recibir el resultado."
                );
            }

            return;
        }

        // Guardar el progreso de entrega.
        if (job.remainingAmount > 0) {
            saveJob(player, job);
        }
    }

    const completedName = job.processName;

    clearJob(player);

    player.sendMessage(
        `§6[Orespawn] §a¡Proceso completado! §7${completedName} ha terminado.`
    );
}

// ======================================
// REVISAR TRABAJOS
// ======================================

function checkPlayerProduction(player) {
    const job = getActiveJob(player);

    if (!job) return;

    if (
        job.state === "running" &&
        Date.now() >= job.finishAt
    ) {
        job.state = "waiting_output";
        saveJob(player, job);
    }

    if (job.state === "waiting_output") {
        deliverOutput(player, job);
    }
}

// ======================================
// INICIALIZAR MOTOR
// ======================================

export function initializeProduction() {
    system.runInterval(() => {
        for (const player of world.getAllPlayers()) {
            try {
                checkPlayerProduction(player);
            } catch (error) {
                console.warn(
                    `[Orespawn Reborn] Error revisando producción de ${player.name}: ${error}`
                );
            }
        }
    }, CHECK_INTERVAL);

    console.warn(
        "[Orespawn Reborn] Motor de producción inicializado."
    );
}
