
import { world, system } from "@minecraft/server";
import { getAttribute } from "./attributes.js";

function applyPlayerEffects(player) {
    const vitality = getAttribute(player, "vitality");
    const agility = getAttribute(player, "agility");

    // Cada cinco puntos se desbloquea un nuevo tramo.
    const vitalityLevel = Math.floor(vitality / 5) - 1;
    const agilityLevel = Math.floor(agility / 5) - 1;

    try {
        if (vitalityLevel >= 0) {
            player.addEffect("health_boost", 80, {
                amplifier: vitalityLevel,
                showParticles: false
            });
        }

        if (agilityLevel >= 0) {
            player.addEffect("speed", 80, {
                amplifier: agilityLevel,
                showParticles: false
            });
        }
    } catch (error) {
        console.warn(`[Orespawn Reborn] Error aplicando atributos: ${error}`);
    }
}

export function initializeAttributeEffects() {
    system.runInterval(() => {
        for (const player of world.getPlayers()) {
            applyPlayerEffects(player);
        }
    }, 40);
}
