// main.js
import { loadCommandsIntoPanel } from './nodePanel.js';
import { initializeWorkspaceEvents } from './workspaceEvents.js';
import { initializeScriptGeneration } from './scriptGenerator.js';
import { initializeHelpModal } from './helpModal.js';

document.addEventListener('DOMContentLoaded', function () {
    loadCommandsIntoPanel();
    initializeWorkspaceEvents();
    initializeScriptGeneration();
    initializeHelpModal();
});
