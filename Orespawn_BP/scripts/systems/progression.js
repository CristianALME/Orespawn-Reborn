
import { world } from "@minecraft/server";



export function initializeProgression() {
    world.afterEvents.playerSpawn.subscribe((event) => {
        const player = event.player;

        // Nivel inicial
        if (player.getDynamicProperty("or_level") === undefined) {
            player.setDynamicProperty("or_level", 1);
        }

        // Experiencia inicial
        if (player.getDynamicProperty("or_xp") === undefined) {
            player.setDynamicProperty("or_xp", 0);
        }

        // Puntos de habilidad
        if (player.getDynamicProperty("or_skill_points") === undefined) {
            player.setDynamicProperty("or_skill_points", 0);
        }
    });
}


export function getRequiredXP(level) {
    return level * 100;
}

export function addExperience(player, amount) {
    let level = player.getDynamicProperty("or_level") ?? 1;
    let xp = player.getDynamicProperty("or_xp") ?? 0;
    let points = player.getDynamicProperty("or_skill_points") ?? 0;

    xp += amount;

    while (xp >= getRequiredXP(level)) {
        xp -= getRequiredXP(level);
        level++;
        points++;

        player.sendMessage(
            `§6¡HAS SUBIDO AL NIVEL ${level}! §e+1 punto de habilidad`
        );
    }

    player.setDynamicProperty("or_level", level);
    player.setDynamicProperty("or_xp", xp);
    player.setDynamicProperty("or_skill_points", points);
}
