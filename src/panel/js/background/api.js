import { browser } from "webextension-polyfill-ts";
import { logConsole, toolBar, fileList, app, workArea, refreshUI } from "../UI/entryPoint";

export default {
    toolBar: {
        clickPlayButton: function (mode) {
            console.log(mode);
            Panel.recorder.isRecord = false;
            Panel.playback.isPlay = true;
            Panel.recorder.detach();
            switch (mode) {
                case "Play this case": {
                    Panel.playback.doPlay(0, 0); // Playback.PLAY_CASE
                    break;
                }
                case "Play this suite": {
                    Panel.playback.doPlay(1, 0); // Playback.PLAY_SUITE
                    break;
                }
                case "Play all suites": {
                    Panel.playback.doPlay(2, 0); // Playback.PLAY_ALL_SUITES
                    break;
                }
            }
            EntryPoint.toolBar.syncButtonState();
        },
        clickRecordButton: function () {
            Panel.recorder.isRecord = !Panel.recorder.isRecord;
            if (Panel.recorder.isRecord) {
                console.log("Recording");
                Panel.recorder.attach();
                Panel.recorder.notificationCount = 0;
                Panel.recorder.prepareRecord();

                Panel.recorder.isRecord = true;
            } else {
                console.log("Stop");
                Panel.recorder.detach();
                Panel.recorder.isRecord = false;
            }
            EntryPoint.toolBar.syncButtonState();
            EntryPoint.fileList.syncFiles();
        },
        clickStopButton: function () {
            Panel.playback.stop();

            Panel.playback.isPlay = false;
            EntryPoint.toolBar.syncButtonState();
        },
        clickPauseButton: function () {
            Panel.playback.pause();

            Panel.playback.isPlay = false;
            Panel.playback.isPause = true;
            EntryPoint.toolBar.syncButtonState();
        },
        clickResumeButton: function () {
            Panel.playback.resume();

            Panel.playback.isPlay = true;
            Panel.playback.isPause = false;
            EntryPoint.toolBar.syncButtonState();
        },
        clickSettingButton: function () {
            browser.runtime.openOptionsPage();
        },
        changeSpeed: function (value) {
            Panel.setting.set({ delay: 500 * (5 - value) });
            EntryPoint.toolBar.updateSpeed(parseInt(value));
        }

    }
};

    },
    file: {
        testSuite: {
            add: function (suiteName) {
                let checkResult = Panel.fileController.checkNameValid(suiteName);
                if (checkResult.result) {
                    if (!Panel.fileController.isSuiteNameUsed(suiteName)) {
                        Panel.fileController.addTestSuite(suiteName);
                        fileList.setModal({ isOpen: false, type: "default" });
                        fileList.syncFiles();
                    } else {
                        fileList.setModal({
                            error: "This name has been used. Please use another one."
                        });
                    }
                } else {
                    fileList.setModal({ error: checkResult.message });
                }
            },
            get: function(suiteName) {
                let suiteIdText = Panel.fileController.getSuiteKey(suiteName);
                return Panel.fileController.getTestSuite(suiteIdText);
            },
            rename: function (suiteName, newSuiteName) {
                let suiteIdText = Panel.fileController.getSuiteKey(suiteName);
                let checkResult = Panel.fileController.checkNameValid(newSuiteName);
                if (checkResult.result) {
                    if (!Panel.fileController.isSuiteNameUsed(newSuiteName)) {
                        Panel.fileController.setSuiteTitle(suiteIdText, newSuiteName);
                        Panel.fileController.setSuiteModified(suiteIdText, true, false);
                        fileList.setModal({ isOpen: false, type: "default" });
                        fileList.syncFiles();
                    } else {
                        fileList.setModal({
                            error: "The test suite name has been used. Please use another name."
                        });
                    }
                } else {
                    fileList.setModal({ error: checkResult.message });
                }
            },
            copy: function(suiteName, newSuiteName) {
                // check is suiteName exist
            },
            cut: function() {

            },
            paste: function() {

            },
            close: function (suiteNames) {
                if (suiteNames.length > 0) {
                    for (let suiteName of suiteNames) {
                        let suiteIdText = Panel.fileController.getSuiteKey(suiteName);
                        Panel.fileController.deleteSuite(suiteIdText);
                    }
                    fileList.setModal({ isOpen: false, type: "default" });
                    fileList.syncFiles();
                }
            },
            closeAll: function () {
                let suiteIdTexts = Panel.fileController.getAllSuiteIdTexts();
                if (suiteIdTexts.length > 0) {
                    for (let suiteIdText of suiteIdTexts) {
                        Panel.fileController.deleteSuite(suiteIdText);
                    }
                    fileList.setModal({ isOpen: false, type: "default" });
                    fileList.syncFiles();
                }
            },
            setSelected: function (suiteName) {
                let suiteIdText = Panel.fileController.getSuiteKey(suiteName);
                Panel.fileController.setSelectedSuites([suiteIdText]);
            },
            getSelected: function () {
                return Panel.fileController.getSelectedSuites();
            },

        },
        testCase: {
            add: function (caseName, suiteName) {
                let suiteIdText = suiteName === undefined ?
                    Panel.fileController.getSelectedSuites() : Panel.fileController.getSuiteKey(suiteName);
                let checkResult = Panel.fileController.checkNameValid(caseName);
                // console.log("selectedSuiteIdText: ", Panel.fileController.getSelectedSuites());
                if (checkResult.result) {
                    if (!Panel.fileController.isCaseNameUsed(caseName, suiteIdText)) {
                        let caseIdText = Panel.fileController.addTestCase(caseName);
                        Panel.fileController.setCaseModified(caseIdText, true, true);
                        fileList.setModal({ isOpen: false, type: "default" });
                        fileList.syncFiles();
                    } else {
                        fileList.setModal({
                            error: "This name has been used. Please use another one."
                        });
                    }
                } else {
                    fileList.setModal({ error: checkResult.message });
                }
            },
            get: function(caseName, suiteName) {
                let suiteIdText = suiteName === undefined ?
                    Panel.fileController.getSelectedSuites() : Panel.fileController.getSuiteKey(suiteName);
                let caseIdText = Panel.fileController.getCaseKey(suiteIdText, caseName);
                return Panel.fileController.getTestCase(caseIdText);
            },
            rename: function (caseName, newCaseName, suiteName) {
                let suiteIdText = suiteName === undefined ?
                    Panel.fileController.getSelectedSuites() : Panel.fileController.getSuiteKey(suiteName);
                let caseIdText = Panel.fileController.getCaseKey(suiteIdText, caseName);
                let checkResult = Panel.fileController.checkNameValid(newCaseName);
                if (checkResult.result) {
                    if (!Panel.fileController.isCaseNameUsed(newCaseName, suiteIdText)) {
                        Panel.fileController.setCaseTitle(caseIdText, newCaseName);
                        Panel.fileController.setCaseModified(caseIdText, true, true);
                        fileList.setModal({ isOpen: false, type: "default" });
                        fileList.syncFiles();
                    } else {
                        fileList.setModal({
                            error: "The test case name has been used. Please use another name."
                        });
                    }
                } else {
                    fileList.setModal({ error: checkResult.message });
                }
            },
            remove: function (caseName, suiteName) {
                let suiteIdText = suiteName === undefined ?
                    Panel.fileController.getSelectedSuites() : Panel.fileController.getSuiteKey(suiteName);
                let caseIdText = Panel.fileController.getCaseKey(suiteIdText, caseName);
                Panel.fileController.setCaseModified(caseIdText, true, true);
                if (caseIdText) {
                    fileList.setModal({ isOpen: false, type: "default" });
                    Panel.fileController.deleteCase(caseIdText);
                    fileList.syncFiles();
                }
            },
            setSelected: function (caseName, suiteName) {
                let suiteIdText = suiteName === undefined ?
                    Panel.fileController.getSelectedSuites() : Panel.fileController.getSuiteKey(suiteName);
                let caseIdText = Panel.fileController.getCaseKey(suiteIdText, caseName);
                Panel.fileController.setSelectedCases([caseIdText]);
            },
            getSelected: function () {
                return Panel.fileController.getSelectedCases();
            },
        },
        command: {
            add: function (commandName, commandTarget = { options: [{ type: "other", value: "" }] }, commandValue = { options: [{ type: "other", value: "" }] }, caseName, suiteName) {
                let suiteIdText = suiteName === undefined ?
                    Panel.fileController.getSelectedSuites() : Panel.fileController.getSuiteKey(suiteName);
                Panel.fileController.setSelectedSuites([suiteIdText]);

                let caseIdText = caseName === undefined ?
                    Panel.fileController.getSelectedCases() : Panel.fileController.getCaseKey(suiteIdText, caseName);
                Panel.fileController.setSelectedCases([caseIdText]);

                Panel.recorder.prepareRecord();
                let info = Panel.fileController.insertCommand("after", commandName, commandTarget, commandValue);
                let recordInfo = Panel.fileController.getRecord(info.caseIdText, info.index);
                Panel.fileController.setSelectedRecords([`records-${info.index}`]);

                workArea.syncCommands();
                fileList.syncFiles();
                workArea.setEditBlock({
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
            },
            get: function(recordIndex, caseName, suiteName) {
                let suiteIdText = suiteName === undefined ?
                    Panel.fileController.getSelectedSuites() : Panel.fileController.getSuiteKey(suiteName);
                let caseIdText = caseName === undefined ?
                    Panel.fileController.getSelectedCases() : Panel.fileController.getCaseKey(suiteIdText, caseName);
                return Panel.fileController.getRecord(caseIdText, recordIndex);
            },
            delete: function (recordIndex, caseName, suiteName) {
                let suiteIdText = suiteName === undefined ?
                    Panel.fileController.getSelectedSuites() : Panel.fileController.getSuiteKey(suiteName);
                let caseIdText = caseName === undefined ?
                    Panel.fileController.getSelectedCases() : Panel.fileController.getCaseKey(suiteIdText, caseName);
                // let recordIdText = Panel.fileController.getSelectedRecords()[0];
                // let recordIndex = parseInt(recordIdText.split('-')[1]);
                Panel.fileController.deleteRecord(caseIdText, recordIndex);
    
                workArea.syncCommands();
            },
            deleteAll: function (caseName, suiteName) {
                let suiteIdText = suiteName === undefined ?
                    Panel.fileController.getSelectedSuites() : Panel.fileController.getSuiteKey(suiteName);
                let caseIdText = caseName === undefined ?
                    Panel.fileController.getSelectedCases() : Panel.fileController.getCaseKey(suiteIdText, caseName);

                Panel.fileController.deleteAllRecords(caseIdText);
    
                workArea.syncCommands();
            },
            clearStatus: function () {
                let caseIdText = Panel.fileController.getSelectedCases()[0];
                let records = Panel.fileController.getRecords(caseIdText);
                // let caseEle = Panel.fileController.getTestCase(caseIdText);
                Panel.fileController.clearIncludedRecords(records);
                Panel.fileController.clearRecordsStatus(["status", "snapshot"], records, true);
                // Panel.fileController.setFileStatus(caseEle, "default");
                // Panel.snapshot.resizeAllSnapshots();
                workArea.syncCommands();
                fileList.syncFiles();
            },
            clearAllStatus: function() {

            },
            setSelected: function (recordIdText) {
                Panel.fileController.setSelectedRecords([recordIdText]);
            },
            getSelected: function () {
                return Panel.fileController.getSelectedRecord();
            },

        }
    },

    variables: {
        add: (name, value) => {
            return Panel.variables.addVariable(name, value);
        },
        get: (target) => {
            switch (target) {
                case "count":
                    return Panel.variables.getVarNum();
                case "startNum":
                    return Panel.variables.globalVars.startNum;
                case "varNames":
                    return Panel.variables.globalVars.varNames;
                case "vars":
                    return Panel.variables.globalVars.vars;
                default:
                    break;
            }
        },
        delete: (varIdText) => {
            Panel.variables.deleteVariable(varIdText);
            return varIdText;
        },
        clearAll: () => {
            Panel.variables.clearVariables();
        },
        changeName: (varIdText, name) => {
            if (varIdText)
                Panel.variables.updateVarName(varIdText, name);
            return {varIdText, name};
        },
        changeValue: (varIdText, value) => {
            if (varIdText)
                Panel.variables.updateVarValue(varIdText, value);
            return {varIdText, value};
        }
    },
    recorder: {
        start: () => {
            console.log("Recording");
            Panel.recorder.attach();
            Panel.recorder.notificationCount = 0;
            Panel.recorder.prepareRecord();
            Panel.recorder.isRecord = true;

            EntryPoint.toolBar.syncButtonState();
            EntryPoint.fileList.syncFiles();
        },
        stop: () => {
            console.log("Stop");
            Panel.recorder.detach();
            Panel.recorder.isRecord = false;

            EntryPoint.toolBar.syncButtonState();
            EntryPoint.fileList.syncFiles();
        }
    },
    //TODO: return value
    setting: {
        setSpeed: (value) => {
            if (value < 0 || value > 5) {
                return Panel.log.pushLog('error', 'speed should be set from range 1 to 5');
            } else {
                Panel.setting.set({ delay: 500 * (5 - value) });
                EntryPoint.toolBar.updateSpeed(parseInt(value));
                return value;
            }
        },
        getSpeed: () => {
            let speed = 5 - (Panel.setting.params.delay / 500);
            return speed;
        }
    },
    playback: {
        start: (mode, speed = 5) => {
            this.setSpeed(speed);
            console.log(mode);
            Panel.recorder.isRecord = false;
            Panel.playback.isPlay = true;
            Panel.recorder.detach();

            switch (mode) {
                case "case": {
                    Panel.playback.doPlay(0, 0); // Playback.PLAY_CASE
                    break;
                }
                case "suite": {
                    Panel.playback.doPlay(1, 0); // Playback.PLAY_SUITE
                    break;
                }
                case "all": {
                    Panel.playback.doPlay(2, 0); // Playback.PLAY_ALL_SUITES
                    break;
                }
            }
            EntryPoint.toolBar.syncButtonState();

        },
        stop: () => {
            Panel.playback.stop();

            Panel.playback.isPlay = false;
            EntryPoint.toolBar.syncButtonState();
        },
        pause: () => {
            Panel.playback.pause();

            Panel.playback.isPlay = false;
            Panel.playback.isPause = true;
            EntryPoint.toolBar.syncButtonState();
        },
        resume: () => {
            Panel.playback.resume();

            Panel.playback.isPlay = true;
            Panel.playback.isPause = false;
            EntryPoint.toolBar.syncButtonState();
        }
    }
};
