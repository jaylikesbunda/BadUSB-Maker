// commands.js
export const commands = [
    // Comments and Delays
    { name: 'REM', inputs: ['comment'], description: 'Adds a comment.' },
    { name: 'DEFAULTDELAY', inputs: ['delay'], description: 'Sets the default delay between commands in milliseconds.' },
    { name: 'DEFAULTCHARDELAY', inputs: ['delay'], description: 'Sets the default delay between keystrokes in milliseconds.' },
    { name: 'DELAY', inputs: ['milliseconds'], description: 'Pauses execution for a specified time.' },
    
    // Text Input
    { name: 'STRING', inputs: ['text'], description: 'Types out a string.' },
    { name: 'STRINGLN', inputs: ['text'], description: 'Types out a string and presses Enter.' },
    { name: 'REPEAT', inputs: ['times'], description: 'Repeats the last command.' },
    
    // Modifier Keys with Parameters
    { name: 'WINDOWS', inputs: ['key'], description: 'Windows key + optional key (e.g., r,e,d,etc).' },
    { name: 'GUI', inputs: ['key'], description: 'Alias for WINDOWS key + optional key.' },
    { name: 'CONTROL', inputs: ['key'], description: 'Control key + optional key (e.g., ESC, BREAK, F1-F12, etc).' },
    { name: 'CTRL', inputs: ['key'], description: 'Alias for CONTROL key + optional key.' },
    { name: 'ALT', inputs: ['key'], description: 'Alt key + optional key (END, ESC, F1-F12, SPACE, TAB, etc).' },
    { name: 'SHIFT', inputs: ['key'], description: 'Shift key + optional key (DELETE, HOME, INSERT, PAGEUP, etc).' },
    
    // Basic Keys
    { name: 'ENTER', inputs: [], description: 'Presses the Enter key.' },
    { name: 'MENU', inputs: [], description: 'Presses the Menu key.' },
    { name: 'APP', inputs: [], description: 'Alias for MENU key.' },
    { name: 'TAB', inputs: [], description: 'Presses the Tab key.' },
    { name: 'CAPSLOCK', inputs: [], description: 'Toggles Caps Lock.' },
    { name: 'PRINTSCREEN', inputs: [], description: 'Presses the Print Screen key.' },
    { name: 'SCROLLLOCK', inputs: [], description: 'Toggles Scroll Lock.' },
    { name: 'PAUSE', inputs: [], description: 'Presses the Pause key.' },
    { name: 'BREAK', inputs: [], description: 'Presses the Break key.' },
    
    // Navigation Keys
    { name: 'INSERT', inputs: [], description: 'Presses the Insert key.' },
    { name: 'HOME', inputs: [], description: 'Presses the Home key.' },
    { name: 'PAGEUP', inputs: [], description: 'Presses the Page Up key.' },
    { name: 'PAGEDOWN', inputs: [], description: 'Presses the Page Down key.' },
    { name: 'DELETE', inputs: [], description: 'Presses the Delete key.' },
    { name: 'END', inputs: [], description: 'Presses the End key.' },
    { name: 'ESC', inputs: [], description: 'Presses the Escape key.' },
    { name: 'ESCAPE', inputs: [], description: 'Alias for ESC key.' },
    
    // Arrow Keys
    { name: 'UP', inputs: [], description: 'Presses the Up Arrow key.' },
    { name: 'DOWN', inputs: [], description: 'Presses the Down Arrow key.' },
    { name: 'LEFT', inputs: [], description: 'Presses the Left Arrow key.' },
    { name: 'RIGHT', inputs: [], description: 'Presses the Right Arrow key.' },
    { name: 'UPARROW', inputs: [], description: 'Alias for UP key.' },
    { name: 'DOWNARROW', inputs: [], description: 'Alias for DOWN key.' },
    { name: 'LEFTARROW', inputs: [], description: 'Alias for LEFT key.' },
    { name: 'RIGHTARROW', inputs: [], description: 'Alias for RIGHT key.' },
    
    // Special Keys
    { name: 'SPACE', inputs: [], description: 'Presses the Space key.' },
    { name: 'NUMLOCK', inputs: [], description: 'Toggles Num Lock.' },
    
    // Function Keys
    { name: 'F1', inputs: [], description: 'Presses the F1 key.' },
    { name: 'F2', inputs: [], description: 'Presses the F2 key.' },
    { name: 'F3', inputs: [], description: 'Presses the F3 key.' },
    { name: 'F4', inputs: [], description: 'Presses the F4 key.' },
    { name: 'F5', inputs: [], description: 'Presses the F5 key.' },
    { name: 'F6', inputs: [], description: 'Presses the F6 key.' },
    { name: 'F7', inputs: [], description: 'Presses the F7 key.' },
    { name: 'F8', inputs: [], description: 'Presses the F8 key.' },
    { name: 'F9', inputs: [], description: 'Presses the F9 key.' },
    { name: 'F10', inputs: [], description: 'Presses the F10 key.' },
    { name: 'F11', inputs: [], description: 'Presses the F11 key.' },
    { name: 'F12', inputs: [], description: 'Presses the F12 key.' }
];