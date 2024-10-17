// nodeSelection.js
import data from './dataStructures.js';

export function selectNode(node) {
    deselectNode();
    data.selectedNode = node;
    node.classList.add('selected');
}

export function deselectNode() {
    if (data.selectedNode) {
        data.selectedNode.classList.remove('selected');
        data.selectedNode = null;
    }
}
