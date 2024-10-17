// workspaceManager.js
import { uiElements } from './uiElements.js';
import data from './dataStructures.js';

let scale = 1;
let panX = 0;
let panY = 0;

export function initializeWorkspaceManager() {
    setupZoom();
    setupPan();
}

function setupZoom() {
    uiElements.workspace.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        data.scale *= delta;
        data.scale = Math.max(0.1, Math.min(data.scale, 5)); // Limit zoom level
        updateWorkspaceTransform();
        updateBackgroundSize();
        updateAllConnections(); // Add this line
    });
}

function setupPan() {
    let isPanning = false;
    let startX, startY;

    uiElements.workspace.addEventListener('mousedown', (e) => {
        if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse button or left click + Ctrl
            isPanning = true;
            startX = e.clientX;
            startY = e.clientY;
        }
    });

    uiElements.workspace.addEventListener('mousemove', (e) => {
        if (isPanning) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panX += dx / scale;
            panY += dy / scale;
            uiElements.workspace.style.transform = `scale(${scale}) translate(${panX}px, ${panY}px)`;
            startX = e.clientX;
            startY = e.clientY;
        }
    });

    uiElements.workspace.addEventListener('mouseup', () => {
        isPanning = false;
    });
}

function updateBackgroundSize() {
    const newSize = 20 * scale;
    uiElements.workspace.style.backgroundSize = `${newSize}px ${newSize}px`;
}

export function updateWorkspaceTransform() {
    uiElements.workspace.style.transform = `scale(${data.scale}) translate(${data.panX / data.scale}px, ${data.panY / data.scale}px)`;
}

export function screenToWorkspaceCoordinates(x, y) {
    return {
        x: (x - data.panX) / data.scale,
        y: (y - data.panY) / data.scale
    };
}

export function workspaceToScreenCoordinates(x, y) {
    return {
        x: x * data.scale + data.panX,
        y: y * data.scale + data.panY
    };
}
