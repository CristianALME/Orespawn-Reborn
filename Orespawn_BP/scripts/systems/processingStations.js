
import { ActionFormData } from "@minecraft/server-ui";


import {
    getProcessesByStation,
    getProcessingStatus
} from "./processing.js";

import {
    startProduction,
    getProductionStatus,
    cancelProduction
} from "./production.js";

function getPlayerLevel(player) {
    return player.getDynamicProperty("or_level") ?? 1;
}


function showProductionStatus(player, stationName) {
    const status = getProductionStatus(player);

    let body;

    if (!status) {
        body = "§7No tienes ningún proceso activo.";
    } else {
        body =
            `§6Proceso: §f${status.processName}\n` +
            `§6Resultado: §f${status.output}\n` +
            `§6Cantidad pendiente: §f${status.remainingAmount}\n\n`;

        if (status.state === "running") {
            body += `§eTiempo restante: §f${status.remainingSeconds} segundos`;
        } else {
            body += "§a¡Procesamiento terminado!\n" +
                "§7Esperando espacio en tu inventario.";
        }
    }

    const form = new ActionFormData()
        .title("§6§lPRODUCCIÓN")
        .body(body);

    if (status && status.state === "running") {
        form.button("§bActualizar información");
        form.button("§cCancelar procesamiento");
    }

    form.button("§eVolver a la forja");

    form.show(player).then(response => {
        if (response.canceled || response.selection === undefined) {
            return;
        }

        if (status && status.state === "running") {
            if (response.selection === 0) {
                showProductionStatus(player, stationName);
                return;
            }

            if (response.selection === 1) {
                cancelProduction(player);
                showProductionStatus(player, stationName);
                return;
            }
        }

        showProcessingStation(player, stationName);

    }).catch(error => {
        console.warn(
            `[Orespawn Reborn] Error consultando producción: ${error}`
        );
    });
}


function showProcessDetails(player, stationName, process) {
    const playerLevel = getPlayerLevel(player);

    const status = getProcessingStatus(
        player,
        process,
        playerLevel
    );

    let body =
        `§6Tipo: §f${process.type}\n` +
        `§6Estación: §f${process.station}\n` +
        `§6Duración: §f${process.durationSeconds} segundos\n` +
        `§6Tu nivel: §f${playerLevel}\n` +
        `§6Nivel requerido: §f${process.minPlayerLevel}\n\n`;

    body += "§eINGREDIENTES\n\n";

    for (const ingredient of status.ingredients) {
        const ready = ingredient.missing === 0;

        body += `${ready ? "§a✓" : "§c✗"} §f${ingredient.id}\n`;
        body += `§7Tienes ${ingredient.owned} / ${ingredient.amount}`;

        if (!ready) {
            body += ` §c(Faltan ${ingredient.missing})`;
        }

        body += "\n\n";
    }

    if (status.catalysts.length > 0) {
        body += "§eCATALIZADORES\n\n";

        for (const catalyst of status.catalysts) {
            const ready = catalyst.missing === 0;

            body += `${ready ? "§a✓" : "§c✗"} §f${catalyst.id}\n`;
            body += `§7Tienes ${catalyst.owned} / ${catalyst.amount}\n\n`;
        }
    }

    body += status.hasRequiredLevel
        ? "§aNivel suficiente."
        : `§cNecesitas nivel ${status.requiredLevel}.`;

    body += "\n\n";

    body += status.canProcess
        ? "§aDispones de todos los requisitos."
        : "§cTodavía no cumples todos los requisitos.";

    body += "\n\n§7Los ingredientes se consumirán al iniciar. Los catalizadores se conservarán.";

    const form = new ActionFormData()
        .title(`§6${process.name}`)
        .body(body);

    if (status.canProcess) {
        form.button("§aIniciar proceso");
    }

    form.button("§eVolver");

    form.show(player).then(response => {
        if (response.canceled || response.selection === undefined) {
            return;
        }

        if (status.canProcess && response.selection === 0) {
            const started = startProduction(player, process.id);

            if (started) {
                return;
            }

            // Si el inicio falla, regresamos al detalle
            // para que el jugador pueda revisar los requisitos.
            showProcessDetails(player, stationName, process);
            return;
        }

        showProcessingStation(player, stationName);

    }).catch(error => {
        console.warn(
            `[Orespawn Reborn] Error mostrando proceso: ${error}`
        );
    });
}

export function openProcessingStation(player, stationName) {
    showProcessingStation(player, stationName);
}
