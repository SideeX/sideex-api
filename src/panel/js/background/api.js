import { browser } from "webextension-polyfill-ts";
import { fileList } from "../UI/entryPoint";

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
            add: function (suiteName, caseName) {
                let suiteIdText = Panel.fileController.getSuiteKey(suiteName);
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
            get: function(suiteName, caseName) {
                let suiteIdText = Panel.fileController.getSuiteKey(suiteName);
                let caseIdText = Panel.fileController.getCaseKey(suiteIdText, caseName);
                return Panel.fileController.getTestCase(caseIdText);
            },
            rename: function (suiteName, caseName, newCaseName) {
                let suiteIdText = Panel.fileController.getSuiteKey(suiteName);
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
            remove: function (suiteName, caseName) {
                let suiteIdText = Panel.fileController.getSuiteKey(suiteName);
                let caseIdText = Panel.fileController.getCaseKey(suiteIdText, caseName);
                Panel.fileController.setCaseModified(caseIdText, true, true);
                if (caseIdText) {
                    fileList.setModal({ isOpen: false, type: "default" });
                    Panel.fileController.deleteCase(caseIdText);
                    fileList.syncFiles();
                }
            },
            setSelected: function (suiteName, caseName) {
                let suiteIdText = Panel.fileController.getSuiteKey(suiteName);
                let caseIdText = Panel.fileController.getCaseKey(suiteIdText, caseName);
                Panel.fileController.setSelectedCases([caseIdText]);
            },
            getSelected: function () {
                return Panel.fileController.getSelectedCases();
            },
        },
        command: {

        }
    },
    //NOTE: 1. define func in var-crtler? 2. object or parameter? 3. local var? 4. logconsole in entrypoint?
    variables: {
        add: (name, value) => {
            Panel.variables.addVariable(name, value);
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
        //NOTE: (name)?
        delete: (varIdText) => {
            Panel.variables.deleteVariable(varIdText); //"var-0"
        },
        //NOTE: UI: setModal ?
        clearAll: () => {
            Panel.variables.clearVariables();
        },
        changeName: (varIdText, name) => {
            if (varIdText)
                Panel.variables.updateVarName(varIdText, name);
        },
        changeValue: (varIdText, value) => {
            if (varIdText)
                Panel.variables.updateVarValue(varIdText, value);
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
    setting: {
        setSpeed: (value) => {
            Panel.setting.set({ delay: 500 * (5 - value) });
            EntryPoint.toolBar.updateSpeed(parseInt(value));
        },
        getSpeed: () => {
            let speed = 5 - (Panel.setting.params.delay / 500);
            return speed;
        }
    }
};
