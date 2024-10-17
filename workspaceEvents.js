import { uiElements } from './uiElements.js';
import { deselectNode } from './nodeSelection.js';

let isPanning = false;
let startX, startY;
let currentTransform = { x: 0, y: 0 };
let scale = 1;
const zoomSensitivity = 0.1;

export function initializeWorkspaceEvents() {
    // Existing deselection logic
    uiElements.workspace.addEventListener('mousedown', (event) => {
        if (event.target === uiElements.workspace) {
            deselectNode();
        }
        startPanning(event); // Start panning if necessary
    });

    uiElements.workspace.addEventListener('mousemove', (event) => {
        panWorkspace(event); // Handle panning when mouse is moving
    });

    uiElements.workspace.addEventListener('mouseup', () => {
        stopPanning(); // Stop panning when mouse is released
    });

    uiElements.workspace.addEventListener('mouseleave', () => {
        stopPanning(); // Stop panning if the mouse leaves the workspace
    });

    // Zoom event for scaling the workspace
    uiElements.workspace.addEventListener('wheel', (event) => {
        zoomWorkspace(event); // Handle zooming
    });
}

// Helper function to start panning
function startPanning(event) {
    if (event.target !== uiElements.workspace) return; // Only pan if the workspace is clicked
    isPanning = true;
    startX = event.clientX - currentTransform.x;
    startY = event.clientY - currentTransform.y;
    uiElements.workspace.style.cursor = 'move'; // Change cursor to indicate panning
}

// Helper function to handle panning
function panWorkspace(event) {
    if (!isPanning) return;
    currentTransform.x = event.clientX - startX;
    currentTransform.y = event.clientY - startY;
    uiElements.workspace.style.transform = `translate(${currentTransform.x}px, ${currentTransform.y}px) scale(${scale})`;
}

// Helper function to stop panning
function stopPanning() {
    isPanning = false;
    uiElements.workspace.style.cursor = 'default'; // Reset cursor
}

// Helper function to handle zooming
function zoomWorkspace(event) {
    event.preventDefault(); // Prevent default scrolling behavior
    const delta = event.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
    scale += delta;

    // Limit the zoom scale to avoid too much zoom in/out
    scale = Math.min(Math.max(0.2, scale), 3);

    // Apply scaling and current panning transform
    uiElements.workspace.style.transform = `translate(${currentTransform.x}px, ${currentTransform.y}px) scale(${scale})`;
}
