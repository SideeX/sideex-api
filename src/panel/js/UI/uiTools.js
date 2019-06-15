// import { fileController, Panel.uiTools, reference } from '../background/initial';
import { browser } from "webextension-polyfill-ts";

export class UiTools {
    constructor() {
        this.isOnWorkArea = false;
    }

    getResourceURL(name) {
        return browser.runtime.getURL(`panel/js/UI/build/${name}`);
    }

    // --------- command_grid.js
    dblclickCommand(event) {
        var temp = event.target;
        Panel.uiTools.cleanCommandToolBar();
        while (temp != null) {
            if (/records-(\d)+/.test(temp.id)) {
                event.stopPropagation();
                // disable the included commands to execute after dblclicking
                if (temp.classList.contains("include-command")) {
                    break;
                }

                var index = temp.id.split("-")[1];
                Panel.recorder.detach();
                Panel.playback.playCommand(index);
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
        Panel.fileController.setSelectedRecords([]);
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
        let caseIdText = Panel.fileController.getSelectedCases()[0];
        // Hot keys
        switch (keyNum) {
            case 38: { // up arrow
                let recordIdTexts = Panel.fileController.getSelectedRecords();
                let index = parseInt(recordIdTexts[0].split("-")[1]);
                if (index > 0) {
                    index--;
                    Panel.fileController.setSelectedRecords([`records-${index}`]);
                }
                break;
            }
            case 40: { // down arrow
                let recordIdTexts = Panel.fileController.getSelectedRecords();
                let index = parseInt(recordIdTexts[recordIdTexts.length - 1].split("-")[1]);
                if (Panel.fileController.getRecordNum(caseIdText) - 1 > index) {
                    index++;
                    Panel.fileController.setSelectedRecords([`records-${index}`]);
                }
                break;
            }
            case 46: { // del
                if (caseIdText) {
                    let recordIdTexts = Panel.fileController.getSelectedRecords();
                    for (let i = recordIdTexts.length - 1; i >= 0; i--) {
                        Panel.fileController.deleteRecord(caseIdText, parseInt(recordIdTexts[i].split("-")[1]));
                    }
                    Panel.fileController.setSelectedRecords([]);
                }
                break;
            }
        }

        // Hot keys: Ctrl + [KEY]
        if (ctrlKey) {
            // if (!Panel.uiTools.isOnWorkArea) return;
            Panel.uiTools.stopNativeEvent(event);

            switch (keyNum) {
                case 65: { // Ctrl + A
                    let temp = [];
                    let records = Panel.fileController.getRecords(
                        Panel.fileController.getSelectedCases()[0]
                    );
                    for (let i = 0; i < records.length; i++) {
                        temp.push(`records-${i}`);
                    }
                    Panel.fileController.setSelectedRecords(temp);
                    break;
                }
                case 66: // Ctrl + B
                    Panel.fileController.toggleRecordBreakpoint(
                        Panel.fileController.getSelectedCases()[0],
                        parseInt(Panel.fileController.getSelectedRecord().split("-")[1])
                    );
                    break;
                case 67: // Ctrl + C
                    Panel.fileController.copyCommands();
                    break;
                case 73: { // Ctrl + I
                    let info = Panel.fileController.insertCommand("after", "",
                        { options: [{ type: "other", value: "" }] },
                        { options: [{ type: "other", value: "" }] },
                    );
                    let recordInfo = Panel.fileController.getRecord(info.caseIdText, info.index);
                    Panel.fileController.setSelectedRecords([`records-${info.index}`]);

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
                    let suiteIdText = Panel.fileController.getSelectedSuites()[0];
                    Panel.fileController.saveFile.downloadSuites([suiteIdText]);
                    break;
                }
                case 86: // Ctrl + V
                    Panel.fileController.pasteCommands();
                    break;
                case 88: { // Ctrl + X
                    Panel.fileController.cutCommands();
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
