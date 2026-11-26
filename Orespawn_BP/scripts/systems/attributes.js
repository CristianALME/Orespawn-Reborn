
import { world } from "@minecraft/server";

export const DEFAULT_ATTRIBUTES = {
    strength: 1,
    defense: 1,
    vitality: 1,
    agility: 1
};

export function initializeAttributes() {
    world.afterEvents.playerSpawn.subscribe((event) => {
        const player = event.player;

        for (const [attribute, value] of Object.entries(DEFAULT_ATTRIBUTES)) {
            const property = `or_${attribute}`;

            if (player.getDynamicProperty(property) === undefined) {
                player.setDynamicProperty(property, value);
            }
        }
    });
}

export function getAttribute(player, attribute) {
    if (!Object.prototype.hasOwnProperty.call(DEFAULT_ATTRIBUTES, attribute)) {
        return 1;
    }

    return player.getDynamicProperty(`or_${attribute}`) ?? 1;
}

export function increaseAttribute(player, attribute, amount = 1) {
    if (!Object.prototype.hasOwnProperty.call(DEFAULT_ATTRIBUTES, attribute)) {
        return false;
    }

    if (!Number.isInteger(amount) || amount <= 0) {
        return false;
    }

    const current = getAttribute(player, attribute);

    player.setDynamicProperty(`or_${attribute}`, current + amount);

    return true;
}
