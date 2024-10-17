// nodeInstance.js
import data from './dataStructures.js';
import { uiElements } from './uiElements.js';
import { selectNode } from './nodeSelection.js';
import { startDraggingNode } from './nodeDragging.js';
import { startConnection, completeConnection } from './connections.js';
import { screenToWorkspaceCoordinates } from './workspaceManager.js';

export function createNodeCluster(cluster, x, y) {
    const nodeElement = document.createElement('div');
    nodeElement.classList.add('node', 'cluster-node');
   
    const workspaceCoords = screenToWorkspaceCoordinates(x, y);
    nodeElement.style.left = workspaceCoords.x + 'px';
    nodeElement.style.top = workspaceCoords.y + 'px';
   
    nodeElement.dataset.id = data.nodeIdCounter++;
    nodeElement.dataset.cluster = cluster.name;

    // Node title
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = cluster.name;
    nodeElement.appendChild(title);

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

    // Add to nodes array
    data.nodes.push({
        id: nodeElement.dataset.id,
        element: nodeElement,
        cluster: cluster.name,
        nodes: cluster.nodes,
        outputs: [],
        x: workspaceCoords.x,
        y: workspaceCoords.y
    });
}

export function createNodeInstance(cmd, x, y) {
    const nodeElement = document.createElement('div');
    nodeElement.classList.add('node');
   
    // Convert screen coordinates to workspace coordinates
    const workspaceCoords = screenToWorkspaceCoordinates(x, y);
    nodeElement.style.left = workspaceCoords.x + 'px';
    nodeElement.style.top = workspaceCoords.y + 'px';
   
    nodeElement.dataset.id = data.nodeIdCounter++;
    nodeElement.dataset.command = cmd.name;

    // Node title
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = cmd.name;
    nodeElement.appendChild(title);

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

    // Add to nodes array
    data.nodes.push({
        id: nodeElement.dataset.id,
        element: nodeElement,
        command: cmd.name,
        inputs: {},
        outputs: [],
        x: workspaceCoords.x,
        y: workspaceCoords.y
    });
}