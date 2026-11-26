
import { initializeCore } from "./systems/core.js";
import { initializeProgression } from "./systems/progression.js";
import { initializeAttributes } from "./systems/attributes.js";
import { initializeAdventurerBook } from "./systems/adventurerBook.js";
import { initializeCombat } from "./systems/combat.js";
import { initializeAttributeEffects } from "./systems/attributeEffects.js";
import { initializeKillRewards } from "./systems/rewards.js";

import { initializeRecipeDiscovery } from "./systems/recipeDiscovery.js";
import { initializeCraftingStations } from "./systems/craftingStations.js";

import { initializeMaterialCatalog } from "./systems/materialCatalog.js";
import { initializeCustomMaterialCatalog } from "./systems/customMaterialCatalog.js";
import { initializeProcessingCatalog } from "./systems/processingCatalog.js";
import { initializeProduction } from "./systems/production.js";

import { initializeDeveloperCommands } from "./systems/developerCommands.js";

// ======================================
// MÓDULO 1 - RPG
// ======================================

initializeCore();
initializeProgression();
initializeAttributes();
initializeCombat();
initializeAttributeEffects();
initializeKillRewards();
initializeAdventurerBook();

// ======================================
// MÓDULO 2 - FABRICACIÓN Y MATERIALES
// ======================================

initializeMaterialCatalog();
initializeCustomMaterialCatalog();
initializeProcessingCatalog();

initializeRecipeDiscovery();
initializeDeveloperCommands();

initializeProduction();
initializeCraftingStations();

console.warn(
    "[Orespawn Reborn] Todos los módulos han sido inicializados."
);
