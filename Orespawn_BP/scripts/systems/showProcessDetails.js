
function showProductionStatus(player, stationName) {
    const status = getProductionStatus(player);

    let body;

    if (!status) {
        body =
            "§7No tienes ningún proceso activo.\n\n" +
            "§eCuando inicies un procesamiento, " +
            "podrás consultar aquí su progreso.";
    } else {
        body =
            `§6Proceso: §f${status.processName}\n` +
            `§6Resultado: §f${status.output}\n` +
            `§6Cantidad pendiente: §f${status.remainingAmount}\n\n`;

        if (status.state === "running") {
            body +=
                `§eTiempo restante: §f${status.remainingSeconds} segundos\n\n` +
                "§7El material todavía se está procesando.";
        } else {
            body +=
                "§a¡El procesamiento ha terminado!\n\n" +
                "§7Esperando espacio en tu inventario para entregar el resultado.";
        }
    }

    const form = new ActionFormData()
        .title("§6§lPRODUCCIÓN")
        .body(body);

    if (status && status.state === "running") {
        form.button("§bActualizar información");
    }

    form.button("§eVolver a la forja");

    form.show(player).then(response => {
        if (response.canceled || response.selection === undefined) {
            return;
        }

        if (status && status.state === "running" &&
            response.selection === 0) {
            showProductionStatus(player, stationName);
            return;
        }

        showProcessingStation(player, stationName);
    }).catch(error => {
        console.warn(
            `[Orespawn Reborn] Error consultando producción: ${error}`
        );
    });
}
