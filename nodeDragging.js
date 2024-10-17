// nodeDragging.js
import data from './dataStructures.js';
import { uiElements } from './uiElements.js';
import { updateConnections } from './connections.js';
import { screenToWorkspaceCoordinates, workspaceToScreenCoordinates } from './workspaceManager.js';

export function startDraggingNode(node, event) {
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = parseFloat(node.style.left);
    const startTop = parseFloat(node.style.top);

    function mouseMoveHandler(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // Calculate new position directly in workspace coordinates
        const newX = startLeft + dx / data.scale;
        const newY = startTop + dy / data.scale;
        
        node.style.left = `${newX}px`;
        node.style.top = `${newY}px`;
        
        // Update the node's position in the data structure
        const nodeData = data.nodes.find(n => n.id == node.dataset.id);
        if (nodeData) {
            nodeData.x = newX;
            nodeData.y = newY;
        }
        
        updateConnections(node.dataset.id);
    }

    function mouseUpHandler() {
        uiElements.workspace.removeEventListener('mousemove', mouseMoveHandler);
        uiElements.workspace.removeEventListener('mouseup', mouseUpHandler);
    }

    uiElements.workspace.addEventListener('mousemove', mouseMoveHandler);
    uiElements.workspace.addEventListener('mouseup', mouseUpHandler);
}