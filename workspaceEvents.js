import { uiElements } from './uiElements.js';
import data from './dataStructures.js';
import { deselectNode } from './nodeSelection.js';
import { updateAllConnections } from './connections.js';

let isPanning = false;
let startX, startY;
let currentTransform = { x: 0, y: 0 };
let scale = 1;
const zoomSensitivity = 0.1;

export function initializeWorkspaceEvents() {
    uiElements.workspace.addEventListener('mousedown', (event) => {
        if (event.target === uiElements.workspace) {
            deselectNode();
        }
        startPanning(event);
    });

    uiElements.workspace.addEventListener('mousemove', panWorkspace);
    
    uiElements.workspace.addEventListener('mouseup', stopPanning);
    uiElements.workspace.addEventListener('mouseleave', stopPanning);
    
    uiElements.workspace.addEventListener('wheel', zoomWorkspace);

    // Initial update of background pattern
    updateBackgroundPattern();
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
    updateWorkspaceTransform();
}

function setupZoom() {
    uiElements.workspace.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
        data.scale += delta;
        data.scale = Math.max(0.2, Math.min(data.scale, 3)); // Limit zoom level
        updateWorkspaceTransform();
        updateBackgroundSize();
        updateAllConnections();
    });
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
    
    updateWorkspaceTransform();
    updateBackgroundPattern();
    updateAllConnections();
}

// New function to update background pattern
function updateBackgroundPattern() {
    const backgroundPattern = document.getElementById('background-pattern');
    if (backgroundPattern) {
        backgroundPattern.style.backgroundSize = `${20 * scale}px ${20 * scale}px`;
    }
}

// New function to update workspace transform
function updateWorkspaceTransform() {
    uiElements.workspace.style.transform = `translate(${currentTransform.x}px, ${currentTransform.y}px) scale(${scale})`;
}

export function screenToWorkspaceCoordinates(x, y) {
    return {
        x: (x - data.panX) / data.scale,
        y: (y - data.panY) / data.scale
    };
}

export function getCurrentTransform() {
    return { scale: data.scale, x: data.panX, y: data.panY };
}

export function getScaleAwareOffset(offsetPixels) {
    return offsetPixels / data.scale;
}