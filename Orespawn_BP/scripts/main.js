import { world } from "@minecraft/server";

import { initializeCore } from "./systems/core.js";
import { initializeProgression } from "./systems/progression.js";
import { initializeAttributes } from "./systems/attributes.js";
import { initializeAdventurerBook } from "./systems/adventurerBook.js";
import { initializeCombat } from "./systems/combat.js";
import { initializeAttributeEffects } from "./systems/attributeEffects.js";
import { initializeKillRewards } from "./systems/rewards.js";

import { initializeRecipeDiscovery } from "./systems/recipeDiscovery.js";

// ======================================
// ORESPAWN REBORN - INICIALIZACIÓN
// ======================================

initializeCore();
initializeProgression();
initializeAttributes();

initializeCombat();
initializeAttributeEffects();
initializeKillRewards();

initializeAdventurerBook();

// MÓDULO 2
initializeRecipeDiscovery();