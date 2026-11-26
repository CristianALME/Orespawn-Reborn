import { ItemStack, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import { spendSkillPoint } from "./skills.js";
import { showRecipeCatalog } from "./recipeCatalog.js";

// ======================================
// MENÚ DEL AVENTURERO
// ======================================

function showAdventurerMenu(player) {

    const level = player.getDynamicProperty("or_level") ?? 1;
    const xp = player.getDynamicProperty("or_xp") ?? 0;
    const points = player.getDynamicProperty("or_skill_points") ?? 0;

    const strength = player.getDynamicProperty("or_strength") ?? 1;
    const defense = player.getDynamicProperty("or_defense") ?? 1;
    const vitality = player.getDynamicProperty("or_vitality") ?? 1;
    const agility = player.getDynamicProperty("or_agility") ?? 1;

    const requiredXP = level * 100;

    const form = new ActionFormData()
        .title("§6§lLIBRO DEL AVENTURERO")
        .body(
            `§eNIVEL: §f${level}\n` +
            `§aEXPERIENCIA: §f${xp}/${requiredXP}\n` +
            `§dPUNTOS DE HABILIDAD: §f${points}\n\n` +
            `§c⚔ Fuerza: §f${strength}\n` +
            `§7🛡 Defensa: §f${defense}\n` +
            `§c❤ Vitalidad: §f${vitality}\n` +
            `§b✦ Agilidad: §f${agility}\n\n` +
            `§6Selecciona una habilidad para mejorarla.`
        )
        .button("⚔ Mejorar fuerza")
        .button("🛡 Mejorar defensa")
        .button("❤ Mejorar vitalidad")
        .button("✦ Mejorar agilidad")
        .button("⚒ Forja y recetas")
        .button("Cerrar");

    form.show(player).then(response => {

        if (response.canceled) return;

        const skills = [
            "strength",
            "defense",
            "vitality",
            "agility"
        ];

        if (response.selection < 4) {

            spendSkillPoint(
                player,
                skills[response.selection]
            );

            system.run(() => {
                showAdventurerMenu(player);
            });

            return;
        }

        if (response.selection === 4) {
            showRecipeCatalog(player);
        }

    }).catch(error => {
        console.warn(
            `[Orespawn Reborn] Error del menú: ${error}`
        );
    });
}

// ======================================
// INICIALIZACIÓN DEL LIBRO
// ======================================

export function initializeAdventurerBook() {

    system.beforeEvents.startup.subscribe(event => {

        event.itemComponentRegistry.registerCustomComponent(
            "orespawn:open_adventurer_book",
            {
                onUse: useEvent => {

                    system.run(() => {
                        showAdventurerMenu(useEvent.source);
                    });

                }
            }
        );

    });

    world.afterEvents.playerSpawn.subscribe(event => {

        const player = event.player;

        if (player.getDynamicProperty("or_book_received")) {
            return;
        }

        system.run(() => {

            try {

                if (player.getDynamicProperty("or_book_received")) {
                    return;
                }

                const inventory = player.getComponent(
                    "minecraft:inventory"
                );

                if (!inventory || !inventory.container) {
                    return;
                }

                const remaining = inventory.container.addItem(
                    new ItemStack("orespawn:adventurer_book", 1)
                );

                if (remaining) {
                    player.dimension.spawnItem(
                        remaining,
                        player.location
                    );
                }

                player.setDynamicProperty(
                    "or_book_received",
                    true
                );

                player.sendMessage(
                    "§6¡Has recibido el Libro del Aventurero!"
                );

            } catch (error) {

                console.warn(
                    `[Orespawn Reborn] Error entregando el libro: ${error}`
                );

            }

        });

    });

}