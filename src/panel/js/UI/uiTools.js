// import { fileController, this.root.uiTools, reference } from '../background/initial';
import { browser } from "webextension-polyfill-ts";
import * as EntryPoint from "../UI/entryPoint";
export class UiTools {
    constructor(root) {
        this.root = root;

        this.isOnWorkArea = false;
    }

    getResourceURL(name) {
        return browser.runtime.getURL(`panel/js/UI/build/${name}`);
    }

    // --------- command_grid.js
    dblclickCommand(event) {
        var temp = event.target;
        this.cleanCommandToolBar();
        while (temp != null) {
            if (/records-(\d)+/.test(temp.id)) {
                event.stopPropagation();
                // disable the included commands to execute after dblclicking
                if (temp.classList.contains("include-command")) {
                    break;
                }

                var index = temp.id.split("-")[1];
                this.root.recorder.detach();
                this.root.playback.playCommand(index);
                break;
            }
            temp = temp.parentElement;
        }
    }
    // --------- command_grid.js

    // --------- hideshow.js
    // --------- hideshow.js

    // --------- testcase_grid.js
    setGridClick(clickable) {
        let setting = clickable ? "auto" : "none";
        // document.getElementById('testCase-grid').style.pointerEvents = setting;
        // document.getElementById('command-container').style.pointerEvents = setting;
    }
    // --------- testcase_grid.js

    // --------- initial.js
    clean_panel() {
        emptyNode(document.getElementById("records-grid"));
        emptyNode(document.getElementById("command-target-list"));
        emptyNode(document.getElementById("target-dropdown"));
        document.getElementById("command-command").value = "";
        document.getElementById("command-target").value = "";
        document.getElementById("command-value").value = "";
        document.getElementById("records-count").value = "0";
        this.root.fileController.setSelectedRecords([]);
    }
    // --------- initial.js

    // --------- command_grid_toolbar.js
    // --------- command_grid_toolbar.js

    // --------- context_menu.js
    stopNativeEvent(event) {
        // NOTE: lock the browser default shortcuts
        // and this should be careful
        event.preventDefault();
        event.stopPropagation();
    }

    processShortCut(event, keyNum, ctrlKey, shiftKey) {
        let caseIdText = this.root.fileController.getSelectedCases()[0];
        // Hot keys
        switch (keyNum) {
            case 38: { // up arrow
                let recordIdTexts = this.root.fileController.getSelectedRecords();
                let index = parseInt(recordIdTexts[0].split("-")[1]);
                if (index > 0) {
                    index--;
                    this.root.fileController.setSelectedRecords([`records-${index}`]);
                }
                break;
            }
            case 40: { // down arrow
                let recordIdTexts = this.root.fileController.getSelectedRecords();
                let index = parseInt(recordIdTexts[recordIdTexts.length - 1].split("-")[1]);
                if (this.root.fileController.getRecordNum(caseIdText) - 1 > index) {
                    index++;
                    this.root.fileController.setSelectedRecords([`records-${index}`]);
                }
                break;
            }
            case 46: { // del
                if (caseIdText) {
                    let recordIdTexts = this.root.fileController.getSelectedRecords();
                    for (let i = recordIdTexts.length - 1; i >= 0; i--) {
                        this.root.fileController.deleteRecord(caseIdText, parseInt(recordIdTexts[i].split("-")[1]));
                    }
                    this.root.fileController.setSelectedRecords([]);
                }
                break;
            }
        }

        // Hot keys: Ctrl + [KEY]
        if (ctrlKey) {
            // if (!this.isOnWorkArea) return;
            this.stopNativeEvent(event);

            switch (keyNum) {
                case 65: { // Ctrl + A
                    let temp = [];
                    let records = this.root.fileController.getRecords(
                        this.root.fileController.getSelectedCases()[0]
                    );
                    for (let i = 0; i < records.length; i++) {
                        temp.push(`records-${i}`);
                    }
                    this.root.fileController.setSelectedRecords(temp);
                    break;
                }
                case 66: // Ctrl + B
                    this.root.fileController.toggleRecordBreakpoint(
                        this.root.fileController.getSelectedCases()[0],
                        parseInt(this.root.fileController.getSelectedRecord().split("-")[1])
                    );
                    break;
                case 67: // Ctrl + C
                    this.root.fileController.copyCommands();
                    break;
                case 73: { // Ctrl + I
                    let info = this.root.fileController.insertCommand("after", "",
                        { options: [{ type: "other", value: "" }] },
                        { options: [{ type: "other", value: "" }] },
                    );
                    let recordInfo = this.root.fileController.getRecord(info.caseIdText, info.index);
                    this.root.fileController.setSelectedRecords([`records-${info.index}`]);

                    EntryPoint.workArea.setEditBlock({
                        index: info.index, isOpen: true, isSelect: false,
                        usedIndex: {
                            target: recordInfo.target.usedIndex,
                            value: recordInfo.value.usedIndex
                        },
                        value: {
                            name: recordInfo.name,
                            targets: recordInfo.target.options,
                            values: recordInfo.value.options
                        }
                    });
                    break;
                }
                case 79: // Ctrl + O
                    document.querySelector("#open-files").click();
                    break;
                case 80: // Ctrl + P
                    document.querySelector("#play-button").click();
                    break;
                case 83: { // Ctrl + S
                    let suiteIdText = this.root.fileController.getSelectedSuites()[0];
                    this.root.fileController.saveFile.downloadSuites([suiteIdText]);
                    break;
                }
                case 86: // Ctrl + V
                    this.root.fileController.pasteCommands();
                    break;
                case 88: { // Ctrl + X
                    this.root.fileController.cutCommands();
                    break;
                }
                default:
                    break;
            }
        }
    }
    // --------- context_menu.js

    // --------- panelSetting.js
    // --------- panelSetting.js
}
