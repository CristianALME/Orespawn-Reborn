
import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    system
} from "@minecraft/server";

// ======================================
// ORESPAWN REBORN - COMANDOS DE JUGADOR
// ======================================

const MAX_LEVEL = 100;

export function initializeDeveloperCommands() {

    system.beforeEvents.startup.subscribe(event => {

        event.customCommandRegistry.registerCommand(
            {
                name: "orespawn:nivel",
                description: "Sube tu nivel de personaje.",
                permissionLevel: CommandPermissionLevel.Any,
                cheatsRequired: false,

                mandatoryParameters: [
                    {
                        name: "nivel",
                        type: CustomCommandParamType.Integer
                    }
                ]
            },

            (origin, args) => {

                // Los parámetros llegan dentro de un array.
                const targetLevel = args[0];

                const player = origin.initiator ?? origin.sourceEntity;

                if (!player || player.typeId !== "minecraft:player") {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "Este comando solo puede utilizarse desde un jugador."
                    };
                }

                if (
                    !Number.isInteger(targetLevel) ||
                    targetLevel < 1 ||
                    targetLevel > MAX_LEVEL
                ) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: `El nivel debe estar entre 1 y ${MAX_LEVEL}.`
                    };
                }

                system.run(() => {

                    const currentLevel =
                        player.getDynamicProperty("or_level") ?? 1;

                    const currentPoints =
                        player.getDynamicProperty("or_skill_points") ?? 0;

                    // Evita bajar de nivel o repetir una subida.
                    if (targetLevel <= currentLevel) {
                        player.sendMessage(
                            "§cSolo puedes establecer un nivel superior al actual."
                        );
                        return;
                    }

                    const levelsGained = targetLevel - currentLevel;
                    const newPoints = currentPoints + levelsGained;

                    player.setDynamicProperty("or_level", targetLevel);
                    player.setDynamicProperty("or_xp", 0);
                    player.setDynamicProperty("or_skill_points", newPoints);

                    player.sendMessage(
                        `§6[Orespawn] §a¡Has alcanzado el nivel §e${targetLevel}§a!`
                    );

                    player.sendMessage(
                        `§6[Orespawn] §e+${levelsGained} §apuntos de habilidad.`
                    );

                    player.sendMessage(
                        `§6[Orespawn] §aPuntos disponibles: §e${newPoints}`
                    );
                });

                return {
                    status: CustomCommandStatus.Success,
                    message: "Comando de nivel ejecutado."
                };
            }
        );

    });

}
