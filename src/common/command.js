export const commandReferences = {
    "open": {
        isDoSnapshot: false,
        type: {
            record: "window",
            playback: "content"
        },
        isManual: false,
        verifyLocator: false,
        reference: {
            name: "open",
            target: "A URL",
            value: "X",
            description: "Open a webpage."
        }
    },
    "selectWindow": {
        isDoSnapshot: false,
        type: {
            record: "window",
            playback: "extension_select"
        },
        isManual: false,
        verifyLocator: false,
        reference: {
            name: "selectWindow",
            target: "Auto-generated",
            value: "X",
            description: "Select the target window. This command is intended to be auto-generated while recording."
        }
    },
    "selectFrame": {
        isDoSnapshot: false,
        type: {
            record: "window",
            playback: "extension_select"
        },
        isManual: false,
        verifyLocator: false,
        reference: {
            name: "selectFrame",
            target: "index=0 (Select the first frame of index 0), or relative=parent (Select the parent frame), or relative=top (Select the top frame)",
            value: "X",
            description: "Select the target frame. This command is intended to be auto-generated while recording."
        }
    },
    "clearCookie": {
        isDoSnapshot: false,
        type: {
            record: "others",
            playback: "content"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "clearCookie",
            target: 'an URL with "http://" or "https://" prefix included',
            value: "a cookie name or X",
            description: "Remove a cookie from the target URL, if value field is empty, all cookies in target URL will be removed."
        }
    },
    "close": {
        isDoSnapshot: false,
        type: {
            record: "window",
            playback: "extension"
        },
        isManual: false,
        verifyLocator: false,
        reference: {
            name: "close",
            target: "Auto-generated",
            value: "X",
            description: "Close the target window. This command is intended to be auto-generated while recording."
        }
    },
    "clickAt": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "clickAt",
            target: "A locator",
            value: "x,y position of the mouse event relative to the target element. For example: 10,10. Left blank means a simple click.",
            description: ""
        }
    },
    "doubleClickAt": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "doubleClickAt",
            target: "A locator",
            value: "x,y position of the mouse event relative to the target element. For example: 10,10. Left blank means a simple double click.",
            description: ""
        }
    },
    "mouseDownAt": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "mouseDownAt",
            target: "A locator",
            value: "x,y position of the mouse event relative to the target element. For example: 10,10",
            description: ""
        }
    },
    "mouseMoveAt": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "mouseMoveAt",
            target: "A locator",
            value: "A JSON String containing a series of movements.",
            description: "An example of value: {\"Movements\":[{\"TD\":8,\"OX\":-2,\"OY\":0},{\"TD\":16,\"OX\":-4,\"OY\":1},{\"TD\":16,\"OX\":-5,\"OY\":1}]}. TD means the time delay to the previous movement. OX and OY mean the offset x and y to the previous movement. Supposely, a sequence of recorded mouseMoveAt commands is preceded by a mouseDownAt command, and the first movement's OX and OY of each command is relative to the last movement of the previous command. If a sequence of mouseMoveAt commands is not preceded by a mouseDownAt command, the OX and OY of the first movement of each command is relative to position (0,0) of the page."
        }
    },
    "mouseOut": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "mouseOut",
            target: "A locator",
            value: "X",
            description: ""
        }
    },
    "mouseOver": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "mouseOver",
            target: "A locator",
            value: "X",
            description: ""
        }
    },
    "setCSS": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "setCSS",
            target: "A locator",
            value: "A CSS style string. ",
            description: "An example of value: background-color: rgb(237, 238, 238); text-decoration: none solid rgb(102, 0, 51);"
        }
    },
    "mouseUpAt": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "mouseUpAt",
            target: "A locator",
            value: "x,y position of the mouse event relative to the target element. For example: 10,10",
            description: ""
        }
    },
    "dragAndDrop": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "dragAndDrop",
            target: "The locator of the element to be dragged",
            value: "A JSON String containing start position, and a series of movements.",
            description: "An example of value: {\"StartPoint\":{\"X\":92,\"Y\":31},\"Movements\":[{\"TD\":8,\"OX\":-2,\"OY\":0},{\"TD\":16,\"OX\":-4,\"OY\":1},{\"TD\":16,\"OX\":-5,\"OY\":1}]}. TD means the time delay to the previous movement. OX and OY mean the offset x and y to the previous movement."
        }
    },
    "dragAndDropToObject": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "dragAndDropToObject",
            target: "The locator of the element to be dragged",
            value: "The locator of the element on which the target element is dropped",
            description: ""
        }
    },
    "sendKeys": {
        isDoSnapshot: true,
        type: {
            record: "keyboard",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "sendKeys",
            target: "A locator",
            value: "A string or a special keystroke, e.g., ${KEY_DOWN}",
            description: " The target input element should be one of the following types: text, password, email, url, search, tel, number. A special keystroke can be one of the followings: ${KEY_BACKSPACE}, ${KEY_TAB}, ${KEY_ENTER}, ${KEY_ENTER_NOPRESS}, ${KEY_SHIFTLEFT}, ${KEY_SHIFTRIGHT}, ${KEY_CONTROLLEFT}, ${KEY_CONTROLRIGHT}, ${KEY_ALTLEFT}, ${KEY_ALTRIGHT}, ${KEY_CAPSLOCK}, ${KEY_ESC}, ${KEY_PAGEUP}, ${KEY_PAGEDOWN}, ${KEY_END}, ${KEY_HOME}, ${KEY_LEFT}, ${KEY_UP}, ${KEY_RIGHT}, ${KEY_DOWN}, ${KEY_INSERT}, ${KEY_DELETE}, ${KEY_NUMLOCK}, ${KEY_NUMENTER}, ${KEY_F1}, ${KEY_F2}, ${KEY_F3}, ${KEY_F4}, ${KEY_F5}, ${KEY_F6}, ${KEY_F7}, ${KEY_F8}, ${KEY_F9}, ${KEY_F10}, ${KEY_F11}, ${KEY_F12}."
        }
    },
    "submit": {
        isDoSnapshot: true,
        type: {
            record: "others",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "submit",
            target: "The locator of the form to be submitted",
            value: "X",
            description: ""
        }
    },
    "onsubmit": {
        isDoSnapshot: true,
        type: {
            record: "others",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "onsubmit",
            target: "The locator of the form",
            value: "X",
            description: ""
        }
    },
    "type": {
        isDoSnapshot: true,
        type: {
            record: "keyboard",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "type",
            target: "A locator",
            value: "The string to be set to the target element",
            description: "The target input element should be one of the following types: color, date, datetime-local, month, range, time, week."
        }
    },
    "editContent": {
        isDoSnapshot: true,
        type: {
            record: "keyboard",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "editContent",
            target: "A locator",
            value: "The string to be set to the content of the target element with attribute contenteditable=\"true\"",
            description: ""
        }
    },
    "changeSelection": {
        isDoSnapshot: true,
        type: {
            record: "keyboard",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "changeSelection",
            target: "A locator",
            value: "A JSON String containing node order, and text offset.",
            description: "An example of value: {\"N\":0,\"O\":5}. N means the order of node to select. O means the offset of text to focus."
        }
    },
    "addSelection": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "addSelection",
            target: "A locator of a multi-select box",
            value: "An option locator of the element to be added. For example: label=Option1.",
            description: ""
        }
    },
    "removeSelection": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "removeSelection",
            target: "A locator of a multi-select box",
            value: "An option locator of the element to be removed. For example: label=Option1",
            description: ""
        }
    },
    "select": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "content"
        },
        isManual: false,
        verifyLocator: true,
        reference: {
            name: "select",
            target: "A locator of a drop-down menu",
            value: "An option locator. For example: label=Option1",
            description: ""
        }
    },
    "assertAlert": {
        isDoSnapshot: false,
        type: {
            record: "assert",
            playback: "content"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "assertAlert",
            target: "The expected alert message",
            value: "X",
            description: ""
        }
    },
    "assertConfirmation": {
        isDoSnapshot: false,
        type: {
            record: "assert",
            playback: "content"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "assertConfirmation",
            target: "The expected confirmation message",
            value: "X",
            description: ""
        }
    },
    "chooseOkOnNextConfirmation": {
        isDoSnapshot: false,
        type: {
            record: "others",
            playback: "content"
        },
        isManual: false,
        verifyLocator: false,
        reference: {
            name: "chooseOkOnNextConfirmation",
            target: "X",
            value: "X",
            description: ""
        }
    },
    "chooseCancelOnNextConfirmation": {
        isDoSnapshot: false,
        type: {
            record: "others",
            playback: "content"
        },
        isManual: false,
        verifyLocator: false,
        reference: {
            name: "chooseCancelOnNextConfirmation",
            target: "X",
            value: "X",
            description: ""
        }
    },
    "assertPrompt": {
        isDoSnapshot: false,
        type: {
            record: "assert",
            playback: "content"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "assertPrompt",
            target: "The expected prompt message",
            value: "X",
            description: ""
        }
    },
    "answerOnNextPrompt": {
        isDoSnapshot: false,
        type: {
            record: "others",
            playback: "content"
        },
        isManual: false,
        verifyLocator: false,
        reference: {
            name: "answerOnNextPrompt",
            target: "The string to be set to the next prompt pop-up",
            value: "X",
            description: ""
        }
    },
    "chooseCancelOnNextPrompt": {
        isDoSnapshot: false,
        type: {
            record: "assert",
            playback: "content"
        },
        isManual: false,
        verifyLocator: false,
        reference: {
            name: "chooseCancelOnNextPrompt",
            target: "X",
            value: "X",
            description: ""
        }
    },
    "echo": {
        isDoSnapshot: false,
        type: {
            record: "others",
            playback: "content"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "echo",
            target: "The string to be printed in the log tab. Variables declared in the storeXXX commands or Variable tab can be used in the string. For example: Hello ${var_usr}",
            value: "X",
            description: ""
        }
    },
    "pause": {
        isDoSnapshot: false,
        type: {
            record: "others",
            playback: "extension"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "pause",
            target: "X",
            value: "The amount of time to sleep in millisecond. For example: 5000 means sleeping for 5 seconds.",
            description: ""
        }
    },
    "runScript": {
        isDoSnapshot: false,
        type: {
            record: "others",
            playback: "content"
        },
        isManual: false,
        verifyLocator: false,
        reference: {
            name: "runScript",
            target: "A Javascript expression to be run. For example: var a=10; var b=10; console.log(a+b);.",
            value: "The amount of time to wait before timeout in millisecond. Set -1 for infinite wait",
            description: "NOTE THAT: Avoid using alert(), prompt(), and confirm() in the Javascript expression. These three functions will not take effect while playing. Please use console.log() to log messages instead."
        }
    },
    "rightClickAt": {
        isDoSnapshot: true,
        type: {
            record: "mouse",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "rightClickAt",
            target: "A locator",
            value: "x,y position of the mouse event relative to the target element. For example: 10,10.",
            description: ""
        }
    },
    "store": {
        isDoSnapshot: false,
        type: {
            record: "store",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "store",
            target: "A string to store",
            value: "The name of the local variable (within a test case) storing the string. For example: var_usr.",
            description: "The local variable can be used in another command’s Target or Value by surrounding with ${}. For example, ${var_usr}."
        }
    },
    "storeGlobalVar": {
        isDoSnapshot: false,
        type: {
            record: "store",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "storeGlobalVar",
            target: "A string to store",
            value: "The name of the global variable (across test cases, defined in Global Var tab) storing the string. For example: var_usr.",
            description: "The global variable can be used in another command’s Target or Value by surrounding with ${}. For example, ${var_usr}."
        }
    },
    "storeEval": {
        isDoSnapshot: false,
        type: {
            record: "store",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "storeEval",
            target: "A Javascript expression to be run. For example: x=2; y=3; z = Math.max(x,y);. The example expression will be evaluated to 3 and the evaluation result will be stored in the variable declared in Value.",
            value: "The name of the variable storing the evaluation result. For example: var_result.",
            description: "The variable can be used in another command's Target or Value by surrounding with ${}. For example, ${var_result}."
        }
    },
    "storeText": {
        isDoSnapshot: true,
        type: {
            record: "store",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "storeText",
            target: "A locator",
            value: "The name of the variable storing the text of the target element. For example: var_ele_txt.",
            description: "The variable can be used in another command's Target or Value by surrounding with ${}. For example, ${var_ele_txt}."
        }
    },
    "storeTitle": {
        isDoSnapshot: false,
        type: {
            record: "store",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "storeTitle",
            target: "The title to store",
            value: "The name of the variable storing the title. For example: var_title.",
            description: "The variable can be used in another command's Target or Value by surrounding with ${}. For example, ${var_title}."
        }
    },
    "storeValue": {
        isDoSnapshot: true,
        type: {
            record: "store",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "storeValue",
            target: "A locator",
            value: "The name of the variable storing the value of the target element. For example: var_ele_value.",
            description: "The variable can be used in another command's Target or Value by surrounding with ${}. For example, ${var_ele_value}."
        }
    },
    "storeTooltip": {
        isDoSnapshot: true,
        type: {
            record: "store",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "storeTooltip",
            target: "A locator",
            value: "The name of the variable storing the tooltip. For example: var_tooltip.",
            description: "The variable can be used in another command's Target or Value by surrounding with ${}. For example, ${var_tooltip}."
        }
    },
    "verifyText": {
        isDoSnapshot: true,
        type: {
            record: "verify",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "verifyText",
            target: "A locator",
            value: "The expected text of the target element (Exact matching)",
            description: "The next command will continue to be run even if the verification result is failure. Variables can be used in the Value."
        }
    },
    "verifyTitle": {
        isDoSnapshot: false,
        type: {
            record: "verify",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "verifyTitle",
            target: "The expected string of the title (Exact matching)",
            value: "X",
            description: "The next command will continue to be run even if the verification result is failure. Variables can be used in the Target."
        }
    },
    "verifyValue": {
        isDoSnapshot: true,
        type: {
            record: "verify",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "verifyValue",
            target: "A locator",
            value: "The expected value of the target element (Exact matching)",
            description: "The next command will continue to be run even if the verification result is failure. Variables can be used in the Value."
        }
    },
    "verifyVisibility": {
        isDoSnapshot: true,
        type: {
            record: "verify",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "verifyVisibility",
            target: "A locator",
            value: "X",
            description: "The next command will continue to be run even if the verification result is failure. If the element is fully transparent or parts of it are covered by other elements, the verification result will be failure."
        }
    },
    "verifyIsPassword": {
        isDoSnapshot: true,
        type: {
            record: "verify",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "verifyIsPassword",
            target: "A locator",
            value: "X",
            description: `The next command will continue to be run even if the verification result is failure. This command is used to check if the input tag with type password.`
        }
    },
    "verifyTooltip": {
        isDoSnapshot: true,
        type: {
            record: "verify",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "verifyTooltip",
            target: "A locator",
            value: "The expected text of the target element (Exact matching)",
            description: "The next command will continue to be run even if the verification result is failure. Variables can be used in the Target."
        }
    },
    "assertText": {
        isDoSnapshot: true,
        type: {
            record: "assert",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "assertText",
            target: "A locator",
            value: "The expected text of the target element (Exact matching)",
            description: "If the verification result is failure, the current test case will stop playing and the next test case will continue to be played. Variables can be used in the Value."
        }
    },
    "assertTitle": {
        isDoSnapshot: false,
        type: {
            record: "assert",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "assertTitle",
            target: "The expected string of the title (Exact matching)",
            value: "X",
            description: "If the verification result is failure, the current test case will stop playing and the next test case will continue to be played. Variables can be used in the Target."
        }
    },
    "assertValue": {
        isDoSnapshot: true,
        type: {
            record: "assert",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "assertValue",
            target: "A locator",
            value: "The expected value of the target element (Exact matching)",
            description: "If the verification result is failure, the current test case will stop playing and the next test case will continue to be played. Variables can be used in the Value."
        }
    },
    "assertVisibility": {
        isDoSnapshot: true,
        type: {
            record: "assert",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "assertVisibility",
            target: "A locator",
            value: "X",
            description: "If the verification result is failure, the current test case will stop playing and the next test case will continue to be played. If the element is fully transparent or parts of it are covered by other elements, the verification result will be failure."
        }
    },
    "assertIsPassword": {
        isDoSnapshot: true,
        type: {
            record: "assert",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "assertIsPassword",
            target: "A locator",
            value: "X",
            description: `If the verification result is failure, the current test case will stop playing and the next test case will continue to be played. This command is used to check if the input tag with type= password.`
        }
    },
    "assertTooltip": {
        isDoSnapshot: true,
        type: {
            record: "assert",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "assertTooltip",
            target: "A locator",
            value: "The expected text of the target element (Exact matching)",
            description: "If the verification result is failure, the current test case will stop playing and the next test case will continue to be played. Variables can be used in the Target."
        }
    },
    "captureScreen": {
        isDoSnapshot: true,
        type: {
            record: "others",
            playback: "contextmenu"
        },
        isManual: true,
        verifyLocator: true,
        reference: {
            name: "captureScreen",
            target: "A locator",
            value: "X",
            description: "Capture screen. If target exist, the capture image will have a rad frame with target element."
        }
    },
    "IF": {
        isDoSnapshot: false,
        type: {
            record: "control",
            playback: "panel"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "IF",
            target: "A JavaScript expression that returns a boolean result",
            value: "X",
            description: "Variables can be used in the expression. Example 1 (if the variable is a number): ${var_num} == 100. Example 2 (if the variable is a string): \"${var_name}\" == \"Guest\". In addition, one IF command should be paired with one ELSE/END command."
        }
    },
    "ELSE": {
        isDoSnapshot: false,
        type: {
            record: "control",
            playback: "panel"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "ELSE",
            target: "X",
            value: "X",
            description: "One ELSE command should be paired with one IF command and one END command. Currently, ELSE-IF is not supported."
        }
    },
    "WHILE": {
        isDoSnapshot: false,
        type: {
            record: "control",
            playback: "panel"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "WHILE",
            target: "A JavaScript expression that returns a boolean result",
            value: "Maximum number of times of the loop. Left blank means no such maximum number restriction.",
            description: "Variables can be used in the expression. Example 1 (if the variable is a number): ${var_num} == 100. Example 2 (if the variable is a string): \"${var_name}\" == \"Guest\". In addition, one WHILE command should be paired with one END command."
        }
    },
    "END": {
        isDoSnapshot: false,
        type: {
            record: "control",
            playback: "panel"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "END",
            target: "X",
            value: "X",
            description: "One End command should be paired with one IF/WHILE/ELSE command."
        }
    },
    "INCLUDE": {
        isDoSnapshot: false,
        type: {
            record: "control",
            playback: "panel"
        },
        isManual: true,
        verifyLocator: false,
        reference: {
            name: "INCLUDE",
            target: "The test case to be included while playing. Use the format: TestSuiteName.TestCaseName. For example, Test Suite 1.Test Case 1.",
            value: "X",
            description: ""
        }
    }
};