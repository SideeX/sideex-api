import { FileController } from '../panel/js/IO/file-controller';
import { BackgroundRecorder } from '../panel/js/background/recorder';
import { Playback } from '../panel/js/background/playback';
import { VariableController } from '../panel/js/background/variable-controller';
import { Setting } from "../panel/js/background/setting";
import { Log } from '../panel/js/background/log';
import "../content/command-receiver-for-api";
import "../content/recorder-handlers";

/**
 * @file SideeX-API
 * @author SideeX Team
 * @see <a href="https://sideex.io/">sideex.io</a>
 */

 /**
  * 
  */
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
        /**
         * @namespace
         */
        this.file = {
            /**
             * @namespace
             */
            testSuite: {
                /**
                 * suiteData 
                 * - Details of the test suite.
                 * @memberof SideeX#file.testSuite
                 * @typedef {object} suiteData
                 * @property {string} suiteData.filename - Filename of the test suite
                 * @property {string} suiteData.title - Ttitle of the test suite
                 * @property {Array<string>} suiteData.cases - The test cases in the test suite
                 * @property {boolean} suiteData.modified - Is this test suite modified
                 * @property {string} suiteData.status - Status of the test suite
                 */
                /**
                 * suiteIdString
                 * - Id of the test suite”
                 * @memberof SideeX#file.testSuite
                 * @typedef {string} suiteIdString
                 */

                /**
                 * suiteIdStrings
                 * - Id of the test suites”
                 * @memberof SideeX#file.testSuite
                 * @typedef {Array<string>} suiteIdStrings
                 */


                /**
                 * selectedSuitesId 
                 * - The test suites id that are currently selected
                 * @memberof SideeX#file.testSuite
                 * @typedef {Array<string>} selectedSuitesId
                 */


                /**
                 * jsonString
                 * - String of the JSON object
                 * @memberof SideeX#file.testSuite
                 * @typedef {string} jsonString
                 */
                
                 
                /**
                 * @memberof SideeX#file.testSuite
                 * @method add
                 * @description Adds a new test suite.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * console.log(sideex.file.testSuite.add());
                 * @param {object} [suiteData] - Details of the test suite. [suiteData]{@link SideeX#file.testSuite.suiteData}
                 * @returns {string} suiteIdString - Id of the test suite. [suiteIdString]{@link SideeX#file.testSuite.suiteIdString}
                 */
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
                /**
                 * @memberof SideeX#file.testSuite
                 * @method get
                 * @description Gets the detail of a test suite.
                 * @param {string} suiteIdString - Id of the test suite
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testSuite.get("suite-0");
                 * @returns {object} suiteData - Details of the test suite. [suiteData]{@link SideeX#file.testSuite.suiteData}
                 */
                get: function (suiteIdText) {
                    return self.root.fileController.getTestSuite(suiteIdText);
                },
                /**
                 * @memberof SideeX#file.testSuite
                 * @method getSuiteIdText
                 * @description Gets the test suite id by its name.
                 * @param {string} suiteName - Name of the test suite
                 * @returns {string} suiteIdString - Id of the test suite. [suiteIdString]{@link SideeX#file.testSuite.suiteIdString}
                 */
                getSuiteIdText: function (suiteName) {
                    return self.root.fileController.getSuiteKey(suiteName);
                },
                /**
                 * @memberof SideeX#file.testSuite
                 * @method rename
                 * @description Renames a test suite.
                 * @param {string} suiteIdString - Id of the test suite. [suiteIdString]{@link SideeX#file.testSuite.suiteIdString}
                 * @param {string} newSuiteName - New name for the test suite
                 * @returns {string} newSuiteName - New name for the test suite
                 */
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
                /**
                 * @memberof SideeX#file.testSuite
                 * @method copy
                 * @description Copies a test suite.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testSuite.copy("suite-0");
                 * console.log(sideex.file.testSuite.getSuitesOrder());
                 * @param {Array<string>} [suiteIdStrings = selectedSuitesId] - Ids of the test case to be copied and pasted [selectedSuitesId]{@link SideeX#file.testSuite.selectedSuitesId}
                 */
                copy: function (suiteIdTexts = self.root.fileController.getSelectedSuites()[0]) {
                    self.root.fileController.copySuites(suiteIdTexts);
                },
                /**
                 * @memberof SideeX#file.testSuite
                 * @method getSuitesOrder
                 * @description Gets the test suites' order.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testSuite.add();
                 * console.log(sideex.file.testSuite.getSuitesOrder());
                 * @returns {Array<string>} suiteIdStrings - Ids of the test suites. [suiteIdStrings]{@link SideeX#file.testSuite.suiteIdStrings}
                 */
                getSuitesOrder: function () {
                    return self.root.fileController.testSuite.order;
                },
                // checkSuitesLength: function () {
                //     return self.root.fileController.testSuite.count;
                // },
                /**
                 * @memberof SideeX#file.testSuite
                 * @method close
                 * @description Closes test suites.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * console.log(sideex.file.testSuite.getSuitesOrder());
                 * sideex.file.testSuite.close("suite-0");
                 * console.log(sideex.file.testSuite.getSuitesOrder());
                 * @param {Array<string>} suiteIdStrings - Ids of the test suites. [suiteIdStrings]{@link SideeX#file.testSuite.suiteIdStrings}
                 */
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
                /**
                 * @memberof SideeX#file.testSuite
                 * @method closeAll
                 * @description Closes all of the test suites.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testSuite.add();
                 * console.log(sideex.file.testSuite.getSuitesOrder());
                 * sideex.file.testSuite.closeAll();
                 * console.log(sideex.file.testSuite.getSuitesOrder());
                 */
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
                /**
                 * @memberof SideeX#file.testSuite
                 * @method setSelected
                 * @description Changes the selected test suites.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testSuite.setSelected("suite-0");
                 * console.log(sideex.file.testSuite.getSelected()); 
                 * @param {Array<string>} suiteIdStrings - Ids of the test suites. [suiteIdStrings]{@link SideeX#file.testSuite.suiteIdStrings}
                 */
                setSelected: function (suiteIdTexts) {
                    self.root.fileController.setSelectedSuites(suiteIdTexts);
                },
                /**
                 * @memberof SideeX#file.testSuite
                 * @method getSelected
                 * @description Gets the selected test suites.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testSuite.setSelected("suite-0");
                 * console.log(sideex.file.testSuite.getSelected());
                 * @returns {Array<string>} suiteIdStrings - Ids of the test suites. [suiteIdStrings]{@link SideeX#file.testSuite.suiteIdStrings}
                 */
                getSelected: function () {
                    return self.root.fileController.getSelectedSuites();
                },
                /**
                 * @memberof SideeX#file.testSuite
                 * @method load
                 * @description Loads the file for playback.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.recorder.start();
                 * //record commands.
                 * sideex.recorder.stop();
                 * //you have to have a test suite first, or just record one.
                 * let jsonString = sideex.file.testSuite.save();
                 * sideex.file.testSuite.load(jsonString);
                 * sideex.playback.start();
                 * @param {string} jsonString - String of the JSON object. [jsonString]{@link SideeX#file.testSuite.jsonString}
                 */
                load: function (file) {
                    return self.root.fileController.loadFile.readFile(file);
                },
                /**
                 * @memberof SideeX#file.testSuite
                 * @method save
                 * @description Saves the file.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * //you have to have a test suite first, or just record one.
                 * let jsonString = sideex.file.testSuite.save();
                 * sideex.file.testSuite.load(jsonString);
                 * sideex.playback.start();
                 * @returns {string} - String of the JSON object
                 */
                save: function () {
                    let suiteIdTexts = self.root.fileController.getSelectedSuites();
                    return self.root.fileController.saveFile.downloadSuites(suiteIdTexts);
                }
            },
            /**
             * @namespace
             */
            testCase: {
                /** 
                 * caseData 
                 * - Details of the test case
                 * @memberof SideeX#file.testCase
                 * @typedef {object} caseData
                 * @property {string} caseData.title - Title of the test case
                 * @property {Array<string>} caseData.commands - Commands of the test case
                 * @property {string} caseData.suiteIdString - The suite id where it belongs to
                 * @property {boolean} caseData.modified - Is this case modified
                 * @property {string} caseData.status - Status of the test case
                 */
                /**
                 * caseIdString 
                 * - Id of the test case
                 * @memberof SideeX#file.testCase
                 * @typedef {string} caseIdString
                 */
                /**
                 * caseIdStrings
                 * - Id of the test cases
                 * @memberof SideeX#file.testCase
                 * @typedef {Array<string>} caseIdStrings
                 */
                /**
                 * suiteIdString 
                 * - Id of the test suite
                 * @memberof SideeX#file.testCase
                 * @typedef {string} suiteIdString
                 */

                /**
                 * selectedSuiteId
                 * - The test suite id that is currently selected
                 * @memberof SideeX#file.testCase
                 * @typedef {string} selectedSuiteId
                 */
                /**
                 * selectedCasesId
                 * - The test cases id that is currently selected
                 * @memberof SideeX#file.testCase
                 * @typedef {Array<string>} selectedCasesId
                 */

                /**
                 * @memberof SideeX#file.testCase
                 * @method add
                 * @description Adds a new test case.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * @param {object} [caseData] - Details of the test case. [caseData]{@link SideeX#file.testCase.caseData}
                 * @returns {string} caseIdString - Id of the test case. [caseIdString]{@link SideeX#file.testCase.caseIdString}
                 */
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
                /**
                 * @memberof SideeX#file.testCase
                 * @method get
                 * @description Get the details of the test case.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * console.log(sideex.file.testCase.get("case-0"));
                 * @param {string} caseIdString - The id of test case. [caseIdString]{@link SideeX#file.testCase.caseIdString}
                 * @returns {object} caseData - The detail of test case. [caseData]{@link SideeX#file.testCase.caseData}
                 */
                get: function (caseIdText) {
                    return self.root.fileController.getTestCase(caseIdText);
                },
                /**
                 * @memberof SideeX#file.testCase
                 * @method getCaseIdText
                 * @description Get id by test case name. 
                 * @param {string} caseName - The name of test case.
                 * @param {string} [suiteIdString = selectedSuiteId] - The id of test suite. [selectedSuiteId]{@link SideeX#file.testCase.selectedSuiteId}
                 * @returns {string} caseIdString - The id of test case. [caseIdString]{@link SideeX#file.testCase.caseIdString}
                 */
                getCaseIdText: function (caseName, suiteIdText = self.root.fileController.getSelectedSuites()[0]) {
                    return self.root.fileController.getCaseKey(suiteIdText, caseName);
                },
                /**
                 * @memberof SideeX#file.testCase
                 * @method rename
                 * @description Renames a test case.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * console.log(sideex.file.testCase.rename("case-0", "sideex"));
                 * console.log(sideex.file.testCase.get("case-0"));
                 * @param {string} caseIdString - Id of the test case. [caseIdString]{@link SideeX#file.testCase.caseIdString}
                 * @param {string} newCaseName - New name for the test case
                 * @returns {string} newCaseName - New name for the test case
                 */
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
                /**
                 * @memberof SideeX#file.testCase
                 * @method copy
                 * @description Copy the test case. 
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.testCase.copy("case-0", "suite-0");
                 * console.log(sideex.file.testCase.getCasesOrder());
                 * @param {Array<string>} [srcCaseIdStrings = selectedCasesId] - Id of the source test case where the test case will be cut. [selectedCasesId]{@link SideeX#file.testCase.selectedCasesId}
                 * @param {string} [dstSuiteIdString = selectedSuiteId] - Id of the destination test suite where the test case will be pasted. [selectedSuiteId]{@link SideeX#file.testCase.selectedSuiteId}
                 */
                copy: function (srcCaseIdTexts = self.root.fileController.getSelectedCases(),
                    dstSuiteIdText = self.root.fileController.getSelectedSuites()[0]) {
                    if (self.root.fileController.isSuiteExist(dstSuiteIdText)) {
                        self.root.fileController.copyCases(srcCaseIdTexts, dstSuiteIdText);
                    } else {
                        throw new Error(`Suite "${dstSuiteIdText}" not found.`);
                    }
                },
                /**
                 * @memberof SideeX#file.testCase
                 * @method cut
                 * @description Cuts a command from a test case and paste onto another test case.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.testCase.cut("case-0", "suite-0");
                 * console.log(sideex.file.testCase.getCasesOrder());
                 * @param {Array<string>} [srcCaseIdStrings = selectedCasesId] - Id of the source test case where the test case will be cut. [selectedCasesId]{@link SideeX#file.testCase.selectedCasesId}
                 * @param {string} [dstSuiteIdString = selectedSuiteId] - Id of the destination test suite where the test case will be pasted. [selectedSuiteId]{@link SideeX#file.testCase.selectedSuiteId}
                 */
                cut: function (srcCaseIdTexts = self.root.fileController.getSelectedCases()[0],
                    dstSuiteIdText = self.root.fileController.getSelectedSuites()[0]) {
                    if (self.root.fileController.isSuiteExist(dstSuiteIdText)) {
                        self.root.fileController.cutCases(srcCaseIdTexts, dstSuiteIdText);
                    } else {
                        throw new Error(`Suite "${dstSuiteIdText}" not found.`);
                    }
                },
                /**
                 * @memberof SideeX#file.testCase
                 * @method remove
                 * @description Removes a test case.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.testCase.add();
                 * sideex.file.testCase.remove("case-0");
                 * console.log(sideex.file.testCase.getCasesOrder());
                 * @param {string} caseIdString - Id of the test case. [caseIdString]{@link SideeX#file.testCase.caseIdString}
                 */
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
                /**
                 * @memberof SideeX#file.testCase
                 * @method getCasesOrder
                 * @description Gets the test cases' order.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.testCase.add();
                 * console.log(sideex.file.testCase.getCasesOrder());
                 * @returns {Array<string>} caseIdStrings - Id of the test cases. [caseIdStrings]{@link SideeX#file.testCase.caseIdStrings}
                 */
                getCasesOrder: function () {
                    return self.root.fileController.testCase.cases;
                },
                // checkCasesLength: function () {
                //     return self.root.fileController.testCase.count;
                // },
                /**
                 * @memberof SideeX#file.testCase
                 * @method setSelected
                 * @description Changes the selected test cases.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.testCase.setSelected("case-0");
                 * console.log(sideex.file.testCase.getSelected());
                 * @param {Array<string>} caseIdStrings - Id of the test cases. [caseIdStrings]{@link SideeX#file.testCase.caseIdStrings}
                 */
                setSelected: function (caseIdTexts) {
                    self.root.fileController.setSelectedCases(caseIdTexts);
                },
                /**
                 * @memberof SideeX#file.testCase
                 * @method getSelected
                 * @description Gets the currently selected commands.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.testCase.setSelected("case-0");
                 * console.log(sideex.file.testCase.getSelected());
                 * @returns {Array<string>} caseIdStrings - Id of the test cases. [caseIdStrings]{@link SideeX#file.testCase.caseIdStrings}
                 */
                getSelected: function () {
                    return self.root.fileController.getSelectedCases();
                }
            },
            /**
             * @namespace
             */
            command: {
                 /**
                 * commandData
                 * - Details of the command
                 * @memberof SideeX#file.command
                 * @typedef {object} commandData
                 * @property {string} commandData.id - Id of the command
                 * @property {string} commandData.name - Name of the command
                 * @property {object} commandData.target - Target of the command
                 * @property {number} commandData.target.usedIndex - Index of the locator that is currently being used
                 * @property {} commandData.target.options - Locators of target
                 * @property {object} commandData.value - Value of the command
                 * @property {number} commandData.value.usedIndex - Index of the locator that is currently being used
                 * @property {} commandData.value.options - Locators of value
                 * @property {string} commandData.screenshot - Screenshot of the command
                 * @property {boolean} commandData.breakpoint - If a breakpoint exists in the command
                 * @property {string} commandData.status - Status of the command
                 */

                /**
                 * selectedCaseId 
                 * - The test case id that is currently selected
                 * @memberof SideeX#file.command
                 * @typedef {string} selectedCaseId
                 */

                /**
                 * selectedCommandIndex
                 * - The command index that is currently selected
                 * @memberof SideeX#file.command
                 * @typedef {string} selectedCommandIndex
                 */

                /**
                 * lastCommandIndex 
                 * - The last command index in the test case.
                 * @memberof SideeX#file.command
                 * @typedef {number} lastCommandIndex
                 */

                /**
                 * commandIdString
                 * - Id of the command
                 * @memberof SideeX#file.command
                 * @typedef {string} commandIdString
                 */

                /**
                 * commandIdStrings
                 * - Id of the commands
                 * @memberof SideeX#file.command
                 * @typedef {Array<string>} commandIdStrings
                 */
                /**
                 * @memberof SideeX#file.command
                 * @method add
                 * @description Adds a new command to a test case.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * //You need to have a test suite and a test case to add commands.
                 * sideex.file.command.add();
                 * @param {string} [caseIdString = selectedCaseId] - Id of the test case to be added the command. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 * @param {object} [commandData] - Details of the command. [commandData]{@link SideeX#file.command.commandData}
                 */
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
                /**
                 * @memberof SideeX#file.command
                 * @method get
                 * @description Gets the details of a command.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.command.add();
                 * sideex.file.command.add();
                 * sideex.file.command.add();
                 * console.log(sideex.file.command.get(1,"case-0"));
                 * @param {string} commandIndex - Index of the command. [commandIndex]{@link SideeX#file.command.commandIndex}
                 * @param {string} [caseIdString = selectedCaseId] - Id of the test case. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 * @returns {object} commandData - Details of the command. [commandData]{@link SideeX#file.command.commandData}
                 */
                get: function (recordIndex, caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    return self.root.fileController.getRecord(caseIdText, recordIndex);
                },
                /**
                 * @memberof SideeX#file.command
                 * @method delete
                 * @description Deletes a command.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.command.add();
                 * sideex.file.command.add();
                 * sideex.file.command.add();
                 * sideex.file.command.delete(1,"case-0");
                 * console.log(sideex.file.testCase.getCasesOrder());
                 * @param {string} commandIndex - Index of the command to be deleted. [commandIndex]{@link SideeX#file.command.commandIndex}
                 * @param {string} [caseIdString = selectedCaseId] - Id of the test case. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 */
                delete: function (recordIndex, caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    self.root.fileController.deleteRecord(caseIdText, recordIndex);
                },
                /**
                 * @memberof SideeX#file.command
                 * @method deleteAll
                 * @description Deletes all the commands in a test case.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.command.add();
                 * sideex.file.command.add();
                 * sideex.file.command.add();
                 * sideex.file.command.deleteAll("case-0");
                 * console.log(sideex.file.testCase.getCasesOrder());
                 * @param {string} [caseIdString = selectedCaseId] - Id of the test case. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 */
                deleteAll: function (caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    self.root.fileController.deleteAllRecords(caseIdText);
                },
                /**
                 * @memberof SideeX#file.command
                 * @method copy
                 * @description Copies a command from a test case to another test case.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.command.add();
                 * sideex.file.command.add();
                 * sideex.file.command.add();
                 * sideex.file.command.copy("case-0", 1, "case-0", 3);
                 * console.log(sideex.file.testCase.getCasesOrder());
                 * @param {string} [srcCaseIdString = selectedCaseId] - Id of the source test case where the command will be copied. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 * @param {number} [srcCommandIndex = selectedCommandIndex] - Index of the source command to be copied. [selectedCommandIndex]{@link SideeX#file.command.selectedCommandIndex}
                 * @param {string} [destCaseIdString = selectedCaseId] - Id of the destination test case where the command will be pasted. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 * @param {number} [destCommandIndex = lastCommandIndex] - Index for where the command will be pasted. [lastCommandIndex]{@link SideeX#file.command.lastCommandIndex}
                 */
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
                /**
                 * @memberof SideeX#file.command
                 * @method cut
                 * @description Cuts a command from a test case and paste onto another test case.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.command.add();
                 * sideex.file.command.add();
                 * sideex.file.command.add();
                 * sideex.file.command.cut("case-0", 1, "case-0", 2);
                 * console.log(sideex.file.testCase.getCasesOrder());
                 * @param {string} [srcCaseIdString = selectedCaseId] - Id of the source test case where the command will be cut. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 * @param {number} [srcCommandIndex = selectedCommandIndex] - Index of the source command to be cut. [selectedCommandIndex]{@link SideeX#file.command.selectedCommandIndex}
                 * @param {string} [destCaseIdString = selectedCaseId] - Id of the destination test case where the command will be pasted. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 * @param {number} [destCommandIndex = lastCommandIndex] - Index for where the command will be pasted [lastCommandIndex]{@link SideeX#file.command.lastCommandIndex}
                 */
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
                /**
                 * @memberof SideeX#file.command
                 * @method setBreakpoint
                 * @description Sets a breakpoint to a command.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testCase.add();
                 * sideex.file.command.add();
                 * sideex.file.command.setBreakpoint(true, 0, "case-0");
                 * console.log(sideex.file.command.getBreakpoint(0, "case-0"));
                 * @param {boolean} bool - Boolean of breakpoint
                 * @param {string} [caseIdString = selectedCaseId] - Id of the test case. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 * @param {number} [commandIndex = selectedCommandIndex] - Index of the command. [selectedCommandIndex]{@link SideeX#file.command.selectedCommandIndex}
                 */
                setBreakpoint: function (bool,
                    recordIndex = self.root.fileController.getSelectedRecord()[self.root.fileController.getSelectedRecord().length - 1],
                    caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    let record = self.root.fileController.getRecord(caseIdText, recordIndex);
                    record.breakpoint = bool;
                },
                /**
                 * @memberof SideeX#file.command
                 * @method getBreakpoint
                 * @description Gets the breakpoint status of a command.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.command.add();
                 * sideex.file.command.setBreakpoint(true, 0, "case-0");
                 * console.log(sideex.file.command.getBreakpoint(0, "case-0"));
                 * @param {number} commandIndex - Index of the command
                 * @param {string} [caseIdString = selectedCaseId] - Id of the test case. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 * @returns {boolean} commandData.breakpoint - If a breakpoint exists in the command. [commandData]{@link SideeX#file.command.commandData}
                 */
                getBreakpoint: function (recordIndex, caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    let record = self.root.fileController.getRecord(caseIdText, recordIndex);
                    return record.breakpoint;
                },
                /**
                 * @memberof SideeX#file.command
                 * @method changeUsedIndex
                 * @description Changes the index of the locator to select another target or value.
                 * @param {number} usedIndex - Index of the locator that is currently being used
                 * @param {"target" | "value"} type -The type to be changed
                 * @param {number} [commandIndex = selectedCommandIndex] - Index of the command. [selectedCommandIndex]{@link SideeX#file.command.selectedCommandIndex}
                 * @param {string} [caseIdString = selectedCaseId] - Id of the test case. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 */
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
                /**
                 * @memberof SideeX#file.command
                 * @method clearStatus
                 * @description Clears all command status in a test case.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.command.add();
                 * sideex.file.command.clearStatus();
                 * @param {string} [caseIdString = selectedCaseId] - Id of the test case. [selectedCaseId]{@link SideeX#file.command.selectedCaseId}
                 */
                clearStatus: function (caseIdText = self.root.fileController.getSelectedCases()[0]) {
                    let records = self.root.fileController.getRecords(caseIdText);
                    self.root.fileController.clearIncludedRecords(records);
                    self.root.fileController.clearRecordsStatus(["status", "snapshot"], records, true);
                },
                /**
                 * @memberof SideeX#file.command
                 * @method clearAllStatus
                 * @description Clears all command status.
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.command.add();
                 * sideex.file.command.clearAllStatus();
                 */
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
                /**
                 * @memberof SideeX#file.command
                 * @method setSelected
                 * @description Sets a command to the currently selected commands
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX(); 
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.command.add();
                 * sideex.file.command.setSelected("command-0");
                 * console.log(sideex.file.command.getSelected());
                 * @param {Array<string>} commandIdStrings - Id of the commands. [commandIdStrings]{@link SideeX#file.command.commandIdStrings}
                 */
                setSelected: function (recordIdTexts) {
                    self.root.fileController.setSelectedRecords(recordIdTexts);
                },
                /**
                 * @memberof SideeX#file.command
                 * @method getSelected
                 * @description Gets the currently selected commands
                 * @example
                 * import {SideeX} from "sideex-api"
                 * var sideex = new SideeX();
                 * sideex.file.testSuite.add();
                 * sideex.file.testCase.add();
                 * sideex.file.command.add();
                 * sideex.file.command.setSelected("command");
                 * console.log(sideex.file.command.getSelected());
                 * @returns {Array<string>} commandIdStrings - Id of the commands. [commandIdStrings]{@link SideeX#file.command.commandIdStrings}
                 */
                getSelected: function () {
                    return self.root.fileController.getSelectedRecords();
                }
            }
        };
        /**
         * @namespace
         */
        this.variables = {
            /**
             * varIdString 
             * - Id of the variable.
             * @memberof SideeX#variables
             * @typedef {string} varIdString
             */

             
            /**
             * vars
             * - All of the variables.
             * @memberof SideeX#variables
             * @typedef {object} vars
             * @property {object} vars.variableData - Variable's data
             * @property {index} vars.variableData.index - Variable's index
             * @property {string} vars.variableData.name - Variable's name
             * @property {*} vars.variableData.value - Variable's value
             */


            /**
             * count
             * - The count of variables.
             * @memberof SideeX#variables
             * @typedef {number} count
             */


            /**
             * varNames 
             * - The name of all variables.
             * @memberof SideeX#variables
             * @typedef {object} varNames
             * @property {Array<boolean>} varNames.name - Whether the name has been used before
             */


            /**
             * startNum
             * - The next variable's starting number.
             * @memberof SideeX#variables
             * @typedef {number} startNum
             */


            /**
             * @memberof SideeX#variables
             * @method add
             * @description Adds a variable.
             * @param {string} name - Name of the variable
             * @param {*} value - Value of the variable
             * @returns {string} varIdString - Id of the variable. [varIdString]{@link SideeX#variables.varIdString}
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * console.log(sideex.variables.add("var-0", "hello"));
             * console.log(sideex.variables.get("vars"));
             */
            add: (name, value) => {
                return self.root.variables.addVariable(name, value);
            },
            /**
             * @memberof SideeX#variables
             * @method get
             * @description Gets the variables’ details.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.variables.add();
             * sideex.variables.add();
             * sideex.variables.add();
             * console.log(sideex.variables.get("vars"));
             * console.log(sideex.variables.get("count"));
             * console.log(sideex.variables.get("startNum"));
             * console.log(sideex.variables.get("varNames"));
             * @param {"count" | "startNum" | "varNames" | "vars"} [target = "vars"] - The target to get the result
             * @returns {number | object} count | vars | varNames | startNum. [count]{@link SideeX#variables.count} [vars]{@link SideeX#variables.vars} [varNames]{@link SideeX#variables.varNames} [startNum]{@link SideeX#variables.startNum}
             */
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
            /**
             * @memberof SideeX#variables
             * @method delete
             * @description Deletes a variable by id.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.variables.add();
             * console.log(sideex.variables.get("vars"));
             * console.log(sideex.variables.delete("var-0"));
             * console.log(sideex.variables.get("vars"));
             * @param {string} varIdString - Id of the variable. [varIdString]{@link SideeX#variables.varIdString}
             * @returns {string} varIdString - Id of the variable. [varIdString]{@link SideeX#variables.varIdString}
             */
            delete: (varIdText) => {
                self.root.variables.deleteVariable(varIdText);
                return varIdText;
            },
            /**
             * @memberof SideeX#variables
             * @method clearAll
             * @description Deletes all variables.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.variables.add();
             * sideex.variables.add();
             * sideex.variables.add();
             * console.log(sideex.variables.get("vars"));
             * sideex.variables.clearAll();
             * console.log(sideex.variables.get("vars"));
             */
            clearAll: () => {
                self.root.variables.clearVariables();
            },
            /**
             * @memberof SideeX#variables
             * @method changeName
             * @description Changes the name of a variable.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.variables.add("var-0", "hello");
             * console.log(sideex.variables.changeName("var-0", "var-1"));
             * console.log(sideex.variables.get("vars"));
             * @param {string} varIdString - Id of the variable. [varIdString]{@link SideeX#variables.varIdString}
             * @param {string} name - New name of the variable
             * @returns {object} {varIdString, name}. [varIdString]{@link SideeX#variables.varIdString}
             */
            changeName: (varIdText, name) => {
                if (varIdText)
                    self.root.variables.updateVarName(varIdText, name);
                return { varIdText, name };
            },
            /**
             * @memberof SideeX#variables
             * @method changeValue
             * @description Changes the value of a variable.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.variables.add("var-0", "hello");
             * console.log(sideex.variables.changeValue("var-0", "hi"));
             * console.log(sideex.variables.get("vars"));
             * @param {string} varIdString - Id of the variable. [varIdString]{@link SideeX#variables.varIdString}
             * @param {string} value - New value of the variable
             * @returns {object} {varIdString, value}. [varIdString]{@link SideeX#variables.varIdString}
             */
            changeValue: (varIdText, value) => {
                if (varIdText)
                    self.root.variables.updateVarValue(varIdText, value);
                return { varIdText, value };
            }
        };
        /**
         * @namespace
         */
        this.log = {
            /**
            * logs 
            * - All Logs.
            * @memberof SideeX#log
            * @typedef {object} logs
            * @property {string} logs.type - Log type
            * @property {string} logs.message - Log message
            */
            /**
             * logTypeMap 
             * - Log of XXX type.
             * @memberof SideeX#log
             * @typedef {Array<string>} logTypeMap
             * @property {Array} logTypeMap.debug - Debug type
             * @property {Array} logTypeMap.info - Info type
             * @property {Array} logTypeMap.error - Error type
             * @property {Array} logTypeMap.warn - Warning type
             */
            /**
             * @memberof SideeX#log
             * @method get
             * @description Gets logs.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * console.log(sideex.log.get("logs"));
             * console.log(sideex.log.get("typeMap"));
             * @param {"logs" | "typeMap"} target - Two kinds of logs to get, "logs":logs,"typeMap":logTypeMap
             * @returns {object} logs | logTypeMap. [logs]{@link SideeX#log.logs} [logTypeMap]{@link SideeX#log.logTypeMap}
             */
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
            /**
             * @memberof SideeX#log
             * @method clear
             * @description Deletes all logs.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * console.log(sideex.log.clear());
             * @returns {object} logs. [logs]{@link SideeX#log.logs}
             */
            clear: () => {
                self.root.fileController.clearLog();
                self.root.log.clearLog();
                return self.root.log.logs;
            }
        };
        /**
         * @namespace
         */
        this.recorder = {
            /**
             * selectedCaseId 
             * - The test case id that is currently selected.
             * @memberof SideeX#recorder
             * @typedef {string} selectedCaseId
             */
            /**
             * @memberof SideeX#recorder
             * @method start
             * @description Starts recording a test case.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.recorder.start();
             * sideex.recorder.stop();
             * @param {string} [caseIdString = selectedCaseId] - Id of the test case. [selectedCaseId]{@link SideeX#recorder.selectedCaseId}
             */
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
            /**
             * @memberof SideeX#recorder
             * @method stop
             * @description Stops recording.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.recorder.start();
             * sideex.recorder.stop();
             */
            stop: () => {
                self.root.recorder.detach();
                self.root.recorder.isRecord = false;
            }
        };
        /**
         * @namespace
         */
        this.setting = {
            /**
             * speed 
             * - The playback speed (1 ~ 5)
             * @memberof SideeX#setting
             * @typedef {number} speed
             */
            /**
             * @memberof SideeX#setting
             * @method setSpeed
             * @description Sets the playback speed (1 ~ 5).
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.setting.setSpeed(3);
             * console.log(sideex.setting.getSpeed());
             * @param {number} value - The setting value (1 ~ 5)
             * @returns {number} value - The setting value (1 ~ 5)
             */
            setSpeed: (value) => {
                if (value < 0 || value > 5) {
                    return this.root.log.pushLog('error', 'speed should be set from range 1 to 5');
                } else {
                    self.root.setting.set({ delay: 500 * (5 - value) });
                    return value;
                }
            },
            /**
             * @memberof SideeX#setting
             * @method getSpeed
             * @description Gets the playback speed.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.setting.setSpeed(3);
             * console.log(sideex.setting.getSpeed());
             * @returns {number} speed - The playback speed (1 ~ 5). [speed]{@link SideeX#setting.speed}
             */
            getSpeed: () => {
                let speed = 5 - (self.root.setting.params.delay / 500);
                return speed;
            }
        };
        /**
         * @namespace
         */
        this.playback = {
            /**
             * selectedCaseId 
             * - The test case id that is currently selected.
             * @memberof SideeX#playback
             * @typedef {string} selectedCaseId
             */
            /**
             * selectedSuiteId 
             * - The test suite id that is currently selected.
             * @memberof SideeX#playback
             * @typedef {string} selectedSuiteId
             */
            /**
             * The function of your own command - declare by yourself.
             * @memberof SideeX#playback
             * @typedef {Function} commandFunction
             * @param {string} target - The command's target
             * @param {string} value - The command's value
             */
            commandFunction(target, value){
                
            },

             /**
             * @memberof SideeX#playback
             * @method start
             * @description Starts playback.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * //you should have some test cases or commands first.
             * //choose a mode to do playback.
             * sideex.playback.start("all");//play all test suites.
             * sideex.playback.start("suite");//play the test suite you selected.
             * sideex.playback.start("case");//play the test case you selected.
             * sideex.playback.stop();
             * @param {"all" | "suite" | "case"} [mode = "all"] - The mode to play -- (mode == "all"): Play all the test suites, (mode == "suite"): Play the selected test suite, (mode == "case"): Play the selected test case.
             * @param {string} [idString = selectedCaseId | selectedSuiteId] - (mode == "all"): test case's id, (mode == "suite"): test suite's id, (mode == "case"): test case's id. [selectedSuiteId]{@link SideeX#playback.selectedSuiteId} [selectedCaseId]{@link SideeX#playback.selectedCaseId}
             * @param {number} [speed] - The playback speed (1 ~ 5)
             */
            start: (mode = "all", idText = undefined, speed) => {
                if(speed){
                   self.setting.setSpeed(speed); 
                }
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
            /**
             * @memberof SideeX#playback
             * @method stop
             * @description Stops playback.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.playback.start();
             * sideex.playback.stop();
             */
            stop: () => {
                self.root.playback.stop();
                self.root.playback.isPlay = false;
            },
            /**
             * @memberof SideeX#playback
             * @method pause
             * @description Pauses playback.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.playback.start();
             * sideex.playback.pause();
             * sideex.playback.resume();
             */
            pause: () => {
                self.root.playback.pause();
                self.root.playback.isPlay = false;
                self.root.playback.isPause = true;
            },
            /**
             * @memberof SideeX#playback
             * @method resume
             * @description Resumes playback.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.playback.start();
             * sideex.playback.pause();
             * sideex.playback.resume();
             */
            resume: () => {
                self.root.playback.resume();
                self.root.playback.isPlay = true;
                self.root.playback.isPause = false;
            },
            /**
             * @memberof SideeX#playback
             * @method addCustomCommand
             * @description Adds a customed command declared by users.
             * @example
             * import {SideeX} from "sideex-api"
             * var sideex = new SideeX();
             * sideex.recorder.start();//start recording
             * 
             * //Record a command
             * //For example: click at anywhere on the window,
             * //then you get a ClickAt command 
             * 
             * sideex.recorder.stop();//stop recording
             * console.log(sideex.file.command.get(0));//get the first recorded command
             * let command = sideex.file.command.get(0);
             * command.name = "myAction";//rename the command name to "myAction"
             * console.log(sideex.file.command.get(0));//see the change of the command name
             * //add a user-defined function for executing "myAction"
             * sideex.playback.addCustomCommand("myAction", true, (target, value) => {
             *      console.log(target, value);
             *      //define the action here
             *      }
             * );
             * sideex.playback.start();//replay the modified recorded commands
             * @param {string} target - The command's target
             * @param {string} value - The command's value
             * @param {Function} commandFunction - The function that tells command what to do. [commandFunction]{@link SideeX#playback.commandFunction}
             */
            addCustomCommand: (cmdName, verifyLocator = true, commandFunction) => {
                let isDoSnapshot = true;
                let type = {record: "mouse", playback: "content"};
                let isManual = false;
                let reference = {name: cmdName, target: "A locator", value: "", description: ""};
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
            /**
             * @memberof SideeX#playback
             * @method findElement
             * @description Finds an element by a supported locator.
             * @param {string} locator - Locator of the element
             * @returns {Element} Element object
             */
            findElement: (locator) => {
                // console.log(locator)
                // console.log(self.root.playback.sideex.browserBot.findElement(locator));
                return (self.root.playback.sideex.browserBot.findElement(locator));
            },
            /**
             * @memberof SideeX#playback
             * @method getClientXY
             * @description Gets the element location.
             * @param {Element} element - Element object
             * @param {string} coordString - CoordString
             * @returns {Array<number>} Element's X, Y
             */
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
