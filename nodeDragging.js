// nodeDragging.js
import data from './dataStructures.js';
import { uiElements } from './uiElements.js';
import { updateConnections } from './connections.js';
import { screenToWorkspaceCoordinates } from './workspaceManager.js';

export function startDraggingNode(node, event) {
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = parseInt(node.style.left);
    const startTop = parseInt(node.style.top);

    function mouseMoveHandler(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        const newCoords = screenToWorkspaceCoordinates(startLeft + dx, startTop + dy);
        
        node.style.left = newCoords.x + 'px';
        node.style.top = newCoords.y + 'px';
        
        updateConnections(node.dataset.id);
    }

    function mouseUpHandler() {
        uiElements.workspace.removeEventListener('mousemove', mouseMoveHandler);
        uiElements.workspace.removeEventListener('mouseup', mouseUpHandler);
    }

    uiElements.workspace.addEventListener('mousemove', mouseMoveHandler);
    uiElements.workspace.addEventListener('mouseup', mouseUpHandler);
}