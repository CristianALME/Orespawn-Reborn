
import { world } from "@minecraft/server";
import { getAttribute } from "./attributes.js";

export function initializeCombat() {
    world.beforeEvents.entityHurt.subscribe((event) => {
        const target = event.hurtEntity;
        const attacker = event.damageSource.damagingEntity;

        // Defensa del jugador que recibe el golpe.
        if (target.typeId === "minecraft:player") {
            const defense = getAttribute(target, "defense");
            const reduction = Math.min(0.75, (defense - 1) * 0.02);

            event.damage *= 1 - reduction;
        }

        // Fuerza del jugador que causa el daño.
        if (attacker && attacker.typeId === "minecraft:player") {
            const strength = getAttribute(attacker, "strength");
            const bonus = (strength - 1) * 0.02;

            event.damage *= 1 + bonus;
        }
    });
}
