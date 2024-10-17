# BadUSB Maker

BadUSB Maker is a web-based tool for creating and editing BadUSB scripts using a visual node-based interface. It allows users to easily construct complex BadUSB sequences without needing to manually write the script.

## 🌐 Live Demo

You can try out the BadUSB Maker here: [https://jaylikesbunda.github.io/BadUSB-Maker/](https://jaylikesbunda.github.io/BadUSB-Maker/)

## Features

- Visual node-based interface for creating BadUSB scripts
- Drag-and-drop functionality for easy script creation
- Pre-defined command nodes for common BadUSB operations
- Cluster nodes for grouping common sequences of commands
- Real-time script generation
- Ability to load example scripts
- Copy generated script to clipboard or download as a file
- Responsive design for use on various devices

## Changelog

For a list of changes and updates, please see the [Changelog](https://github.com/jaylikesbunda/BadUSB-Maker/blob/main/changelog.md).

## How to Use

1. **Add Nodes**: Drag command nodes or cluster nodes from the left panel into the workspace.
2. **Connect Nodes**: Click and drag from one node's output connector to another node's input connector to create a sequence.
3. **Configure Nodes**: Some nodes have input fields. Fill these in to customize the command.
4. **Generate Script**: Click the "Generate Script" button to see the resulting BadUSB script.
5. **Copy or Download**: Use the "Copy to Clipboard" or "Download Script" buttons to save your work.

## Commands

BadUSB Maker supports a wide range of commands, including:

- Basic keystrokes (WINDOWS, CONTROL, ALT, SHIFT, etc.)
- Special keys (ENTER, TAB, ESC, function keys, etc.)
- Text input (STRING, STRINGLN)
- Delays and default delay settings
- And more!

## 🧩 Clusters

Clusters are pre-defined groups of commands for common operations, such as:

- Opening the Run dialog
- Launching Command Prompt as administrator
- Performing copy-paste operations
- Taking screenshots
- And more!

## Tips

- Use the "Load Example" button to see pre-made scripts and learn how to structure your own.
- Hover over nodes to see descriptions of what each command does.
- Use clusters to quickly add common sequences of commands to your script.

## 🔧 Development

This project is built using vanilla JavaScript, HTML, and CSS.

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features, find any bugs, or want to improve the documentation, please open an issue or submit a pull request.

## 📞 Contact

If you have any questions or feedback, please open an issue on this GitHub repository.

