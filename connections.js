// connections.js

import data from './dataStructures.js';
import { uiElements } from './uiElements.js';
import { workspaceToScreenCoordinates, screenToWorkspaceCoordinates } from './workspaceManager.js';

export function startConnection(nodeElement, event) {
    event.stopPropagation();
    
    // Cancel any existing connection attempt
    if (data.isConnecting) {
        cancelConnection();
    }
    
    data.isConnecting = true;
    data.connectionStartNode = nodeElement;

    // Create temporary line
    data.temporaryConnection = document.createElement('div');
    data.temporaryConnection.classList.add('connection', 'temporary');
    uiElements.workspace.appendChild(data.temporaryConnection);

    function mouseMoveHandler(e) {
        if (data.isConnecting && data.connectionStartNode) {
            updateTemporaryConnection(e.clientX, e.clientY);
        }
    }

    function mouseUpHandler(e) {
        if (data.isConnecting && data.connectionStartNode) {
            if (e.target.classList.contains('input-connector') && e.target.parentElement !== data.connectionStartNode) {
                completeConnection(e.target.parentElement);
            } else {
                cancelConnection();
            }
        }
    }

    uiElements.workspace.addEventListener('mousemove', mouseMoveHandler);
    uiElements.workspace.addEventListener('mouseup', mouseUpHandler);

    // Store the event listeners for later removal
    data.currentConnectionListeners = { mouseMoveHandler, mouseUpHandler };
}

function updateTemporaryConnection(mouseX, mouseY) {
    if (!data.connectionStartNode) return;
    
    const startNodeData = data.nodes.find(n => n.id == data.connectionStartNode.dataset.id);
    if (!startNodeData) return;

    // Convert mouse to workspace coords
    const workspaceRect = uiElements.workspace.getBoundingClientRect();
    const workspaceX = (mouseX - workspaceRect.left - data.panX) / data.scale;
    const workspaceY = (mouseY - workspaceRect.top - data.panY) / data.scale;

    // Apply scale to element dimensions
    const startX = startNodeData.x + (startNodeData.element.offsetWidth / data.scale);
    const startY = startNodeData.y + (startNodeData.element.offsetHeight / data.scale / 2);

    drawConnection(data.temporaryConnection, startX, startY, workspaceX, workspaceY);
}

export function completeConnection(targetNode) {
    if (data.connectionStartNode && targetNode !== data.connectionStartNode) {
        const startNodeId = data.connectionStartNode.dataset.id;
        const endNodeId = targetNode.dataset.id;

        // Check if connection already exists
        const existingConnection = data.connections.find(c => c.from === startNodeId && c.to === endNodeId);
        if (!existingConnection) {
            try {
                createConnection(data.connectionStartNode, targetNode);
            } catch (e) {
                alert(e.message);
            }
        }
    }
    cancelConnection();
}

function cancelConnection() {
    data.isConnecting = false;
    if (data.temporaryConnection && data.temporaryConnection.parentNode) {
        data.temporaryConnection.parentNode.removeChild(data.temporaryConnection);
    }
    data.temporaryConnection = null;
    data.connectionStartNode = null;

    // Remove event listeners
    if (data.currentConnectionListeners) {
        uiElements.workspace.removeEventListener('mousemove', data.currentConnectionListeners.mouseMoveHandler);
        uiElements.workspace.removeEventListener('mouseup', data.currentConnectionListeners.mouseUpHandler);
        data.currentConnectionListeners = null;
    }
}

export function createConnection(fromNode, toNode) {
    // Check for cycles
    if (createsCycle(fromNode.dataset.id, toNode.dataset.id)) {
        throw new Error('Cannot create connection: it would create a cycle.');
    }

    const connection = document.createElement('div');
    connection.classList.add('connection');
    uiElements.workspace.appendChild(connection);

    const newConnection = {
        from: fromNode.dataset.id,
        to: toNode.dataset.id,
        element: connection
    };

    data.connections.push(newConnection);

    const fromNodeData = data.nodes.find(n => n.id == fromNode.dataset.id);
    const toNodeData = data.nodes.find(n => n.id == toNode.dataset.id);
    
    fromNodeData.outputs.push(toNode.dataset.id);
    
    // Check if toNodeData is a cluster or a regular node
    if (toNodeData.cluster) {
        // For cluster nodes, we don't need to set connectionInput
        toNodeData.hasInput = true;
    } else {
        // For regular nodes, set connectionInput as before
        if (!toNodeData.inputs) {
            toNodeData.inputs = {};
        }
        toNodeData.inputs.connectionInput = true;
    }

    updateConnectionPosition(newConnection);

    // Make the new connection removable
    makeConnectionRemovable(connection, newConnection);
}

function makeConnectionRemovable(connectionElement, connectionData) {
    connectionElement.style.cursor = 'pointer';

    // Highlight connection on hover
    connectionElement.addEventListener('mouseenter', () => {
        connectionElement.style.backgroundColor = '#ff0000'; // Change color on hover
        connectionElement.style.height = '4px';
    });

    connectionElement.addEventListener('mouseleave', () => {
        connectionElement.style.backgroundColor = '#007bff'; // Revert color
        connectionElement.style.height = '2px';
    });

    connectionElement.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent triggering other click events

        if (confirm('Do you want to remove this connection?')) {
            // Remove connection from the DOM
            uiElements.workspace.removeChild(connectionElement);

            // Remove connection from the connections array
            data.connections = data.connections.filter(conn => conn !== connectionData);

            // Remove the output from the fromNode's outputs
            const fromNode = data.nodes.find(n => n.id == connectionData.from);
            fromNode.outputs = fromNode.outputs.filter(outputId => outputId !== connectionData.to);

            // Remove the input from the toNode's inputs
            const toNode = data.nodes.find(n => n.id == connectionData.to);
            if (toNode.cluster) {
                toNode.hasInput = false;
            } else if (toNode.inputs) {
                toNode.inputs.connectionInput = false;
            }
        }
    });
}

function createsCycle(fromNodeId, toNodeId) {
    const visited = new Set();
    
    function dfs(currentNodeId) {
        if (currentNodeId === fromNodeId) {
            return true;
        }
        if (visited.has(currentNodeId)) {
            return false;
        }
        visited.add(currentNodeId);
        const nodeData = data.nodes.find(n => n.id == currentNodeId);
        
        // If the current node is a cluster, don't consider its internal nodes
        if (!nodeData.cluster) {
            for (const outputId of nodeData.outputs) {
                if (dfs(outputId)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Start DFS from the toNodeId
    return dfs(toNodeId);
}

export function updateAllConnections() {
    data.connections.forEach(updateConnectionPosition);
}

export function updateConnectionPosition(connection) {
    const fromNode = data.nodes.find(n => n.id == connection.from);
    const toNode = data.nodes.find(n => n.id == connection.to);

    if (!fromNode || !toNode) return;

    // Scale element dimensions here too
    const fromX = fromNode.x + (fromNode.element.offsetWidth / data.scale);
    const fromY = fromNode.y + (fromNode.element.offsetHeight / data.scale / 2);
    const toX = toNode.x;
    const toY = toNode.y + (toNode.element.offsetHeight / data.scale / 2);

    drawConnection(connection.element, fromX, fromY, toX, toY);
}

function drawConnection(element, x1, y1, x2, y2) {
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    element.style.width = `${length}px`;
    element.style.left = `${x1}px`;
    element.style.top = `${y1}px`;
    element.style.transform = `rotate(${angle}deg)`;
}

export function updateConnections(nodeId) {
    data.connections.forEach(conn => {
        if (conn.from === nodeId || conn.to === nodeId) {
            updateConnectionPosition(conn);
        }
    });
}