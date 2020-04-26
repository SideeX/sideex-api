/*
 * Copyright 2017 SideeX committers
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

export class PreRecorder {
    constructor(root, bgRecorder) {
        this.root = root;
        this.bgRecorder = bgRecorder;

        this.isNeedBuffer = false;
        this.isNeedReturn = false;
        this.buffer = [];
        this.bufferInsertBeforeLastCommand = [];
        this.bufferActualFrameLocation = [];
    }

    /**
     * TBD
     */
    flushBuffer(isNeedBuffer) {
        this.isNeedBuffer = isNeedBuffer;
        let bufferLength = this.buffer.length;
        for (let i = 0; i < bufferLength; i++) {
            this.buffer.shift();
        }
    }

    isReturn() {
        return this.isNeedReturn;
    }

    async promptVarName(command, windowId) {
        try {
            // In Google Chrome, window.prompt() must be triggered in
            // an active tabs of front window, so we let panel window been focused
            await browser.windows.update(windowId, {focused: true});
            // Even if window has been focused, window.prompt() still failed.
            // Delay a little time to ensure that status has been updated
            var varName = "";
            await setTimeout(() => {
                varName = prompt("Enter the name of the variable");
            }, 100);
        } catch (e) {
            console.log(e);
        }
        return varName;
    }

    appendCommand(command) {
        if (command.insertBeforeLastCommand) {
            this.root.fileController.addCommandBeforeLastCommand(command.command, command.target, command.value);
        } else {
            this.bgRecorder.notification(command.command, command.target.options[0].value, command.value.options[0].value);
            this.root.fileController.insertCommand("after", command.command, command.target, command.value);
        }
    }

    deleteCommandNum(command) {
        let records = this.root.fileController.getRecords(this.root.fileController.getSelectedCases()[0]);
        let length = records.length;
        let lastCommand = records[length - 1];

        if (command.command == "doubleClickAt") {
            if (this.root.fileController.compareTwoCommand(this.root.fileController.getSelectedCases()[0], length - 1, length - 2, "ntv")) {
                if (lastCommand.name === "clickAt" || records[length - 2].name === "clickAt") {
                    return 2;
                }
            }
        }

        return 0;
    }

    async preProcess(command, windowId) {
        // console.log(command);
        this.isNeedReturn = false;

        let deleteNum = this.deleteCommandNum(command);
        for (let i = 0; i < deleteNum; i++) {
            this.root.fileController.deleteLastRecord(
                this.root.fileController.getSelectedCases()[0]
            );
        }


        if (command.command.includes("Value") && command.value.options[0].value === undefined) {
            this.root.log.pushLog("error", "Error: This element does not have property 'value'. Please change to use storeText command.");
            this.isNeedReturn = true;
        } else if (command.command.includes("Text") && command.value.options[0].value === '') {
            this.root.log.pushLog("error", "Error: This element does not have property 'Text'. Please change to use storeValue command.");
            this.isNeedReturn = true;
        } else if (command.command.includes("store")) {
            command.value.options[0].value = await this.promptVarName(command, windowId);
            this.appendCommand(command);
            this.isNeedReturn = true;
        } else if (command.command == "submit") {
            this.isNeedBuffer = false;
            var elementFound = false;
            for (let element of this.buffer) {
                this.appendCommand(element);
                elementFound = true;
            }

            this.flushBuffer(this.isNeedBuffer);
            if (elementFound == true) {
                this.isNeedReturn = true;
            } else {
                command.value.options[0].value = command.value.options[0].value.toString();
            }
        } else if (command.command == "cleanBuffer") {
            this.flushBuffer(false);
            this.isNeedReturn = true;
        } else if (command.command == "onsubmit" || this.isNeedBuffer) {
            this.isNeedBuffer = true;
            this.isNeedReturn = true;
            this.buffer.push({
                command: command.command,
                target: command.target,
                value: command.value,
                insertBeforeLastCommand: command.insertBeforeLastCommand,
                actualFrameLocation: command.actualFrameLocation
            });
        }
    }
}

