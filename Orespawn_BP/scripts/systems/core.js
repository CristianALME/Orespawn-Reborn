import { world } from "@minecraft/server";

export function initializeCore() {

    world.afterEvents.playerSpawn.subscribe((event) => {

        if (event.initialSpawn) {

            event.player.sendMessage(
                "§6[ORESPAWN REBORN] §aSistema principal iniciado correctamente."
            );

            event.player.sendMessage(
                "§eOrespawn Reborn está despertando..."
            );

        }

    });

}