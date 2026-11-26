
import { world } from "@minecraft/server";
import { addExperience } from "./progression.js";

export function rewardXP(player, amount, reason = "Recompensa") {
    if (!player || !Number.isFinite(amount) || amount <= 0) {
        return;
    }

    addExperience(player, amount);

    player.sendMessage(
        `§a+${amount} XP §7| §f${reason}`
    );
}

export function initializeKillRewards() {
    world.afterEvents.entityDie.subscribe((event) => {
        const attacker = event.damageSource.damagingEntity;
        const defeated = event.deadEntity;

        if (!attacker || attacker.typeId !== "minecraft:player") {
            return;
        }

        if (defeated.typeId === "minecraft:player") {
            return;
        }

        rewardXP(attacker, 25, "Criatura derrotada");
    });
}
