
import { increaseAttribute } from "./attributes.js";

const AVAILABLE_SKILLS = [
    "strength",
    "defense",
    "vitality",
    "agility"
];

export function spendSkillPoint(player, skill) {
    if (!AVAILABLE_SKILLS.includes(skill)) {
        return false;
    }

    const points = player.getDynamicProperty("or_skill_points") ?? 0;

    if (points <= 0) {
        player.sendMessage("§cNo tienes puntos de habilidad disponibles.");
        return false;
    }

    const success = increaseAttribute(player, skill, 1);

    if (!success) {
        return false;
    }

    player.setDynamicProperty("or_skill_points", points - 1);

    player.sendMessage(
        `§a¡Has mejorado ${skill}! §ePuntos restantes: ${points - 1}`
    );

    return true;
}
