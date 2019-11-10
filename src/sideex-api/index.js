import { browser } from "webextension-polyfill-ts";
import platform from "platform";
// import * as EntryPoint from "../UI/entryPoint";
import { FileController } from '../panel/js/IO/file-controller';
import { BackgroundRecorder } from '../panel/js/background/recorder';
import { Playback } from '../panel/js/background/playback';
import { VariableController } from '../panel/js/background/variable-controller';
import { Setting } from "../panel/js/background/setting";
import { Log } from '../panel/js/background/log';

export class SideeX {
    constructor() {
        this.root = { isDOMBased: true };
        this.root.api = true;

        this.root.fileController = new FileController(this.root);
        this.root.recorder = new BackgroundRecorder(this.root);
        this.root.playback = new Playback(this.root);
        this.root.variables = new VariableController(this.root);
        this.root.log = new Log(this.root);
        this.root.setting = new Setting(this.root);
        this.file;
        this.variables;
        this.setting;
        this.log;
        this.playback;
        this.recorder;
        this.others;

        this.init();
    }

    init() {
        let self = this;
        this.file = {
            testSuite: {
                add: function (suiteData = { title: self.root.fileController.newUntitledName("suite") }) {
                    let checkResult = self.root.fileController.checkNameValid(suiteData.title);
                    if (checkResult.result) {
                        if (!self.root.fileController.isSuiteNameUsed(suiteData.title)) {
                            return self.root.fileController.addTestSuite(suiteData);
                        } else {
                            throw new Error(`Suite name "${suiteData.title}" has been used. Please use another one.`);
                        }
                    } else {
                        throw new Error(checkResult.message);
                    }
                },
                get: function (suiteIdText) {
                    return self.root.fileController.getTestSuite(suiteIdText);
                },
                getSuiteIdText: function (suiteName) {
                    return self.root.fileController.getSuiteKey(suiteName);
                },
                rename: function (suiteIdText, newSuiteName) {
                    let checkResult = self.root.fileController.checkNameValid(newSuiteName);
                    if (checkResult.result) {
                        if (!self.root.fileController.isSuiteNameUsed(newSuiteName)) {
                            self.root.fileController.setSuiteTitle(suiteIdText, newSuiteName);
                            return newSuiteName;
                        } else {
                            throw new Error(`Suite name "${newSuiteName}" has been used. Please use another one.`);
                        }
                    } else {
                        throw new Error(checkResult.message);
                    }
                },
                copy: function (suiteIdTexts = self.root.fileController.getSelectedSuites()[0]) {
                    self.root.fileController.copySuites(suiteIdTexts);
                },
                close: function (suiteIdTexts) {
                    suiteIdTexts = typeof (suiteIdTexts) === "string" ?
                        [suiteIdTexts] : suiteIdTexts;
                    if (suiteIdTexts.length > 0) {
                        for (let suiteIdText of suiteIdTexts) {
                            let index = self.root.fileController.testSuite.order.indexOf(suiteIdText);
                            self.root.fileController.deleteSuite(suiteIdText);
                            console.log(index);
                            let casesLength = self.root.fileController.testSuite.suites[`suite-${index - 1}`].cases.length;
                            self.root.fileController.setSelectedCases(casesLength !== 0 ? [self.root.fileController.testSuite.suites[`suite-${index - 1}`].cases[0]] : []);
                            self.root.fileController.setSelectedSuites(index !== 0 ? [`suite-${index - 1}`] : []);
                        }
                    }
                },
                closeAll: function () {
                    let suiteIdTexts = self.root.fileController.getAllSuiteIdTexts();
                    if (suiteIdTexts.length > 0) {
                        for (let suiteIdText of suiteIdTexts) {
                            self.root.fileController.deleteSuite(suiteIdText);
                        }
                    }
                },
                setSelected: function (suiteIdTexts) {
                    self.root.fileController.setSelectedSuites(suiteIdTexts);
                },
                getSelected: function () {
                    return self.root.fileController.getSelectedSuites();
                }
            },
            testCase: {
                add: function (caseData = {
                    title: self.root.fileController.newUntitledName("case"),
                    suiteIdText: self.root.fileController.getSelectedSuites()[0]
                }) {
                    let checkResult = self.root.fileController.checkNameValid(caseData.title);
                    if (checkResult.result) {
                        if (!self.root.fileController.isCaseNameUsed(caseData.title, caseData.suiteIdText)) {
                            return self.root.fileController.addTestCase(caseData);
                        } else {
                            throw new Error(`Case name "${caseData.title}" has been used in "${suiteIdText}". Please use another one.`);
                        }
                    } else {
                        throw new Error(checkResult.message);
                    }
                },
                get: function (caseIdText) {
                    return self.root.fileController.getTestCase(caseIdText);
                },
                getCaseIdText: function (caseName, suiteIdText = self.root.fileController.getSelectedSuites()[0]) {
                    return self.root.fileController.getCaseKey(suiteIdText, caseName);
                },
                rename: function (caseIdText, newCaseName) {
                    let suiteIdText = self.root.fileController.getTestCase(caseIdText).suiteIdText;
                    let checkResult = self.root.fileController.checkNameValid(newCaseName);
                    if (checkResult.result) {
                        if (!self.root.fileController.isCaseNameUsed(newCaseName, suiteIdText)) {
                            self.root.fileController.setCaseTitle(caseIdText, newCaseName);
                            self.root.fileController.setCaseModified(caseIdText, true, true);
                            return newCaseName;
                        } else {
                            throw new Error(`Case name "${newCaseName}" has been used in "${suiteIdText}". Please use another one.`);
                        }
                    } else {
                        throw new Error(checkResult.message);
                    }
                },
                copy: function (srcCaseIdTexts = self.root.fileController.getSelectedCases(),
                    dstSuiteIdText = self.root.fileController.getSelectedSuites()[0]) {
                    if (self.root.fileController.isSuiteExist(dstSuiteIdText)) {
                        self.root.fileController.copyCases(srcCaseIdTexts, dstSuiteIdText);
                    } else {
                        throw new Error(`Suite "${dstSuiteIdText}" not found.`);
                    }
                },
                cut: function (srcCaseIdTexts = self.root.fileController.getSelectedCases()[0],
                    dstSuiteIdText = self.root.fileController.getSelectedSuites()[0]) {
                    if (self.root.fileController.isSuiteExist(dstSuiteIdText)) {
                        self.root.fileController.cutCases(srcCaseIdTexts, dstSuiteIdText);
                    } else {
                        throw new Error(`Suite "${dstSuiteIdText}" not found.`);
                    }
                },
                remove: function (caseIdText) {
                    let suiteIdText = self.root.fileController.getTestCase(caseIdText).suiteIdText;
                    let cases = self.root.fileController.testSuite.suites[suiteIdText].cases;
                    let index = cases.indexOf(caseIdText);
                    self.root.fileController.deleteCase(caseIdText);
                    self.root.fileController.setSelectedCases(index !== 0 ? [`case-${index - 1}`] : []);
                    self.root.fileController.setSelectedSuites(suiteIdText);
                },
                setSelected: function (caseIdTexts) {
                    self.root.fileController.setSelectedCases(caseIdTexts);
                },
                getSelected: function () {
                    return self.root.fileController.getSelectedCases();
                }
            },
            record: {
                add: function (recordData = {
                    name: "Untitled Record",
                    target: { options: [{ type: "other", value: "" }] },
                    value: { options: [{ type: "other", value: "" }] }
                },
                    caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    self.root.recorder.prepareRecord();
                    let index = self.root.fileController.getRecordNum(caseIdText);
                    let info = self.root.fileController.addCommand(caseIdText, index, recordData.name, recordData.target, recordData.value);
                    self.root.fileController.setSelectedRecords([`records-${info.index}`]);
                },
                get: function (recordIndex, caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    return self.root.fileController.getRecord(caseIdText, recordIndex);
                },
                delete: function (recordIndex, caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    self.root.fileController.deleteRecord(caseIdText, recordIndex);
                },
                deleteAll: function (caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    self.root.fileController.deleteAllRecords(caseIdText);
                },
                copy: function (srcCaseIdText = self.root.fileController.getSelectedCases()[0],
                    srcRecordIndex = self.root.fileController.getSelectedRecord()[self.root.fileController.getSelectedRecord().length - 1],
                    destCaseIdText = self.root.fileController.getSelectedCases()[0],
                    destRecordIndex = self.root.fileController.getRecordNum(destCaseIdText) - 1) {
                    if (destRecordIndex > self.root.fileController.getRecordNum(destCaseIdText)) {
                        throw new Error(`DestRecordIndex "${destRecordIndex}" out of bound`);
                    }
                    let record = self.root.fileController.getRecord(srcCaseIdText, srcRecordIndex);
                    self.root.fileController.addCommand(destCaseIdText, destRecordIndex, record.name, record.target, record.value);
                },
                cut: function (srcCaseIdText = self.root.fileController.getSelectedCases()[0],
                    srcRecordIndex = self.root.fileController.getSelectedRecord()[self.root.fileController.getSelectedRecord().length - 1],
                    destCaseIdText = self.root.fileController.getSelectedCases()[0],
                    destRecordIndex = self.root.fileController.getRecordNum(destCaseIdText) - 1) {
                    if (srcCaseIdText === destCaseIdText
                        && destRecordIndex > self.root.fileController.getRecordNum(destCaseIdText) - 1) {
                        throw new Error(`DestRecordIndex "${destRecordIndex}" out of bound`);
                    } else if (srcCaseIdText !== destCaseIdText
                        && destRecordIndex > self.root.fileController.getRecordNum(destCaseIdText)) {
                        throw new Error(`DestRecordIndex "${destRecordIndex}" out of bound`);
                    }
                    let record = self.root.fileController.getRecord(srcCaseIdText, srcRecordIndex);
                    self.root.fileController.addCommand(destCaseIdText, destRecordIndex, record.name, record.target, record.value);
                    self.root.fileController.deleteRecord(srcCaseIdText, srcRecordIndex);
                },
                setBreakpoint: function (bool,
                    recordIndex = self.root.fileController.getSelectedRecord()[self.root.fileController.getSelectedRecord().length - 1],
                    caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    let record = self.root.fileController.getRecord(caseIdText, recordIndex);
                    record.breakpoint = bool;
                },
                getBreakpoint: function (recordIndex, caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    let record = self.root.fileController.getRecord(caseIdText, recordIndex);
                    return record.breakpoint;
                },
                changeUsedIndex: function (usedIndex, type,
                    recordIndex = self.root.fileController.getSelectedRecord()[self.root.fileController.getSelectedRecord().length - 1],
                    caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    let record = self.root.fileController.getRecord(caseIdText, recordIndex);
                    if (type === "target") {
                        record.target.usedIndex = usedIndex;
                    } else if (type === "value") {
                        record.value.usedIndex = usedIndex;
                    } else {
                        throw new Error(`"${type}" is invalid type. Only accept "target", "value"`);
                    }
                },
                clearStatus: function (caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    let records = self.root.fileController.getRecords(caseIdText);
                    self.root.fileController.clearIncludedRecords(records);
                    self.root.fileController.clearRecordsStatus(["status", "snapshot"], records, true);
                },
                clearAllStatus: function () {
                    let suiteIdTexts = self.root.fileController.getAllSuiteIdTexts();
                    if (suiteIdTexts.length > 0) {
                        for (let suiteIdText of suiteIdTexts) {
                            let caseIdTexts = self.root.fileController.getCaseIdTextsInSuite(suiteIdText);
                            for (let caseIdText of caseIdTexts) {
                                let records = self.root.fileController.getRecords(caseIdText);
                                self.root.fileController.clearIncludedRecords(records);
                                self.root.fileController.clearRecordsStatus(["status", "snapshot"], records, true);
                            }
                        }
                    }
                },
                setSelected: function (recordIdTexts) {
                    self.root.fileController.setSelectedRecords(recordIdTexts);
                },
                getSelected: function () {
                    return self.root.fileController.getSelectedRecords();
                }
            }
        };
        this.variables = {
            add: (name, value) => {                         // ("var-0", 1)
                return this.root.variables.addVariable(name, value);
            },
            get: (target = "vars") => {
                switch (target) {
                    case "count":
                        return this.root.variables.getVarNum();
                    case "startNum":
                        return this.root.variables.globalVars.startNum;
                    case "varNames":
                        return this.root.variables.globalVars.varNames;
                    case "vars":
                        return this.root.variables.globalVars.vars;
                    default:
                        break;
                }
            },
            delete: (varIdTexts) => {                        // (["var-0"])
                this.root.variables.deleteVariable(varIdTexts);
                return varIdText;
            },
            clearAll: () => {
                this.root.variables.clearVariables();
            },
            changeName: (varIdText, name) => {
                if (varIdText)
                    this.root.variables.updateVarName(varIdText, name);
                return { varIdText, name };
            },
            changeValue: (varIdText, value) => {
                if (varIdText)
                    this.root.variables.updateVarValue(varIdText, value);
                return { varIdText, value };
            }
        };
        this.log = {
            get: (target) => {
                switch (target) {
                    case "logs":
                        return this.root.log.logs;
                    case "typeMap":
                        return this.root.log.logTypeMap;
                    default:
                        break;
                }
            },
            clear: () => {
                this.root.fileController.clearLog();
                this.root.log.clearLog();
                return this.root.log.logs;
            }
        };
        this.recorder = {
            start: (caseIdText = this.root.fileController.getSelectedCases()[0]) => {
                if (caseIdText === undefined) {
                    this.root.recorder.prepareRecord();
                    console.log(123123);
                    caseIdText = this.root.fileController.getSelectedCases()[0];
                }
                if (this.root.fileController.getTestCase(caseIdText)) {
                    console.log("Recording");
                    this.root.fileController.setSelectedCases([caseIdText]);
                    this.root.recorder.attach();
                    this.root.recorder.notificationCount = 0;

                    this.root.recorder.isRecord = true;

                    //EntryPoint.toolBar.syncButtonState();
                    //EntryPoint.fileList.syncFiles();
                } else {
                    if (caseIdText)
                        throw new Error(`${caseIdText} doesen't exist`);
                }

            },
            stop: () => {
                console.log("Stop");
                this.root.recorder.detach();
                this.root.recorder.isRecord = false;

                //EntryPoint.toolBar.syncButtonState();
                //EntryPoint.fileList.syncFiles();
            }
        };
        this.setting = {
            setSpeed: (value) => {
                if (value < 0 || value > 5) {
                    return this.root.log.pushLog('error', 'speed should be set from range 1 to 5');
                } else {
                    this.root.setting.set({ delay: 500 * (5 - value) });
                    //EntryPoint.toolBar.updateSpeed(parseInt(value));
                    return value;
                }
            },
            getSpeed: () => {
                let speed = 5 - (this.root.setting.params.delay / 500);
                return speed;
            }
        };
        this.playback = {
            start: (mode = "all", idText = undefined, speed = 5) => {
                this.setting.setSpeed(speed);

                this.root.recorder.isRecord = false;
                this.root.playback.isPlay = true;
                this.root.recorder.detach();

                switch (mode) {
                    case "case": {
                        let caseIdText = idText === undefined ? this.root.fileController.getSelectedCases()[0] : idText;
                        if (this.root.fileController.getTestCase(caseIdText)) {
                            this.root.fileController.setSelectedCases([caseIdText]);
                            this.root.playback.doPlay(0, 0); // Playback.PLAY_CASE
                            return caseIdText;
                        } else {
                            if (caseIdText) {
                                throw new Error(`${caseIdText} doesen't exist`);
                            } else {
                                throw new Error("There is no cases available, please record one first");
                            }
                        }
                    }
                    case "suite": {
                        let suiteIdText = idText === undefined ? this.root.fileController.getSelectedSuites()[0] : idText;
                        if (this.root.fileController.getTestSuite(suiteIdText)) {
                            this.root.fileController.setSelectedSuites([suiteIdText]);
                            this.root.playback.doPlay(0, 0); // Playback.PLAY_CASE
                            return suiteIdText;
                        } else {
                            if (suiteIdText) {
                                throw new Error(`${suiteIdText} doesen't exist`);
                            } else {
                                throw new Error("There is no suites available, please record one first");
                            }
                        }
                    }
                    case "all": {
                        let caseIdText = idText === undefined ? this.root.fileController.getSelectedCases()[0] : idText;
                        if (this.root.fileController.getTestCase(caseIdText) === undefined) {
                            throw new Error("There is no suites available, please record one first");
                        }
                        this.root.playback.doPlay(2, 0); // Playback.PLAY_ALL_SUITES
                        break;
                    }
                }
                //EntryPoint.toolBar.syncButtonState();

            },
            stop: () => {
                this.root.playback.stop();

                this.root.playback.isPlay = false;
                //EntryPoint.toolBar.syncButtonState();
            },
            pause: () => {
                this.root.playback.pause();

                this.root.playback.isPlay = false;
                this.root.playback.isPause = true;
                //EntryPoint.toolBar.syncButtonState();
            },
            resume: () => {
                this.root.playback.resume();

                this.root.playback.isPlay = true;
                this.root.playback.isPause = false;
                //EntryPoint.toolBar.syncButtonState();
            }
        };
        this.others = {
            selectElement: {
                start: () => {
                    this.root.recorder.isSelecting = true;
                    if (this.root.recorder.isRecord)
                        this.root.recorder.start();
                    this.root.recorder.startSelectingTarget()
                        .catch((error) => {
                            console.error(error);
                            log.pushLog("error", "Current active tab can't use inspector or was closed.");
                            this.root.recorder.isSelecting = false;
                            this.root.recorder.stopSelectingTarget();
                        });
                },
                stop: () => {
                    this.root.recorder.isSelecting = false;
                    this.root.recorder.stopSelectingTarget()
                        .catch((error) => { console.error(error); });
                }
            },
            //TODO: test config
            showElement: async (target, htmlString) => {
                try {
                    // TODO: handle tac value
                    let tabs = await browser.tabs.query({
                        active: true,
                        windowId: this.root.recorder.contentWindowId
                    });
                    if (tabs.length === 0) {
                        console.log("No match tabs");
                    } else {
                        let framesInfo = await browser.webNavigation.getAllFrames({ tabId: tabs[0].id });
                        let frameIds = [];
                        for (let info of framesInfo) {
                            frameIds.push(info.frameId);
                        }
                        frameIds.sort();
                        let infos = {
                            index: 0,
                            tabId: tabs[0].id,
                            frameIds: frameIds,
                            targetValue: target,
                            customHtml: htmlString
                        };
                        this.root.recorder.sendShowElementMessage(infos);
                    }
                } catch (e) {
                    console.error(e);
                }
            },
            //TODO: test
            reportError: async (errorText, mode) => {
                if (errorText.length === 0 && mode === "none") return;

                let obj = {
                    env: {
                        browser: platform.name,
                        browserVersion: platform.version,
                        os: platform.os.family,
                        osVersion: platform.os.version,
                        screen: {
                            width: (screen.width) ? screen.width : -1,
                            height: (screen.height) ? screen.height : -1
                        }
                    },
                    content: {
                        text: errorText,
                        file: { type: mode, testSuite: { suites: {} }, testCase: { cases: {} } },
                        logs: this.root.log.logs
                    }
                };
                switch (mode) {
                    case "case": {
                        let caseIdText = this.root.fileController.getSelectedCases()[0];
                        if (!caseIdText) break;
                        obj.content.file.testCase.cases[caseIdText] = this.root.fileController.getTestCase(caseIdText);
                        break;
                    }
                    case "suite": {
                        let suiteIdText = this.root.fileController.getSelectedSuites()[0];
                        if (!suiteIdText) break;
                        let caseIdTexts = this.root.fileController.getTestSuite(suiteIdText).cases;
                        obj.content.file.testSuite.suites[suiteIdText] = this.root.fileController.getTestSuite(suiteIdText);
                        for (let caseIdText of caseIdTexts) {
                            obj.content.file.testCase.cases[caseIdText] = this.root.fileController.getTestCase(caseIdText);
                        }
                        break;
                    }
                    case "all": {
                        obj.content.file.testSuite = this.root.fileController.testSuite;
                        obj.content.file.testCase = this.root.fileController.testCase;
                        break;
                    }
                    default:
                        break;
                }
                console.log(obj);
                console.log(this.root.setting.get("token"));
                return await fetch("https://sideex.io/api/reports/widget/error", {
                    headers: {
                        'content-type': 'application/json'
                        // 'Authorization': `Bearer ${this.root.setting.get("token")}`
                    },
                    method: 'POST',
                    body: JSON.stringify(obj)
                });
            }
        };
    }
}
