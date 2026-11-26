import { world, system } from "@minecraft/server";

export function sendMessage(player, message) {
    player.sendMessage(
        `§6[ORESPAWN REBORN] §r${message}`
    );
}

export function broadcastMessage(message) {
    system.run(() => {
        try {
            world.sendMessage(
                `§6[ORESPAWN REBORN] §r${message}`
            );
        } catch (error) {
            console.warn(
                `[Orespawn Reborn] Error enviando mensaje global: ${error}`
            );
        }
    });
}
