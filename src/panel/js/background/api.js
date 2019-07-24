import { browser } from "webextension-polyfill-ts";
import cloneDeep from "lodash/cloneDeep";

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

    },
    file: {
        testSuite: {
            add: function (suiteData = { title : Panel.fileController.newUntitledName("suite") }) {
                let checkResult = Panel.fileController.checkNameValid(suiteData.title);
                if (checkResult.result) {
                    if (!Panel.fileController.isSuiteNameUsed(suiteData.title)) {
                        return Panel.fileController.addTestSuite(suiteData);
                    } else {
                        console.log("[Error] This name has been used. Please use another one.");
                    }
                } else {
                    console.log("[Error]", checkResult.message);
                }
            },
            get: function(suiteIdText) { // ask: 要判斷 ｓｕｉｔｅＩｄＴｅｘｔ？？
                return Panel.fileController.getTestSuite(suiteIdText);
            },
            getSuiteIdText: function(suiteName) {
                return Panel.fileController.getSuiteKey(suiteName);
            },
            rename: function (suiteIdText, newSuiteName) {
                let checkResult = Panel.fileController.checkNameValid(newSuiteName);
                if (checkResult.result) {
                    if (!Panel.fileController.isSuiteNameUsed(newSuiteName)) {
                        Panel.fileController.setSuiteTitle(suiteIdText, newSuiteName);
                        return newSuiteName;
                    } else {
                        console.log("[Error] The test suite name has been used. Please use another name.");
                    }
                } else {
                    console.log("[Error]", checkResult.message);
                }
            },
            copy: function(suiteIdText = Panel.fileController.getSelectedSuites()[0]) {
            },
            close: function (suiteIdTexts) {
                if (suiteIdTexts.length > 0) {
                    for (let suiteIdText of suiteIdTexts) {
                        Panel.fileController.deleteSuite(suiteIdText);
                    }
                }
            },
            closeAll: function () {
                let suiteIdTexts = Panel.fileController.getAllSuiteIdTexts();
                if (suiteIdTexts.length > 0) {
                    for (let suiteIdText of suiteIdTexts) {
                        Panel.fileController.deleteSuite(suiteIdText);
                    }
                }
            },
            setSelected: function (suiteIdTexts) {
                Panel.fileController.setSelectedSuites(suiteIdTexts);
            },
            getSelected: function () {
                return Panel.fileController.getSelectedSuites();
            },

        },
        testCase: {
            add: function (caseData = { title : Panel.fileController.newUntitledName("case"),
                                        suiteIdText : Panel.fileController.getSelectedSuites()[0]}) {
                let checkResult = Panel.fileController.checkNameValid(caseData.title);
                if (checkResult.result) {
                    if (!Panel.fileController.isCaseNameUsed(caseData.title, caseData.suiteIdText)) {
                        return Panel.fileController.addTestCase(caseData);
                    } else {
                        console.log("[Error] This name has been used. Please use another one.");
                    }
                } else {
                    console.log("[Error]", checkResult.message);
                }
            },
            get: function(caseIdText) {
                return Panel.fileController.getTestCase(caseIdText);
            },
            getCaseIdText: function(caseName, suiteIdText = Panel.fileController.getSelectedSuites()[0]) {
                return Panel.fileController.getCaseKey(suiteIdText, caseName);
            },
            rename: function (caseIdText, newCaseName) {
                let suiteIdText = Panel.fileController.getTestCase(caseIdText).suiteIdText;
                let checkResult = Panel.fileController.checkNameValid(newCaseName);
                if (checkResult.result) {
                    if (!Panel.fileController.isCaseNameUsed(newCaseName, suiteIdText)) {
                        Panel.fileController.setCaseTitle(caseIdText, newCaseName);
                        Panel.fileController.setCaseModified(caseIdText, true, true);
                        return newCaseName;
                    } else {
                        console.log("[Error] The test case name has been used. Please use another name.");
                    }
                } else {
                    console.log("[Error]", checkResult.message);
                }
            },
            copy: function (srcCaseIdText = Panel.fileController.getSelectedCases()[0],
                            dstSuiteIdText = Panel.fileController.getSelectedSuites()[0]) {
                if (Panel.fileController.getTestSuite(dstSuiteIdText) === undefined) {
                    console.log(`[Error] test suite "${dstSuiteIdText}" not found.`);
                    return;
                }

                let testCase = Panel.fileController.getTestCase(srcCaseIdText);
                let newTestCase = {
                    ...cloneDeep(testCase),
                    title: `${testCase.title}-1`, 
                    suiteIdText: dstSuiteIdText,
                    modified: true,
                }
                return Panel.fileController.addTestCase(newTestCase);
            },
            cut: function (srcCaseIdText = Panel.fileController.getSelectedCases()[0], 
                            dstSuiteIdText = Panel.fileController.getSelectedSuites()[0]) {
                if (Panel.fileController.getTestSuite(dstSuiteIdText) === undefined) {
                    console.log(`[Error] test suite "${dstSuiteIdText}" not found.`);
                    return;
                }
                let testCase = Panel.fileController.getTestCase(srcCaseIdText);
                Panel.fileController.deleteCaseInSuite(testCase.suiteIdText, srcCaseIdText);
                Panel.fileController.appendCaseInSuite(dstSuiteIdText, srcCaseIdText);
                Panel.fileController.setCaseSuiteIdText(srcCaseIdText, dstSuiteIdText);
                Panel.fileController.setCaseModified(srcCaseIdText, true, true);
            },
            remove: function (caseIdText) {
                Panel.fileController.deleteCase(caseIdText);
                Panel.fileController.setCaseModified(caseIdText, true, true);
            },
            removeAllCasesInSuite: function () {

            },
            setSelected: function (caseIdTexts) {
                Panel.fileController.setSelectedCases(caseIdTexts);
            },
            getSelected: function () {
                return Panel.fileController.getSelectedCases();
            },
        },
        record: {
            add: function (recordData = { name: "Untitled Record", 
                                        target: { options: [{ type: "other", value: "" }] }, 
                                        value : { options: [{ type: "other", value: "" }] }},
                            caseIdText = Panel.fileController.getSelectedCases()[0]) {
                Panel.recorder.prepareRecord();
                let index = Panel.fileController.getRecordNum(caseIdText)
                let info = Panel.fileController.addCommand(caseIdText, index, recordData.name, recordData.target, recordData.value);
                Panel.fileController.setSelectedRecords([`records-${info.index}`]);
            },
            get: function(recordIndex, caseIdText = Panel.fileController.getSelectedCases()[0]) {
                return Panel.fileController.getRecord(caseIdText, recordIndex);
            },
            delete: function (recordIndex, caseIdText = Panel.fileController.getSelectedCases()[0]) {
                Panel.fileController.deleteRecord(caseIdText, recordIndex);
            },
            deleteAll: function (caseIdText = Panel.fileController.getSelectedCases()[0]) {
                Panel.fileController.deleteAllRecords(caseIdText);
            },
            copy: function (srcCaseIdText = Panel.fileController.getSelectedCases()[0],
                            srcRecordIndex = Panel.fileController.getSelectedRecord()[Panel.fileController.getSelectedRecord().length-1],
                            destCaseIdText = Panel.fileController.getSelectedCases()[0],
                            destRecordIndex = Panel.fileController.getRecordNum(destCaseIdText) - 1) {
                if (destRecordIndex > Panel.fileController.getRecordNum(destCaseIdText)) {
                    console.log("[Error] destRecordIndex out of bound");
                    return;
                }
                let record = Panel.fileController.getRecord(srcCaseIdText, srcRecordIndex);
                Panel.fileController.addCommand(destCaseIdText, destRecordIndex, record.name, record.target, record.value);
            },
            cut: function (srcCaseIdText = Panel.fileController.getSelectedCases()[0],
                            srcRecordIndex = Panel.fileController.getSelectedRecord()[Panel.fileController.getSelectedRecord().length-1],
                            destCaseIdText = Panel.fileController.getSelectedCases()[0],
                            destRecordIndex = Panel.fileController.getRecordNum(destCaseIdText) - 1) {
                if (srcCaseIdText === destCaseIdText
                        && destRecordIndex > Panel.fileController.getRecordNum(destCaseIdText) - 1) {
                    console.log("[Error] destRecordIndex out of bound");
                    return;
                } else if (srcCaseIdText !== destCaseIdText 
                        && destRecordIndex > Panel.fileController.getRecordNum(destCaseIdText)) {
                    console.log("[Error] destRecordIndex out of bound");
                    return;
                }
                let record = Panel.fileController.getRecord(srcCaseIdText, srcRecordIndex);
                Panel.fileController.addCommand(destCaseIdText, destRecordIndex, record.name, record.target, record.value);
                Panel.fileController.deleteRecord(srcCaseIdText, srcRecordIndex);
            },
            setBreakpoint: function (bool, 
                                    recordIndex = Panel.fileController.getSelectedRecord()[Panel.fileController.getSelectedRecord().length-1],
                                    caseIdText  = Panel.fileController.getSelectedCases()[0]) {
                let record = Panel.fileController.getRecord(caseIdText, recordIndex);
                record.breakpoint = bool;
            },
            getBreakpoint: function (recordIndex, caseIdText  = Panel.fileController.getSelectedCases()[0]) {
                let record = Panel.fileController.getRecord(caseIdText, recordIndex);
                return record.breakpoint;
            },
            changeUsedIndex: function(usedIndex, type, 
                                        recordIndex = Panel.fileController.getSelectedRecord()[Panel.fileController.getSelectedRecord().length-1],
                                        caseIdText  = Panel.fileController.getSelectedCases()[0]) {
                let record = Panel.fileController.getRecord(caseIdText, recordIndex);
                if (type === "target") {
                    record.target.usedIndex = usedIndex;
                } else if (type === "value") {
                    record.value.usedIndex = usedIndex;
                } else {
                    console.log(`"${type}" is invalid type. Only accept "target", "value"`);
                }
            },
            clearStatus: function (caseIdText = Panel.fileController.getSelectedCases()[0]) {
                let records = Panel.fileController.getRecords(caseIdText);
                Panel.fileController.clearIncludedRecords(records);
                Panel.fileController.clearRecordsStatus(["status", "snapshot"], records, true);
            },
            clearAllStatus: function() {
                let suiteIdTexts = Panel.fileController.getAllSuiteIdTexts();
                if (suiteIdTexts.length > 0) {
                    for (let suiteIdText of suiteIdTexts) {
                        let caseIdTexts = Panel.fileController.getCaseIdTextsInSuite(suiteIdText);
                        for (let caseIdText of caseIdTexts) {
                            let records = Panel.fileController.getRecords(caseIdText);
                            Panel.fileController.clearIncludedRecords(records);
                            Panel.fileController.clearRecordsStatus(["status", "snapshot"], records, true);
                        }
                    }
                }
            },
            setSelected: function (recordIdTexts) {
                Panel.fileController.setSelectedRecords(recordIdTexts);
            },
            getSelected: function () {
                return Panel.fileController.getSelectedRecords();
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
    log: {
        get: (target) => {
            switch (target) {
                case "logs":
                    return Panel.log.logs;
                case "typeMap":
                    return Panel.log.logTypeMap;
                default:
                    break;
            }
        },
        clear: () => {
            Panel.fileController.clearLog();
            Panel.log.clearLog();
        }
    },
    recorder: {
        start: (caseIdText = Panel.fileController.getSelectedCases()[0]) => {
            Panel.recorder.prepareRecord();

            if (Panel.fileController.getTestCase(caseIdText)) {
                console.log("Recording");
                Panel.fileController.setSelectedCases([caseIdText]);
                Panel.recorder.attach();
                Panel.recorder.notificationCount = 0;

                Panel.recorder.isRecord = true;

                EntryPoint.toolBar.syncButtonState();
                EntryPoint.fileList.syncFiles();
            } else {
                if (caseIdText)
                    return Panel.log.pushLog('error', caseIdText + " is not exist");
            }

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
        start: (mode = "all", idText = undefined, speed = 5) => {

            SideeX.default.setting.setSpeed(speed);

            Panel.recorder.isRecord = false;
            Panel.playback.isPlay = true;
            Panel.recorder.detach();

            switch (mode) {
                case "case": {
                    let caseIdText = idText === undefined ? Panel.fileController.getSelectedCases()[0] : idText;
                    if (Panel.fileController.getTestCase(caseIdText)) {
                        Panel.fileController.setSelectedCases([caseIdText]);
                        Panel.playback.doPlay(0, 0); // Playback.PLAY_CASE
                        return caseIdText;
                    } else {
                        if (caseIdText) {
                            return Panel.log.pushLog('error', caseIdText + " doesn't exist");
                        } else {
                            return Panel.log.pushLog('error', "There is no cases available, please record one first");
                        }
                    }
                }
                case "suite": {
                    let suiteIdText = idText === undefined ? Panel.fileController.getSelectedSuites()[0] : idText;
                    if (Panel.fileController.getTestSuite(suiteIdText)) {
                        Panel.fileController.setSelectedSuites([suiteIdText]);
                        Panel.playback.doPlay(0, 0); // Playback.PLAY_CASE
                        return suiteIdText;
                    } else {
                        if (suiteIdText) {
                            return Panel.log.pushLog('error', suiteIdText + " doesn't exist");
                        } else {
                            return Panel.log.pushLog('error', "There is no suites available, please record one first");
                        }
                    }
                }
                case "all": {
                    let caseIdText = idText === undefined ? Panel.fileController.getSelectedCases()[0] : idText;
                    if (Panel.fileController.getTestCase(caseIdText) === undefined) {
                        return Panel.log.pushLog('error', "There is no suites available, please record one first");
                    }
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
    },
    others: {
        selectElement: {
            start: () => {
                Panel.recorder.isSelecting = true;
                if (Panel.recorder.isRecord)
                    SideeX.default.recorder.start();
                Panel.recorder.startSelectingTarget()
                    .catch((error) => {
                        console.error(error);
                        log.pushLog("error", "Current active tab can't use inspector or was closed.");
                        Panel.recorder.isSelecting = false;
                        Panel.recorder.stopSelectingTarget();
                    });
            },
            stop: () => {
                Panel.recorder.isSelecting = false;
                Panel.recorder.stopSelectingTarget()
                    .catch((error) => { console.error(error); });
            }
        }
    }
};
