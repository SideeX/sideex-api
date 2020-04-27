export default {
    "open": {
        name: "open",
        target: "A URL",
        value: "X",
        description: "Open a webpage."
    },
    "selectWindow": {
        name: "selectWindow",
        target: "Auto-generated",
        value: "X",
        description: "Select the target window. This command is intended to be auto-generated while recording."
    },
    "selectFrame": {
        name: "selectFrame",
        target: "index=0 (Select the first frame of index 0), or relative=parent (Select the parent frame), or relative=top (Select the top frame)",
        value: "X",
        description: "Select the target frame. This command is intended to be auto-generated while recording."
    },
    "clearCookie": {
        name: "clearCookie",
        target: "URL",
        value: "cookie name",
        description: "Remove a cookie from the target URL"
    },
    "close": {
        name: "close",
        target: "Auto-generated",
        value: "X",
        description: "Close the target window. This command is intended to be auto-generated while recording."
    },
    "clickAt": {
        name: "clickAt",
        target: "A locator",
        value: "x,y position of the mouse event relative to the target element. For example: 10,10. Left blank means a simple click.",
        description: ""
    },
    "doubleClickAt": {
        name: "doubleClickAt",
        target: "A locator",
        value: "x,y position of the mouse event relative to the target element. For example: 10,10. Left blank means a simple double click.",
        description: ""
    },
    "mouseDownAt": {
        name: "mouseDownAt",
        target: "A locator",
        value: "x,y position of the mouse event relative to the target element. For example: 10,10",
        description: ""
    },
    "mouseMoveAt": {
        name: "mouseMoveAt",
        target: "A locator",
        value: "A JSON String containing a series of movements.",
        description: "An example of value: {\"Movements\":[{\"TD\":8,\"OX\":-2,\"OY\":0},{\"TD\":16,\"OX\":-4,\"OY\":1},{\"TD\":16,\"OX\":-5,\"OY\":1}]}. TD means the time delay to the previous movement. OX and OY mean the offset x and y to the previous movement. Supposely, a sequence of recorded mouseMoveAt commands is preceded by a mouseDownAt command, and the first movement's OX and OY of each command is relative to the last movement of the previous command. If a sequence of mouseMoveAt commands is not preceded by a mouseDownAt command, the OX and OY of the first movement of each command is relative to position (0,0) of the page."
    },
    "mouseOut": {
        name: "mouseOut",
        target: "A locator",
        value: "X",
        description: ""
    },
    "mouseOver": {
        name: "mouseOver",
        target: "A locator",
        value: "X",
        description: ""
    },
    "setCSS": {
        name: "setCSS",
        target: "A locator",
        value: "A CSS style string. ",
        description: "An example of value: background-color: rgb(237, 238, 238); text-decoration: none solid rgb(102, 0, 51);"
    },
    "mouseUpAt": {
        name: "mouseUpAt",
        target: "A locator",
        value: "x,y position of the mouse event relative to the target element. For example: 10,10",
        description: ""
    },
    "dragAndDrop": {
        name: "dragAndDrop",
        target: "The locator of the element to be dragged",
        value: "A JSON String containing start position, and a series of movements.",
        description: "An example of value: {\"StartPoint\":{\"X\":92,\"Y\":31},\"Movements\":[{\"TD\":8,\"OX\":-2,\"OY\":0},{\"TD\":16,\"OX\":-4,\"OY\":1},{\"TD\":16,\"OX\":-5,\"OY\":1}]}. TD means the time delay to the previous movement. OX and OY mean the offset x and y to the previous movement."
    },
    "dragAndDropToObject": {
        name: "dragAndDropToObject",
        target: "The locator of the element to be dragged",
        value: "The locator of the element on which the target element is dropped",
        description: ""
    },
    "sendKeys": {
        name: "sendKeys",
        target: "A locator",
        value: "A string or a special keystroke, e.g., ${KEY_DOWN}",
        description: " The target input element should be one of the following types: text, password, email, url, search, tel, number. A special keystroke can be one of the followings: ${KEY_BACKSPACE}, ${KEY_TAB}, ${KEY_ENTER}, ${KEY_ENTER_NOPRESS}, ${KEY_SHIFTLEFT}, ${KEY_SHIFTRIGHT}, ${KEY_CONTROLLEFT}, ${KEY_CONTROLRIGHT}, ${KEY_ALTLEFT}, ${KEY_ALTRIGHT}, ${KEY_CAPSLOCK}, ${KEY_ESC}, ${KEY_PAGEUP}, ${KEY_PAGEDOWN}, ${KEY_END}, ${KEY_HOME}, ${KEY_LEFT}, ${KEY_UP}, ${KEY_RIGHT}, ${KEY_DOWN}, ${KEY_INSERT}, ${KEY_DELETE}, ${KEY_NUMLOCK}, ${KEY_NUMENTER}, ${KEY_F1}, ${KEY_F2}, ${KEY_F3}, ${KEY_F4}, ${KEY_F5}, ${KEY_F6}, ${KEY_F7}, ${KEY_F8}, ${KEY_F9}, ${KEY_F10}, ${KEY_F11}, ${KEY_F12}."
    },
    "submit": {
        name: "submit",
        target: "The locator of the form to be submitted",
        value: "X",
        description: ""
    },
    "type": {
        name: "type",
        target: "A locator",
        value: "The string to be set to the target element",
        description: "The target input element should be one of the following types: color, date, datetime-local, month, range, time, week."
    },
    "editContent": {
        name: "editContent",
        target: "A locator",
        value: "The string to be set to the content of the target element with attribute contenteditable=\"true\"",
        description: ""
    },
    "addSelection": {
        name: "addSelection",
        target: "A locator of a multi-select box",
        value: "An option locator of the element to be added. For example: label=Option1.",
        description: ""
    },
    "removeSelection": {
        name: "removeSelection",
        target: "A locator of a multi-select box",
        value: "An option locator of the element to be removed. For example: label=Option1",
        description: ""
    },
    "select": {
        name: "select",
        target: "A locator of a drop-down menu",
        value: "An option locator. For example: label=Option1",
        description: ""
    },
    "assertAlert": {
        name: "assertAlert",
        target: "The expected alert message",
        value: "X",
        description: ""
    },
    "assertConfirmation": {
        name: "assertConfirmation",
        target: "The expected confirmation message",
        value: "X",
        description: ""
    },
    "chooseOkOnNextConfirmation": {
        name: "chooseOkOnNextConfirmation",
        target: "X",
        value: "X",
        description: ""
    },
    "chooseCancelOnNextConfirmation": {
        name: "chooseCancelOnNextConfirmation",
        target: "X",
        value: "X",
        description: ""
    },
    "assertPrompt": {
        name: "assertPrompt",
        target: "The expected prompt message",
        value: "X",
        description: ""
    },
    "answerOnNextPrompt": {
        name: "answerOnNextPrompt",
        target: "The string to be set to the next prompt pop-up",
        value: "X",
        description: ""
    },
    "chooseCancelOnNextPrompt": {
        name: "chooseCancelOnNextPrompt",
        target: "X",
        value: "X",
        description: ""
    },
    "echo": {
        name: "echo",
        target: "The string to be printed in the log tab. Variables declared in the storeXXX commands or Variable tab can be used in the string. For example: Hello ${var_usr}",
        value: "X",
        description: ""
    },
    "pause": {
        name: "pause",
        target: "X",
        value: "The amount of time to sleep in millisecond. For example: 5000 means sleeping for 5 seconds.",
        description: ""
    },
    "runScript": {
        name: "runScript",
        target: "A Javascript expression to be run. For example: var a=10; var b=10; console.log(a+b);.",
        value: "The amount of time to wait before timeout in millisecond. Set -1 for infinite wait",
        description: "NOTE THAT: Avoid using alert(), prompt(), and confirm() in the Javascript expression. These three functions will not take effect while playing. Please use console.log() to log messages instead."
    },
    "store": {
        name: "store",
        target: "A string to store",
        value: "The name of the variable storing the string. For example: var_usr.",
        description: "The variable can be used in another command's Target or Value by surrounding with ${}. For example, ${var_usr}."
    },
    "storeEval": {
        name: "storeEval",
        target: "A Javascript expression to be run. For example: x=2; y=3; z = Math.max(x,y);. The example expression will be evaluated to 3 and the evaluation result will be stored in the variable declared in Value.",
        value: "The name of the variable storing the evaluation result. For example: var_result.",
        description: "The variable can be used in another command's Target or Value by surrounding with ${}. For example, ${var_result}."
    },
    "storeText": {
        name: "storeText",
        target: "A locator",
        value: "The name of the variable storing the text of the target element. For example: var_ele_txt.",
        description: "The variable can be used in another command's Target or Value by surrounding with ${}. For example, ${var_ele_txt}."
    },
    "storeTitle": {
        name: "storeTitle",
        target: "The title to store",
        value: "The name of the variable storing the title. For example: var_title.",
        description: "The variable can be used in another command's Target or Value by surrounding with ${}. For example, ${var_title}."
    },
    "storeValue": {
        name: "storeValue",
        target: "A locator",
        value: "The name of the variable storing the value of the target element. For example: var_ele_value.",
        description: "The variable can be used in another command's Target or Value by surrounding with ${}. For example, ${var_ele_value}."
    },
    "verifyText": {
        name: "verifyText",
        target: "A locator",
        value: "The expected text of the target element (Exact matching)",
        description: "The next command will continue to be run even if the verification result is failure. Variables can be used in the Value."
    },
    "verifyTitle": {
        name: "verifyTitle",
        target: "The expected string of the title (Exact matching)",
        value: "X",
        description: "The next command will continue to be run even if the verification result is failure. Variables can be used in the Target."
    },
    "verifyValue": {
        name: "verifyValue",
        target: "A locator",
        value: "The expected value of the target element (Exact matching)",
        description: "The next command will continue to be run even if the verification result is failure. Variables can be used in the Value."
    },
    "verifyVisibility": {
        name: "verifyVisibility",
        target: "A locator",
        value: "The X, Y to be scrolled of the window before verification. Left blank means no scrolling.",
        description: "The next command will continue to be run even if the verification result is failure. If the element is fully transparent or parts of it are covered by other elements, the verification result will be failure."
    },
    "assertText": {
        name: "assertText",
        target: "A locator",
        value: "The expected text of the target element (Exact matching)",
        description: "If the verification result is failure, the current test case will stop playing and the next test case will continue to be played. Variables can be used in the Value."
    },
    "assertTitle": {
        name: "assertTitle",
        target: "The expected string of the title (Exact matching)",
        value: "X",
        description: "If the verification result is failure, the current test case will stop playing and the next test case will continue to be played. Variables can be used in the Target."
    },
    "assertValue": {
        name: "assertValue",
        target: "A locator",
        value: "The expected value of the target element (Exact matching)",
        description: "If the verification result is failure, the current test case will stop playing and the next test case will continue to be played. Variables can be used in the Value."
    },
    "assertVisibility": {
        name: "assertVisibility",
        target: "A locator",
        value: "The X, Y to be scrolled of the window before verification. Left blank means no scrolling.",
        description: "If the verification result is failure, the current test case will stop playing and the next test case will continue to be played. If the element is fully transparent or parts of it are covered by other elements, the verification result will be failure."
    },
    "IF": {
        name: "IF",
        target: "A JavaScript expression that returns a boolean result",
        value: "X",
        description: "Variables can be used in the expression. Example 1 (if the variable is a number): ${var_num} == 100. Example 2 (if the variable is a string): \"${var_name}\" == \"Guest\". In addition, one IF command should be paired with one ELSE/END command."
    },
    "ELSE": {
        name: "ELSE",
        target: "X",
        value: "X",
        description: "One ELSE command should be paired with one IF command and one END command. Currently, ELSE-IF is not supported."
    },
    "WHILE": {
        name: "WHILE",
        target: "A JavaScript expression that returns a boolean result",
        value: "Maximum number of times of the loop. Left blank means no such maximum number restriction.",
        description: "Variables can be used in the expression. Example 1 (if the variable is a number): ${var_num} == 100. Example 2 (if the variable is a string): \"${var_name}\" == \"Guest\". In addition, one WHILE command should be paired with one END command."
    },
    "END": {
        name: "END",
        target: "X",
        value: "X",
        description: "One End command should be paired with one IF/WHILE/ELSE command."
    },
    "INCLUDE": {
        name: "INCLUDE",
        target: "The test case to be included while playing. Use the format: TestSuiteName.TestCaseName. For example, Test Suite 1.Test Case 1.",
        value: "X",
        description: ""
    }
};
