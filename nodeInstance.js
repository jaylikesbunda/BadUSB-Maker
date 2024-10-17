// nodeInstance.js
import data from './dataStructures.js';
import { uiElements } from './uiElements.js';
import { selectNode } from './nodeSelection.js';
import { startDraggingNode } from './nodeDragging.js';
import { startConnection, completeConnection } from './connections.js';
import { screenToWorkspaceCoordinates, getCurrentTransform, getScaleAwareOffset } from './workspaceManager.js';

const SPAWN_OFFSET_X = 500; // pixels

export function createNodeCluster(cluster, mouseX, mouseY) {
    const { x, y } = screenToWorkspaceCoordinates(mouseX, mouseY);
    const scaleAwareOffset = getScaleAwareOffset(SPAWN_OFFSET_X);
    
    const nodeElement = document.createElement('div');
    nodeElement.classList.add('node', 'cluster-node');
   
    nodeElement.style.left = (x + scaleAwareOffset) + 'px';
    nodeElement.style.top = y + 'px';
   
    nodeElement.dataset.id = data.nodeIdCounter++;
    nodeElement.dataset.cluster = cluster.name;

    // Node title
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = cluster.name;
    nodeElement.appendChild(title);

    // Add delete button
    const deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '&times;'; // Unicode for "×"
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (confirm('Are you sure you want to delete this cluster?')) {
            deleteNode(nodeElement.dataset.id);
        }
    });
    nodeElement.appendChild(deleteButton);

    // Output connector
    const outputConnector = document.createElement('div');
    outputConnector.classList.add('output-connector');
    nodeElement.appendChild(outputConnector);

    // Input connector
    const inputConnector = document.createElement('div');
    inputConnector.classList.add('input-connector');
    nodeElement.appendChild(inputConnector);

    // Event listeners for dragging nodes
    nodeElement.addEventListener('mousedown', (event) => {
        if (!event.target.classList.contains('output-connector') &&
            !event.target.classList.contains('input-connector')) {
            selectNode(nodeElement);
            startDraggingNode(nodeElement, event);
        }
    });

    // Event listeners for connectors
    outputConnector.addEventListener('mousedown', (event) => {
        startConnection(nodeElement, event);
    });

    inputConnector.addEventListener('mouseup', (event) => {
        event.stopPropagation();
        completeConnection(nodeElement);
    });

    uiElements.workspace.appendChild(nodeElement);

    data.nodes.push({
        id: nodeElement.dataset.id,
        element: nodeElement,
        cluster: cluster.name,
        nodes: cluster.nodes,
        outputs: [],
        x: x + scaleAwareOffset,
        y: y
    });
}

// Add this function to handle node deletion
function deleteNode(nodeId) {
    const node = data.nodes.find(n => n.id == nodeId);
    if (!node) return;

    // Remove the node element from the DOM
    if (node.element && node.element.parentNode) {
        node.element.parentNode.removeChild(node.element);
    }

    // Remove all connections to and from this node
    data.connections = data.connections.filter(conn => {
        if (conn.from == nodeId || conn.to == nodeId) {
            if (conn.element && conn.element.parentNode) {
                conn.element.parentNode.removeChild(conn.element);
            }
            return false;
        }
        return true;
    });

    // Remove the node from the data structure
    data.nodes = data.nodes.filter(n => n.id != nodeId);
}

export function createNodeInstance(cmd, mouseX, mouseY) {
    const { x, y } = screenToWorkspaceCoordinates(mouseX, mouseY);
    const scaleAwareOffset = getScaleAwareOffset(SPAWN_OFFSET_X);
    
    const nodeElement = document.createElement('div');
    nodeElement.classList.add('node');
   
    nodeElement.style.left = (x + scaleAwareOffset) + 'px';
    nodeElement.style.top = y + 'px';
   
    nodeElement.dataset.id = data.nodeIdCounter++;
    nodeElement.dataset.command = cmd.name;

    // Node title
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = cmd.name;
    nodeElement.appendChild(title);

    const deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '&times;'; // Unicode for "×"
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (confirm('Are you sure you want to delete this node?')) {
            deleteNode(nodeElement.dataset.id);
        }
    });
    nodeElement.appendChild(deleteButton);

    // Output connector
    const outputConnector = document.createElement('div');
    outputConnector.classList.add('output-connector');
    nodeElement.appendChild(outputConnector);

    // Input connector
    const inputConnector = document.createElement('div');
    inputConnector.classList.add('input-connector');
    nodeElement.appendChild(inputConnector);

    // Inputs container
    const inputsContainer = document.createElement('div');
    inputsContainer.classList.add('inputs');
    cmd.inputs.forEach(inputName => {
        const inputField = document.createElement('div');
        inputField.classList.add('input-field');
        inputField.innerHTML = `<label>${inputName}: <input type="text" data-input="${inputName}"></label>`;
        inputsContainer.appendChild(inputField);
    });
    nodeElement.appendChild(inputsContainer);

    // Event listeners for dragging nodes
    nodeElement.addEventListener('mousedown', (event) => {
        if (!event.target.classList.contains('output-connector') &&
            !event.target.classList.contains('input-connector') &&
            event.target.tagName.toLowerCase() !== 'input') {
            selectNode(nodeElement);
            startDraggingNode(nodeElement, event);
        }
    });

    // Event listeners for connectors
    outputConnector.addEventListener('mousedown', (event) => {
        startConnection(nodeElement, event);
    });

    inputConnector.addEventListener('mouseup', (event) => {
        event.stopPropagation();
        completeConnection(nodeElement);
    });

    // Event listeners for inputs
    nodeElement.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const nodeId = nodeElement.dataset.id;
            const nodeData = data.nodes.find(n => n.id == nodeId);
            nodeData.inputs[input.dataset.input] = input.value;
        });
    });

    uiElements.workspace.appendChild(nodeElement);

    data.nodes.push({
        id: nodeElement.dataset.id,
        element: nodeElement,
        command: cmd.name,
        inputs: {},
        outputs: [],
        x: x + scaleAwareOffset,
        y: y
    });
}