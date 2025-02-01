// nodeClusters.js
import { commands } from './commands.js';

export const nodeClusters = [
    {
        name: "Delay Sequence",
        description: "A sequence of delays for timing control",
        nodes: [
            { command: "DELAY", inputs: { milliseconds: "500" } },
            { command: "DELAY", inputs: { milliseconds: "1000" } },
            { command: "DELAY", inputs: { milliseconds: "2000" } }
        ]
    },
    {
        name: "Open Run Dialog",
        description: "Opens the Run dialog",
        nodes: [
            { command: "WINDOWS", inputs: {} },
            { command: "DELAY", inputs: { milliseconds: "300" } },
            { command: "STRING", inputs: { text: "run" } },
            { command: "ENTER", inputs: {} }
        ]
    },
    {
        name: "Admin CMD Shortcut",
        description: "Shortcut to open Command Prompt as administrator",
        nodes: [
            { command: "WINDOWS", inputs: {} },
            { command: "X", inputs: {} },
            { command: "A", inputs: {} }
        ]
    },
    {
        name: "Copy-Paste Sequence",
        description: "Performs a copy and paste operation",
        nodes: [
            { command: "CTRL", inputs: {} },
            { command: "C", inputs: {} },
            { command: "DELAY", inputs: { milliseconds: "250" } },
            { command: "CTRL", inputs: {} },
            { command: "V", inputs: {} }
        ]
    },
    {
        name: "Windows + Tab",
        description: "Opens the Task View",
        nodes: [
            { command: "WINDOWS", inputs: {} },
            { command: "TAB", inputs: {} }
        ]
    },
    {
        name: "Minimize All Windows",
        description: "Minimizes all open windows",
        nodes: [
            { command: "WINDOWS", inputs: {} },
            { command: "M", inputs: {} }
        ]
    },
    {
        name: "Task Manager",
        description: "Opens Task Manager",
        nodes: [
            { command: "CTRL", inputs: {} },
            { command: "SHIFT", inputs: {} },
            { command: "ESC", inputs: {} }
        ]
    },
    {
        name: "Lock Workstation",
        description: "Locks the workstation",
        nodes: [
            { command: "WINDOWS", inputs: {} },
            { command: "L", inputs: {} }
        ]
    },
    {
        name: "Screenshot",
        description: "Takes a screenshot (Windows 10+)",
        nodes: [
            { command: "WINDOWS", inputs: {} },
            { command: "SHIFT", inputs: {} },
            { command: "S", inputs: {} }
        ]
    },
    {
        name: "Windows Settings",
        description: "Opens Windows Settings",
        nodes: [
            { command: "WINDOWS", inputs: {} },
            { command: "I", inputs: {} }
        ]
    },
    {
        name: "Alt + F4 (Close Window)",
        description: "Closes the active window",
        nodes: [
            { command: "ALT", inputs: { key: "F4" } }
        ]
    },
    {
        name: "Windows + R (Run)",
        description: "Opens the Run dialog with a single command",
        nodes: [
            { command: "WINDOWS", inputs: { key: "r" } }
        ]
    },
    {
        name: "Ctrl + Shift + Esc",
        description: "Opens Task Manager directly",
        nodes: [
            { command: "CTRL", inputs: { key: "SHIFT" } },
            { command: "ESC", inputs: {} }
        ]
    }
];