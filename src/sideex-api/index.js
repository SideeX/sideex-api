import platform from "platform";
import { FileController } from '../panel/js/IO/file-controller';
import { BackgroundRecorder } from '../panel/js/background/recorder';
import { Playback } from '../panel/js/background/playback';
import { VariableController } from '../panel/js/background/variable-controller';
import { Setting } from "../panel/js/background/setting";
import { Log } from '../panel/js/background/log';
import "../content/command-receiver-for-api";
import "../content/recorder-handlers";
import { Recorder } from "../content/recorder";
import { locatorBuilders } from "../content/content-initialization";

export class SideeX {
    constructor() {
        this.root = { isDOMBased: false };
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
                getSuitesOrder: function () {
                    return self.root.fileController.testSuite.order;
                },
                // checkSuitesLength: function () {
                //     return self.root.fileController.testSuite.count;
                // },
                close: function (suiteIdTexts) {
                    suiteIdTexts = typeof (suiteIdTexts) === "string" ?
                        [suiteIdTexts] : suiteIdTexts;
                    if (suiteIdTexts.length > 0) {
                        for (let suiteIdText of suiteIdTexts) {
                            let index = self.root.fileController.testSuite.order.indexOf(suiteIdText);
                            let indexOfSelectedSuiteIdText = 0;
                            let indexOfSelectedCaseIdText = 0;
                            for (let selectedSuiteIdText of self.root.fileController.getSelectedSuites()) {
                                if (selectedSuiteIdText === suiteIdText) {
                                    self.root.fileController.selectedSuiteIdTexts.splice(indexOfSelectedSuiteIdText++, 1);
                                    break;
                                }
                            }
                            for (let selectedCaseIdText of self.root.fileController.getSelectedCases()) {
                                if (self.root.fileController.getTestCase(selectedCaseIdText).suiteIdText === suiteIdText) {
                                    self.root.fileController.selectedCaseIdTexts.splice(indexOfSelectedCaseIdText++, 1);
                                }
                            }
                            self.root.fileController.deleteSuite(suiteIdText);
                            // console.log(index);
                            // let casesLength = self.root.fileController.testSuite.suites[`suite-${index - 1}`].cases.length;
                            // self.root.fileController.setSelectedCases(casesLength !== 0 ? [self.root.fileController.testSuite.suites[`suite-${index - 1}`].cases[0]] : []);
                            // self.root.fileController.setSelectedSuites(index !== 0 ? [`suite-${index - 1}`] : []);
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
                    self.root.fileController.setSelectedCases([]);
                    self.root.fileController.setSelectedSuites([]);
                },
                setSelected: function (suiteIdTexts) {
                    self.root.fileController.setSelectedSuites(suiteIdTexts);
                },
                getSelected: function () {
                    return self.root.fileController.getSelectedSuites();
                },
                load: function (file) {
                    return self.root.fileController.loadFile.readFile(file);
                },
                save: function () {
                    let suiteIdTexts = self.root.fileController.getSelectedSuites();
                    return self.root.fileController.saveFile.downloadSuites(suiteIdTexts);
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
                    // self.root.fileController.setSelectedCases(index !== 0 ? [`case-${index - 1}`] : []);
                    // self.root.fileController.setSelectedSuites(suiteIdText);
                    let indexOfSelectedCaseIdText = 0;
                    let indexOfSelectedRecordIndex = 0;
                    for (let selectedCaseIdText of self.root.fileController.getSelectedCases()) {
                        if (selectedCaseIdText === caseIdText) {
                            self.root.fileController.selectedCaseIdTexts.splice(indexOfSelectedCaseIdText++, 1);
                        }
                    }
                    self.root.fileController.setSelectedSuites([suiteIdText]);
                },
                getCasesOrder: function () {
                    return self.root.fileController.testCase.cases;
                },
                // checkCasesLength: function () {
                //     return self.root.fileController.testCase.count;
                // },
                setSelected: function (caseIdTexts) {
                    self.root.fileController.setSelectedCases(caseIdTexts);
                },
                getSelected: function () {
                    return self.root.fileController.getSelectedCases();
                }
            },
            command: {
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
                return self.root.variables.addVariable(name, value);
            },
            get: (target = "vars") => {
                switch (target) {
                    case "count":
                        return self.root.variables.getVarNum();
                    case "startNum":
                        return self.root.variables.globalVars.startNum;
                    case "varNames":
                        return self.root.variables.globalVars.varNames;
                    case "vars":
                        return self.root.variables.globalVars.vars;
                    default:
                        break;
                }
            },
            delete: (varIdText) => {                        // (["var-0"])
                self.root.variables.deleteVariable(varIdText);
                return varIdText;
            },
            clearAll: () => {
                self.root.variables.clearVariables();
            },
            changeName: (varIdText, name) => {
                if (varIdText)
                    self.root.variables.updateVarName(varIdText, name);
                return { varIdText, name };
            },
            changeValue: (varIdText, value) => {
                if (varIdText)
                    self.root.variables.updateVarValue(varIdText, value);
                return { varIdText, value };
            }
        };
        this.log = {
            get: (target) => {
                switch (target) {
                    case "logs":
                        return self.root.log.logs;
                    case "typeMap":
                        return self.root.log.logTypeMap;
                    default:
                        break;
                }
            },
            clear: () => {
                self.root.fileController.clearLog();
                self.root.log.clearLog();
                return self.root.log.logs;
            }
        };
        this.recorder = {
            start: (caseIdText = self.root.fileController.getSelectedCases()[0]) => {
                if (caseIdText === undefined) {
                    self.root.recorder.prepareRecord();
                    caseIdText = self.root.fileController.getSelectedCases()[0];
                }
                if (self.root.fileController.getTestCase(caseIdText)) {
                    console.log("Recording");
                    self.root.fileController.setSelectedCases([caseIdText]);
                    self.root.recorder.attach();
                    self.root.recorder.notificationCount = 0;

                    self.root.recorder.isRecord = true;
                } else {
                    if (caseIdText)
                        throw new Error(`${caseIdText} doesen't exist`);
                }

            },
            stop: () => {
                self.root.recorder.detach();
                self.root.recorder.isRecord = false;
            }
        };
        this.setting = {
            setSpeed: (value) => {
                if (value < 0 || value > 5) {
                    return this.root.log.pushLog('error', 'speed should be set from range 1 to 5');
                } else {
                    self.root.setting.set({ delay: 500 * (5 - value) });
                    return value;
                }
            },
            getSpeed: () => {
                let speed = 5 - (self.root.setting.params.delay / 500);
                return speed;
            }
        };
        this.playback = {
            start: (mode = "all", idText = undefined, speed = 5) => {
                self.setting.setSpeed(speed);

                self.root.recorder.isRecord = false;
                self.root.playback.isPlay = true;
                self.root.recorder.detach();
                switch (mode) {
                    case "case": {
                        // console.log("case");
                        let caseIdText = idText === undefined ? self.root.fileController.getSelectedCases()[0] : idText;
                        if (self.root.fileController.getTestCase(caseIdText)) {
                            self.root.fileController.setSelectedCases([caseIdText]);
                            self.root.playback.doPlay(0, 0); // Playback.PLAY_CASE
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
                        // console.log("suite");
                        let suiteIdText = idText === undefined ? self.root.fileController.getSelectedSuites()[0] : idText;
                        if (self.root.fileController.getTestSuite(suiteIdText)) {
                            self.root.fileController.setSelectedSuites([suiteIdText]);
                            self.root.playback.doPlay(1, 0); // Playback.PLAY_CASE
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
                        let caseIdText = idText === undefined ? self.root.fileController.getSelectedCases()[0] : idText;
                        if (self.root.fileController.getTestCase(caseIdText) === undefined) {
                            throw new Error("There is no suites available, please record one first");
                        }
                        self.root.playback.doPlay(2, 0); // Playback.PLAY_ALL_SUITES
                        break;
                    }
                }


            },
            stop: () => {
                self.root.playback.stop();
                self.root.playback.isPlay = false;
            },
            pause: () => {
                self.root.playback.pause();
                self.root.playback.isPlay = false;
                self.root.playback.isPause = true;
            },
            resume: () => {
                self.root.playback.resume();
                self.root.playback.isPlay = true;
                self.root.playback.isPause = false;
            },
            addCustomCommand: (cmdName, verifyLocator = true, commandFunction) => {
                let isDoSnapshot = true;
                let type = {record: "mouse", playback: "content"};
                let isManual = false;
                let  reference = {name: cmdName, target: "A locator", value: "", description: ""};
                self.root.playback.commandReferences[cmdName] = {
                    isDoSnapshot: isDoSnapshot,
                    type: {
                        record: type.record,
                        playback: type.playback
                    },
                    isManual: isManual,
                    verifyLocator: verifyLocator,
                    reference: {
                        name: reference.name,
                        target: reference.target,
                        value: reference.value,
                        description: reference.description
                    }

                };
                self.root.playback.sideex.addCommand(cmdName, commandFunction);

            },

            findElement: (locator) => {
                // console.log(locator)
                // console.log(self.root.playback.sideex.browserBot.findElement(locator));
                return (self.root.playback.sideex.browserBot.findElement(locator));
            },

            getClientXY: (element, coordString) => {
                // console.log(element);
                // console.log(coordString);
                return (self.root.playback.sideex.getClientXY(element, coordString));
            }

        };
        this.others = {
            // selectElement: {
            //     start: () => {
            //         this.root.recorder.isSelecting = true;
            //         if (this.root.recorder.isRecord)
            //             this.root.recorder.start();
            //         this.root.recorder.startSelectingTarget()
            //             .catch((error) => {
            //                 console.error(error);
            //                 log.pushLog("error", "Current active tab can't use inspector or was closed.");
            //                 this.root.recorder.isSelecting = false;
            //                 this.root.recorder.stopSelectingTarget();
            //             });
            //     },
            //     stop: () => {
            //         this.root.recorder.isSelecting = false;
            //         this.root.recorder.stopSelectingTarget()
            //             .catch((error) => { console.error(error); });
            //     }
            // },
            // //TODO: test config
            // showElement: async (target, htmlString) => {
            //     try {
            //         // TODO: handle tac value
            //         let tabs = await browser.tabs.query({
            //             active: true,
            //             windowId: this.root.recorder.contentWindowId
            //         });
            //         if (tabs.length === 0) {
            //             console.log("No match tabs");
            //         } else {
            //             let framesInfo = await browser.webNavigation.getAllFrames({ tabId: tabs[0].id });
            //             let frameIds = [];
            //             for (let info of framesInfo) {
            //                 frameIds.push(info.frameId);
            //             }
            //             frameIds.sort();
            //             let infos = {
            //                 index: 0,
            //                 tabId: tabs[0].id,
            //                 frameIds: frameIds,
            //                 targetValue: target,
            //                 customHtml: htmlString
            //             };
            //             this.root.recorder.sendShowElementMessage(infos);
            //         }
            //     } catch (e) {
            //         console.error(e);
            //     }
            // },
            // //TODO: test
            // reportError: async (errorText, mode) => {
            //     if (errorText.length === 0 && mode === "none") return;

            //     let obj = {
            //         env: {
            //             browser: platform.name,
            //             browserVersion: platform.version,
            //             os: platform.os.family,
            //             osVersion: platform.os.version,
            //             screen: {
            //                 width: (screen.width) ? screen.width : -1,
            //                 height: (screen.height) ? screen.height : -1
            //             }
            //         },
            //         content: {
            //             text: errorText,
            //             file: { type: mode, testSuite: { suites: {} }, testCase: { cases: {} } },
            //             logs: this.root.log.logs
            //         }
            //     };
            //     switch (mode) {
            //         case "case": {
            //             let caseIdText = this.root.fileController.getSelectedCases()[0];
            //             if (!caseIdText) break;
            //             obj.content.file.testCase.cases[caseIdText] = this.root.fileController.getTestCase(caseIdText);
            //             break;
            //         }
            //         case "suite": {
            //             let suiteIdText = this.root.fileController.getSelectedSuites()[0];
            //             if (!suiteIdText) break;
            //             let caseIdTexts = this.root.fileController.getTestSuite(suiteIdText).cases;
            //             obj.content.file.testSuite.suites[suiteIdText] = this.root.fileController.getTestSuite(suiteIdText);
            //             for (let caseIdText of caseIdTexts) {
            //                 obj.content.file.testCase.cases[caseIdText] = this.root.fileController.getTestCase(caseIdText);
            //             }
            //             break;
            //         }
            //         case "all": {
            //             obj.content.file.testSuite = this.root.fileController.testSuite;
            //             obj.content.file.testCase = this.root.fileController.testCase;
            //             break;
            //         }
            //         default:
            //             break;
            //     }
            //     console.log(obj);
            //     console.log(this.root.setting.get("token"));
            //     return await fetch("https://sideex.io/api/reports/widget/error", {
            //         headers: {
            //             'content-type': 'application/json'
            //             // 'Authorization': `Bearer ${this.root.setting.get("token")}`
            //         },
            //         method: 'POST',
            //         body: JSON.stringify(obj)
            //     });
            // }
        };
    }
}
