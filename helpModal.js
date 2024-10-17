// helpModal.js
import { uiElements } from './uiElements.js';

export function initializeHelpModal() {
    uiElements.helpButton.addEventListener('click', function () {
        uiElements.modalBackground.style.display = 'block';
        uiElements.helpModal.style.display = 'block';
    });

    uiElements.closeHelpModal.addEventListener('click', function () {
        uiElements.modalBackground.style.display = 'none';
        uiElements.helpModal.style.display = 'none';
    });

    uiElements.modalBackground.addEventListener('click', function () {
        uiElements.modalBackground.style.display = 'none';
        uiElements.helpModal.style.display = 'none';
    });

// Populate help content
const helpContent = `
    <h3>Basics</h3>
    <ul>
        <li><strong>Add Nodes:</strong> Drag commands from left panel to workspace</li>
        <li><strong>Connect Nodes:</strong> Drag from output (right) to input (left) connector</li>
        <li><strong>Edit Nodes:</strong> Click to select, edit values directly</li>
        <li><strong>Disconnect Nodes:</strong> Click on a connection line to remove it</li>
        <li><strong>Generate:</strong> Click "Generate Script" button</li>
    </ul>
    <h3>Workspace</h3>
    <ul>
        <li><strong>Pan:</strong> Middle mouse or Ctrl + Left mouse</li>
        <li><strong>Zoom:</strong> Mouse wheel</li>
    </ul>
    <h3>Features</h3>
    <ul>
        <li><strong>Node Clusters:</strong> Pre-defined command sets</li>
        <li><strong>Copy/Download:</strong> Export your script</li>
        <li><strong>New/Load:</strong> Start over or load examples</li>
    </ul>
    <h3>Tips</h3>
    <ul>
        <li>Start with a node without incoming connections</li>
        <li>Use DELAY between actions</li>
        <li>Avoid connection cycles</li>
        <li>Test scripts in a safe environment</li>
    </ul>
`;

document.getElementById('help-content').innerHTML = helpContent;
}