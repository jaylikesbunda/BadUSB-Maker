// nodePanel.js
import { commands } from './commands.js';
import { nodeClusters } from './nodeClusters.js';
import { uiElements } from './uiElements.js';
import { createNodeInstance, createNodeCluster } from './nodeInstance.js';

export function loadCommandsIntoPanel() {
    // Add cluster items
    nodeClusters.forEach(cluster => {
        const clusterItem = document.createElement('div');
        clusterItem.classList.add('node-item', 'cluster-item');
        clusterItem.textContent = cluster.name;
        clusterItem.title = cluster.description;
        clusterItem.addEventListener('mousedown', (event) => {
            event.preventDefault();
            createNodeCluster(cluster, event.clientX, event.clientY);
        });
        uiElements.nodeList.appendChild(clusterItem);
    });

    // Add a separator
    const separator = document.createElement('hr');
    uiElements.nodeList.appendChild(separator);

    // Add individual command items
    commands.forEach(cmd => {
        const nodeItem = document.createElement('div');
        nodeItem.classList.add('node-item');
        nodeItem.textContent = cmd.name;
        nodeItem.title = cmd.description;
        nodeItem.addEventListener('mousedown', (event) => {
            event.preventDefault();
            createNodeInstance(cmd, event.clientX, event.clientY);
        });
        uiElements.nodeList.appendChild(nodeItem);
    });
}