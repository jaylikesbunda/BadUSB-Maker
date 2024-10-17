// scriptGenerator.js
import data from './dataStructures.js';
import { uiElements } from './uiElements.js';
import { commands } from './commands.js';
import { createNodeInstance } from './nodeInstance.js';
import { createConnection } from './connections.js';
import { updateAllConnections } from './connections.js';
import { updateConnections } from './connections.js';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const HORIZONTAL_SPACING = 250;
const VERTICAL_SPACING = 150;
const INITIAL_X = 100;
const INITIAL_Y = 50;

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
            // You can customize the prefix based on the script content or user input
            const prefix = getScriptPrefix(script);
            downloadScript(script, prefix);
        } else {
            alert('No script to download. Please generate the script first.');
        }
    });

    uiElements.newScriptButton.addEventListener('click', function () {
        if (confirm('Are you sure you want to start a new script? This will clear the current workspace.')) {
            clearWorkspace();
        }
    });
    initializeFileLoading();
    initializeExampleSelector();
}

// Helper function to determine a suitable prefix
function getScriptPrefix(script) {
    // This is a simple example. You can make this more sophisticated based on your needs.
    if (script.includes('WINDOWS')) {
        return 'windows_script';
    } else if (script.includes('STRING')) {
        return 'text_input_script';
    } else {
        return 'ducky_script';
    }
}

export function initializeFileLoading() {
    uiElements.loadFileButton.addEventListener('click', () => {
        uiElements.fileInput.click();
    });

    uiElements.fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                loadScriptFromContent(content);
            };
            reader.readAsText(file);
        }
    });
}
function loadScriptFromContent(content) {
    clearWorkspace();
    const lines = content.split('\n');
    let x = INITIAL_X;
    let y = INITIAL_Y;
    let prevNode = null;

    lines.forEach((line, index) => {
        line = line.trim();
        if (line) {
            const [cmd, ...args] = line.split(' ');
            const command = commands.find(c => c.name === cmd);
            if (command) {
                const nodeElement = createNodeInstanceAtPosition(command, x, y, {});
                if (args.length > 0 && command.inputs.length > 0) {
                    const input = nodeElement.querySelector(`input[data-input="${command.inputs[0]}"]`);
                    if (input) {
                        input.value = args.join(' ');
                        const nodeData = data.nodes.find(n => n.id == nodeElement.dataset.id);
                        nodeData.inputs[command.inputs[0]] = args.join(' ');
                    }
                }
                if (prevNode) {
                    createConnection(prevNode, nodeElement);
                }
                prevNode = nodeElement;
                
                // Update x and y for next node
                x += HORIZONTAL_SPACING;
                if (x > INITIAL_X + HORIZONTAL_SPACING * 3) {
                    x = INITIAL_X;
                    y += VERTICAL_SPACING;
                }
            }
        }
    });

    refreshNodePositionsAndConnections();
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
        { cmd: 'WINDOWS', x: INITIAL_X, y: INITIAL_Y },
        { cmd: 'STRING', x: INITIAL_X + HORIZONTAL_SPACING, y: INITIAL_Y, inputs: { text: 'r' } },
        { cmd: 'DELAY', x: INITIAL_X + HORIZONTAL_SPACING * 2, y: INITIAL_Y, inputs: { milliseconds: '500' } },
        { cmd: 'STRING', x: INITIAL_X, y: INITIAL_Y + VERTICAL_SPACING, inputs: { text: 'https://www.example.com' } },
        { cmd: 'ENTER', x: INITIAL_X + HORIZONTAL_SPACING, y: INITIAL_Y + VERTICAL_SPACING },
    ];
    createNodesAndConnections(cmds);
}

function loadTextEditorPrankExample() {
    const cmds = [
        { cmd: 'WINDOWS', x: INITIAL_X, y: INITIAL_Y },
        { cmd: 'STRING', x: INITIAL_X + HORIZONTAL_SPACING, y: INITIAL_Y, inputs: { text: 'notepad' } },
        { cmd: 'ENTER', x: INITIAL_X + HORIZONTAL_SPACING * 2, y: INITIAL_Y },
        { cmd: 'DELAY', x: INITIAL_X, y: INITIAL_Y + VERTICAL_SPACING, inputs: { milliseconds: '1000' } },
        { cmd: 'STRING', x: INITIAL_X + HORIZONTAL_SPACING, y: INITIAL_Y + VERTICAL_SPACING, inputs: { text: 'You\'ve been pranked!' } },
        { cmd: 'ENTER', x: INITIAL_X + HORIZONTAL_SPACING * 2, y: INITIAL_Y + VERTICAL_SPACING },
        { cmd: 'STRING', x: INITIAL_X, y: INITIAL_Y + VERTICAL_SPACING * 2, inputs: { text: 'Your computer will explode in 5 seconds...' } },
        { cmd: 'ENTER', x: INITIAL_X + HORIZONTAL_SPACING, y: INITIAL_Y + VERTICAL_SPACING * 2 },
        { cmd: 'DELAY', x: INITIAL_X + HORIZONTAL_SPACING * 2, y: INITIAL_Y + VERTICAL_SPACING * 2, inputs: { milliseconds: '5000' } },
        { cmd: 'STRING', x: INITIAL_X, y: INITIAL_Y + VERTICAL_SPACING * 3, inputs: { text: 'Just kidding! Have a nice day :)' } },
    ];
    createNodesAndConnections(cmds);
}

function loadWifiPasswordStealerExample() {
    const cmds = [
        { cmd: 'WINDOWS', x: INITIAL_X, y: INITIAL_Y },
        { cmd: 'STRING', x: INITIAL_X + HORIZONTAL_SPACING, y: INITIAL_Y, inputs: { text: 'cmd' } },
        { cmd: 'ENTER', x: INITIAL_X + HORIZONTAL_SPACING * 2, y: INITIAL_Y },
        { cmd: 'DELAY', x: INITIAL_X, y: INITIAL_Y + VERTICAL_SPACING, inputs: { milliseconds: '1000' } },
        { cmd: 'STRING', x: INITIAL_X + HORIZONTAL_SPACING, y: INITIAL_Y + VERTICAL_SPACING, inputs: { text: 'netsh wlan show profile' } },
        { cmd: 'ENTER', x: INITIAL_X + HORIZONTAL_SPACING * 2, y: INITIAL_Y + VERTICAL_SPACING },
        { cmd: 'STRING', x: INITIAL_X, y: INITIAL_Y + VERTICAL_SPACING * 2, inputs: { text: 'netsh wlan show profile name="WIFI_NAME" key=clear' } },
        { cmd: 'ENTER', x: INITIAL_X + HORIZONTAL_SPACING, y: INITIAL_Y + VERTICAL_SPACING * 2 },
    ];
    createNodesAndConnections(cmds);
}

function loadRickrollExample() {
    const cmds = [
        { cmd: 'WINDOWS', x: INITIAL_X, y: INITIAL_Y },
        { cmd: 'STRING', x: INITIAL_X + HORIZONTAL_SPACING, y: INITIAL_Y, inputs: { text: 'r' } },
        { cmd: 'DELAY', x: INITIAL_X + HORIZONTAL_SPACING * 2, y: INITIAL_Y, inputs: { milliseconds: '500' } },
        { cmd: 'STRING', x: INITIAL_X, y: INITIAL_Y + VERTICAL_SPACING, inputs: { text: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } },
        { cmd: 'ENTER', x: INITIAL_X + HORIZONTAL_SPACING, y: INITIAL_Y + VERTICAL_SPACING },
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
    nodeElement.style.width = NODE_WIDTH + 'px';
    nodeElement.style.height = NODE_HEIGHT + 'px';
    nodeElement.dataset.id = data.nodeIdCounter++;
    nodeElement.dataset.command = cmd.name;

    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = cmd.name;
    nodeElement.appendChild(title);

    // Add delete button
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
    outputConnector.style.right = '-6px';
    outputConnector.style.top = (NODE_HEIGHT / 2) + 'px';
    nodeElement.appendChild(outputConnector);

    // Input connector
    const inputConnector = document.createElement('div');
    inputConnector.classList.add('input-connector');
    inputConnector.style.left = '-6px';
    inputConnector.style.top = (NODE_HEIGHT / 2) + 'px';
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
    const newNode = {
        id: nodeElement.dataset.id,
        element: nodeElement,
        command: cmd.name,
        inputs: { ...inputs, connectionInput: false },
        outputs: [],
        x: x,
        y: y
    };
    data.nodes.push(newNode);

    // Update connections for the new node
    updateConnections(newNode.id);

    return nodeElement;
}

// Make sure to include the deleteNode function in scriptGenerator.js
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
function downloadScript(content, filenamePrefix = 'duckyScript') {
    const now = new Date();
    const timestamp = now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const filename = `${filenamePrefix}_${timestamp}.txt`;

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