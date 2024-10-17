// scriptGenerator.js
import data from './dataStructures.js';
import { uiElements } from './uiElements.js';
import { commands } from './commands.js';
import { createNodeInstance } from './nodeInstance.js';
import { createConnection } from './connections.js';
import { updateAllConnections } from './connections.js';

export function initializeScriptGeneration() {
    uiElements.generateButton.addEventListener('click', function () {
        const script = generateScript();
        uiElements.outputArea.value = script.trim();
    });

    uiElements.copyButton.addEventListener('click', function () {
        uiElements.outputArea.select();
        document.execCommand('copy');
        alert('Script copied to clipboard!');
    });

    uiElements.downloadButton.addEventListener('click', function () {
        const script = uiElements.outputArea.value.trim();
        if (script) {
            downloadScript(script, 'duckyScript.txt');
        } else {
            alert('No script to download. Please generate the script first.');
        }
    });

    uiElements.newScriptButton.addEventListener('click', function () {
        if (confirm('Are you sure you want to start a new script? This will clear the current workspace.')) {
            clearWorkspace();
        }
    });

    initializeExampleSelector();
}

function initializeExampleSelector() {
    // Create the example modal
    const exampleModal = document.createElement('div');
    exampleModal.id = 'example-modal';
    exampleModal.className = 'modal';
    exampleModal.style.display = 'none';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => exampleModal.style.display = 'none';

    const title = document.createElement('h2');
    title.textContent = 'Select an Example';

    const exampleList = document.createElement('ul');
    exampleList.id = 'example-list';

    const examples = [
        { name: 'Open Website (Windows)', value: 'openWebsiteWindows' },
        { name: 'Text Editor Prank', value: 'textEditorPrank' },
        { name: 'Wi-Fi Password Stealer', value: 'wifiPasswordStealer' },
        { name: 'Rickroll', value: 'rickroll' }
    ];

    examples.forEach(example => {
        const listItem = document.createElement('li');
        listItem.textContent = example.name;
        listItem.onclick = () => {
            loadExampleScript(example.value);
            exampleModal.style.display = 'none';
        };
        exampleList.appendChild(listItem);
    });

    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(exampleList);
    exampleModal.appendChild(modalContent);

    document.body.appendChild(exampleModal);

    // Update the load example button to show the modal
    uiElements.loadExampleButton.addEventListener('click', function() {
        exampleModal.style.display = 'block';
    });

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == exampleModal) {
            exampleModal.style.display = 'none';
        }
    }
}

function loadExampleScript(exampleName) {
    clearWorkspace();
    switch (exampleName) {
        case 'openWebsiteWindows':
            loadOpenWebsiteWindowsExample();
            break;
        case 'textEditorPrank':
            loadTextEditorPrankExample();
            break;
        case 'wifiPasswordStealer':
            loadWifiPasswordStealerExample();
            break;
        case 'rickroll':
            loadRickrollExample();
            break;
        default:
            console.error('Unknown example:', exampleName);
            return;
    }
    
    // After loading any example, update node positions and refresh connections
    setTimeout(refreshNodePositionsAndConnections, 50);
}

function refreshNodePositionsAndConnections() {
    updateNodePositions();
    updateAllConnections();
}

function updateNodePositions() {
    const workspaceRect = uiElements.workspace.getBoundingClientRect();
    data.nodes.forEach(node => {
        if (node.element) {
            const rect = node.element.getBoundingClientRect();
            node.x = (rect.left - workspaceRect.left) / data.scale;
            node.y = (rect.top - workspaceRect.top) / data.scale;
        }
    });
}

function loadOpenWebsiteWindowsExample() {
    const cmds = [
        { cmd: 'WINDOWS', x: 100, y: 50 },
        { cmd: 'STRING', x: 300, y: 50, inputs: { text: 'r' } },
        { cmd: 'DELAY', x: 500, y: 50, inputs: { milliseconds: '500' } },
        { cmd: 'STRING', x: 700, y: 50, inputs: { text: 'https://www.example.com' } },
        { cmd: 'ENTER', x: 900, y: 50 },
    ];

    createNodesAndConnections(cmds);
}

function loadTextEditorPrankExample() {
    const cmds = [
        { cmd: 'WINDOWS', x: 100, y: 50 },
        { cmd: 'STRING', x: 300, y: 50, inputs: { text: 'notepad' } },
        { cmd: 'ENTER', x: 500, y: 50 },
        { cmd: 'DELAY', x: 700, y: 50, inputs: { milliseconds: '1000' } },
        { cmd: 'STRING', x: 100, y: 150, inputs: { text: 'You\'ve been pranked!' } },
        { cmd: 'ENTER', x: 300, y: 150 },
        { cmd: 'STRING', x: 500, y: 150, inputs: { text: 'Your computer will explode in 5 seconds...' } },
        { cmd: 'ENTER', x: 700, y: 150 },
        { cmd: 'DELAY', x: 900, y: 150, inputs: { milliseconds: '5000' } },
        { cmd: 'STRING', x: 100, y: 250, inputs: { text: 'Just kidding! Have a nice day :)' } },
    ];

    createNodesAndConnections(cmds);
}

function loadWifiPasswordStealerExample() {
    const cmds = [
        { cmd: 'WINDOWS', x: 100, y: 50 },
        { cmd: 'STRING', x: 300, y: 50, inputs: { text: 'cmd' } },
        { cmd: 'ENTER', x: 500, y: 50 },
        { cmd: 'DELAY', x: 700, y: 50, inputs: { milliseconds: '1000' } },
        { cmd: 'STRING', x: 100, y: 150, inputs: { text: 'netsh wlan show profile' } },
        { cmd: 'ENTER', x: 300, y: 150 },
        { cmd: 'STRING', x: 500, y: 150, inputs: { text: 'netsh wlan show profile name="WIFI_NAME" key=clear' } },
        { cmd: 'ENTER', x: 700, y: 150 },
    ];

    createNodesAndConnections(cmds);
}

function loadRickrollExample() {
    const cmds = [
        { cmd: 'WINDOWS', x: 100, y: 50 },
        { cmd: 'STRING', x: 300, y: 50, inputs: { text: 'r' } },
        { cmd: 'DELAY', x: 500, y: 50, inputs: { milliseconds: '500' } },
        { cmd: 'STRING', x: 700, y: 50, inputs: { text: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } },
        { cmd: 'ENTER', x: 900, y: 50 },
    ];

    createNodesAndConnections(cmds);
}

function createNodesAndConnections(cmds) {
    cmds.forEach(cmdData => {
        const cmd = commands.find(c => c.name === cmdData.cmd) || { name: cmdData.cmd, inputs: [] };
        createNodeInstanceAtPosition(cmd, cmdData.x, cmdData.y, cmdData.inputs);
    });

    // Create connections
    for (let i = 0; i < data.nodes.length - 1; i++) {
        createConnection(data.nodes[i].element, data.nodes[i + 1].element);
    }
}

function createNodeInstanceAtPosition(cmd, x, y, inputs = {}) {
    const nodeElement = document.createElement('div');
    nodeElement.classList.add('node');
    nodeElement.style.left = x + 'px';
    nodeElement.style.top = y + 'px';
    nodeElement.dataset.id = data.nodeIdCounter++;
    nodeElement.dataset.command = cmd.name;

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

    const inputsContainer = document.createElement('div');
    inputsContainer.classList.add('inputs');
    cmd.inputs.forEach(inputName => {
        const inputField = document.createElement('div');
        inputField.classList.add('input-field');
        inputField.innerHTML = `<label>${inputName}: <input type="text" data-input="${inputName}" value="${inputs[inputName] || ''}"></label>`;
        inputsContainer.appendChild(inputField);
    });
    nodeElement.appendChild(inputsContainer);

    // Event listeners
    nodeElement.addEventListener('mousedown', (event) => {
        if (!event.target.classList.contains('output-connector') && 
            !event.target.classList.contains('input-connector') && 
            event.target.tagName.toLowerCase() !== 'input') {
            selectNode(nodeElement);
            startDraggingNode(nodeElement, event);
        }
    });

    // Connectors
    outputConnector.addEventListener('mousedown', (event) => {
        event.stopPropagation();
        startConnection(nodeElement, event);
    });

    inputConnector.addEventListener('mouseup', (event) => {
        event.stopPropagation();
        completeConnection(nodeElement);
    });

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
        inputs: { ...inputs, connectionInput: false },
        outputs: [],
    });
}

function clearWorkspace() {
    uiElements.workspace.innerHTML = '';
    data.nodes = [];
    data.connections = [];
    data.nodeIdCounter = 0;
    uiElements.outputArea.value = '';
}

function generateScript() {
    console.log("Starting generateScript");
    const scriptLines = [];
    const visited = new Set();

    const startNodes = data.nodes.filter(node =>
        !data.connections.some(conn => conn.to === node.id)
    );
    console.log("Start nodes:", startNodes.map(node => node.id));

    if (startNodes.length === 0) {
        console.log("No starting nodes found");
        alert('No starting node found. Please ensure at least one node is not connected from an input.');
        return '';
    }

    const connectedNodes = new Set();
    function markConnectedNodes(nodeId) {
        if (connectedNodes.has(nodeId)) return;
        connectedNodes.add(nodeId);
        console.log(`Marking node ${nodeId} as connected`);
        const connections = data.connections.filter(conn => conn.from === nodeId);
        console.log(`Node ${nodeId} has ${connections.length} outgoing connections`);
        connections.forEach(conn => markConnectedNodes(conn.to));
    }

    markConnectedNodes(startNodes[0].id);

    console.log("Connected nodes:", Array.from(connectedNodes));

    const disconnectedNodes = data.nodes.filter(node => !connectedNodes.has(node.id));
    console.log("Disconnected nodes:", disconnectedNodes.map(node => node.id));

    if (disconnectedNodes.length > 0) {
        const confirmation = confirm(`There are ${disconnectedNodes.length} disconnected nodes in the workspace. Do you want to generate the script without these nodes?`);
        if (!confirmation) {
            console.log("User cancelled script generation due to disconnected nodes");
            return '';
        }
    }

    try {
        traverseAndBuildScript(startNodes[0].id, visited, scriptLines, connectedNodes);
    } catch (e) {
        console.error("Error during script generation:", e.message);
        alert('Error: ' + e.message);
        return '';
    }

    console.log("Final script:", scriptLines);
    return scriptLines.join('\n');
}

function traverseAndBuildScript(nodeId, visited, scriptLines, connectedNodes, recursionStack = new Set()) {
    console.log(`Traversing node: ${nodeId}`);
    
    if (recursionStack.has(nodeId)) {
        console.error(`Cycle detected at node: ${nodeId}`);
        throw new Error('Cycle detected in the node connections. Please remove cycles.');
    }

    if (visited.has(nodeId)) {
        console.log(`Node ${nodeId} already visited, skipping`);
        return;
    }

    if (!connectedNodes.has(nodeId)) {
        console.log(`Node ${nodeId} is not connected, skipping`);
        return;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const nodeData = data.nodes.find(n => n.id == nodeId);
    
    if (nodeData.cluster) {
        // Handle cluster nodes
        console.log(`Processing cluster node: ${nodeData.cluster}`);
        nodeData.nodes.forEach(clusterNode => {
            const commandLine = generateCommandLine(clusterNode);
            console.log(`Generated command line for cluster node: ${commandLine}`);
            scriptLines.push(commandLine);
        });
    } else {
        const commandLine = generateCommandLine(nodeData);
        console.log(`Generated command line for node ${nodeId}: ${commandLine}`);
        scriptLines.push(commandLine);
    }

    const connections = data.connections.filter(conn => conn.from === nodeId);
    console.log(`Node ${nodeId} has ${connections.length} outgoing connections`);
    connections.forEach(conn => {
        console.log(`Following connection from ${conn.from} to ${conn.to}`);
        traverseAndBuildScript(conn.to, visited, scriptLines, connectedNodes, recursionStack);
    });

    recursionStack.delete(nodeId);
    console.log(`Finished traversing node: ${nodeId}`);
}
function generateCommandLine(nodeData) {
    let line = nodeData.command;
    for (const [inputName, inputValue] of Object.entries(nodeData.inputs)) {
        if (inputValue !== '' && inputName !== 'connectionInput') {
            line += ` ${inputValue}`;
        }
    }
    return line;
}
function downloadScript(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

import { selectNode } from './nodeSelection.js';
import { startDraggingNode } from './nodeDragging.js';
import { startConnection, completeConnection } from './connections.js';