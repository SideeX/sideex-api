import { consoleState, fileListState, footerState, toolBarState, workAreaState } from "./state.template";
import { root } from "../background/initial";
export var setting = {
    params: {
        // basic
        delay: 0,
        networkSpeed: -1,
        theme: 0, // it should be constant

        // periodical
        isPeriodical: false,
        period: 0.1
    },
    set(obj) {
        for (let key in obj) {
            if (!(key in root.setting)) {
                console.error(`key "${key}" is not in settings`);
            }
            root.setting[key] = obj[key];
        }

        if (root.isDOMBased) {
            this.syncStorage(obj);
        }
    },
    get(key) {
        if (key in root.setting) {
            return root.setting[key];
        }
        return undefined;
    }
};

export var recorder = {
    isRecord: false,
    prepareRecord: () => {},
    attach: () => {},
    detach: () => {}
};
export var uiTools = {
    stopNativeEvent(event) {
        // NOTE: lock the browser default shortcuts
        // and this should be careful
        event.preventDefault();
        event.stopPropagation();
    },
    getResourceURL(name) {
        return `panel/icon/${name}`;
    },
    processShortCut(event, keyNum, ctrlKey, shiftKey) {
        // console.log(event, keyNum, ctrlKey, shiftKey);
        // Hot keys
        switch (keyNum) {
            case 38: // up arrow
                root.uiTools.selectForeRecord();
                break;
            case 40: // down arrow
                root.uiTools.selectNextRecord();
                break;
            case 46: { // del
                break;
            }
        }

        // Hot keys: Ctrl + [KEY]
        if (ctrlKey) {
            // if (!root.uiTools.isOnWorkArea) return;
            root.uiTools.stopNativeEvent(event);
            switch (keyNum) {
                case 65: { // Ctrl + A
                    let temp = [];
                    let records = root.fileController.getRecords(
                        root.fileController.getSelectedCases()[0]
                    );
                    for (let record of records) {
                        temp.push(record.id);
                    }
                    root.fileController.setSelectedRecords(temp);
                    break;
                }
                case 66: // Ctrl + T
                    root.fileController.toggleRecordBreakpoint(
                        root.fileController.getSelectedCases()[0],
                        parseInt(root.fileController.getSelectedRecord().split("-")[1])
                    );
                    break;
                case 67: // Ctrl + C
                    root.fileController.copyCommands();
                    break;
                case 73: // Ctrl + I
                    root.fileController.insertCommand("after", "",
                        { options: [{ type: "other", value: "" }] },
                        { options: [{ type: "other", value: "" }] },
                    );
                    break;
                case 79: // Ctrl + O
                    document.querySelector("#open-files").click();
                    break;
                case 80: // Ctrl + P
                    document.querySelector("#play-button").click();
                    break;
                case 83: { // Ctrl + S
                    let suiteIdText = root.fileController.getSelectedSuites()[0];
                    root.fileController.saveFile.downloadSuites([suiteIdText]);
                    break;
                }
                case 86: // Ctrl + V
                    root.fileController.pasteCommands();
                    break;
                case 88: { // Ctrl + X
                    root.fileController.cutCommands();
                    break;
                }
                default:
                    break;
            }
        }
    }
};
export var playback = {
    ...toolBarState,
    playSpeed: 5,
    doPlay: () => {},
    stop: () => {},
    pause: () => {},
    resume: () => {}
};
export var reference = {};
export var log = {
    ...consoleState,
    pushLog: () => {}
};
export var fileController = {
    ...fileListState,
    ...footerState,
    ...workAreaState,
    loadFile: {
        readSuites: () => {},
        readFile: () => {},
    },
    saveFile: {
        textFile: null,
        downloadSuites: () => {},
        makeTextFile:(text) => {
            var data = new Blob([text], {
                type: 'text/plain'
            });
            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (root.fileController.saveFile.textFile !== null) {
                window.URL.revokeObjectURL(root.fileController.saveFile.textFile);
            }
            root.fileController.saveFile.textFile = window.URL.createObjectURL(data);
            return root.fileController.saveFile.textFile;
        }
    },
    addTestSuite: () => {
        let count = ++root.fileController.testSuite.count;
        root.fileController.testSuite.suites[`suite-${count}`] = { ...root.fileController.testSuite.suites[`suite-0`] };
    },
    addTestCase: () => {
        let count = ++root.fileController.testCase.count;
        let selectedSuiteIdText = root.fileController.selectedSuiteIdTexts[0];
        root.fileController.testSuite.suites[selectedSuiteIdText].cases.push(`case-${count}`);
        root.fileController.testCase.cases[`case-${count}`] = { ...root.fileController.testCase.cases[`case-0`] };
    },
    setSelectedSuites: () => { root.fileController.selectedSuiteIdTexts = ["suite-0"]; },
    setSelectedCases: () => { root.fileController.selectedCaseIdTexts = ["case-0"]; },
    setSelectedRecords: (idTexts) => { root.fileController.selectedRecordIdTexts = idTexts; },
    getSelectedSuites: () => { return ["suite-0"]; },
    getSelectedCases: () => { return ["case-0"]; },
    getSelectedRecords: () => { return root.fileController.selectedRecordIdTexts; },
    getSelectedRecord: () => { return "records-0"; },
    getRecord: (caseIdText, index) => { return root.fileController.testCase.cases[caseIdText].records[index]; },
    getScreenshotVideo: () => { return "123"; },
    getSuiteTitle(suiteIdText) { return root.fileController.testSuite.suites[suiteIdText].title; },
    getCaseTitle: (caseIdText) => { return root.fileController.testCase.cases[caseIdText].title; },
    isFileNameOpened: () => { return false; },
    isSuiteNameUsed: () => { return false; },
    isCaseNameUsed: () => { return false; },
    getSuiteKey: (suiteName) => { return "suite-0"; },
    getCaseKey: (suiteIdText, caseName) => { return "case-1"; },
    deleteRecord: () => {},
    deleteAllRecords: () => {},
    addCommand: () => {
        root.fileController.testCase.cases["case-0"].records.push(root.fileController.testCase.cases["case-0"].records[0]);
    },
    insertCommand: () => {},
    addCommandAt: () => {},
    addCommandBeforeLastCommand: () => {},
    toggleRecordBreakpoint: (caseIdText, index) => {
        root.fileController.testCase.cases[caseIdText].records[index].breakpoint =
            !root.fileController.testCase.cases[caseIdText].records[index].breakpoint;
    },
    copyCommands: () => {},
    cutCommands: () => {},
    pasteCommands: () => {},
    setRecordName: (caseIdText, index, name) => { root.fileController.testCase.cases[caseIdText].records[index].name = name; },
    setCaseModified: (caseIdText, modified) => { root.fileController.testCase.cases[caseIdText].modified = modified; },
    setRecordFirstTarget: (caseIdText, index, target) => {
        let recordTarget = this.testCase.cases[caseIdText].records[index].target;
        let prevTarget = recordTarget.options[0];
        this.testCase.cases[caseIdText].records[index].target.options[0] = {
            ...prevTarget, ...target
        };
    },
    setRecordUsedTarget: (caseIdText, index, target) => {
        let recordTarget = this.testCase.cases[caseIdText].records[index].target;
        let usedIndex = recordTarget.usedIndex, prevTarget = recordTarget.options[usedIndex];
        this.testCase.cases[caseIdText].records[index].target.options[usedIndex] = {
            ...prevTarget, ...target
        };
    },
    setRecordFirstValue: (caseIdText, index, value) => {
        let recordValue = this.testCase.cases[caseIdText].records[index].value;
        let prevValue = recordValue.options[0];
        this.testCase.cases[caseIdText].records[index].value.options[0] = {
            ...prevValue, ...value
        };
    },
    setRecordUsedValue: (caseIdText, index, value) => {
        let recordValue = this.testCase.cases[caseIdText].records[index].value;
        let usedIndex = recordValue.usedIndex, prevValue = recordValue.options[usedIndex];
        this.testCase.cases[caseIdText].records[index].value.options[usedIndex] = {
            ...prevValue, ...value
        };
    },
    setUsedIndex(type, caseIdText, index, usedIndex) {
        root.fileController.testCase.cases[caseIdText].records[index][type].usedIndex = usedIndex;
    }
};
export var variables = {
    ...consoleState.variables,
    isVarExisted: (name) => {
        if (root.variables.globalVars.varNames[name]) {
            return true;
        }
        return false;
    },
    getVarNum: () => {
        return root.variables.globalVars.count;
    },
    readImportFile: (file, type) => {
        var reader = new FileReader();
        reader.onerror = function(error) {
            console.log(error);
        };

        reader.onload = function(event) {
            var variables;
            if (type == "csv") {
                variables = root.fileController.loadFile.csvParser(event.target.result);
            } else if (type == "json") {
                variables = root.fileController.loadFile.jsonParser(event.target.result);
            }

            for (let i = 0; i < variables.length; i++) {
                if (variables.globalVars[variables[i][0]]) {
                    updateVariable(variables[i][0], variables[i][1]);
                } else {
                    addVariable(variables[i][0], variables[i][1]);
                    insertVariable(variables[i][0], variables[i][1]);
                }
            }
        };

        reader.readAsText(file);
    },
    exportVariables: () => {},
    csvParser: (str) => {
        var variables = [];
        str = str.replace(/\r/g, "");
        str = str.replace(/,\n/g, ",");
        str = str.replace(/\n/g, ",");
        var temp = str.split(",");
        for (let i = 0; i < temp.length; i += 2) {
            if (temp[i] != "" && temp[i + 1] != "") {
                variables.push([temp[i], temp[i + 1]]);
            }
        }
        return variables;
    },
    jsonParser: (str) => {
        var variables = [];
        var temp = JSON.parse(str);
        for (let key in temp) {
            variables.push([key, temp[key]]);
        }
        return variables;
    },
    makeCSVText: () => {},
    makeJSONText: () => {},
    addVariable: () => {
        root.variables.globalVars.count++;
        let index = root.variables.globalVars.startNum++;
        let varIdText = `var-${index}`;
        root.variables.globalVars.vars[varIdText] = {
            index: index,
            name: "",
            value: ""
        };
        return varIdText;
    },
    updateVarName: (varIdText, name) => {
        if (root.variables.isVarExisted(name)) {
            root.log.pushLog("error", "The variable is existed");
        }
        let lastName = root.variables.globalVars.vars[varIdText].name;
        delete root.variables.globalVars.varNames[lastName];
        root.variables.globalVars.varNames[name] = true;
        root.variables.globalVars.vars[varIdText].name = name;
    },
    updateVarValue: (varIdText, value) => {
        root.variables.globalVars.vars[varIdText].value = value;
    },
    deleteVariable: (varIdText) => {
        root.variables.globalVars.count--;
        let name = root.variables.globalVars.vars[varIdText].name;
        if (name !== "") {
            delete root.variables.globalVars.varNames[name];
        }
        delete root.variables.globalVars.vars[varIdText];
    },
    clearVariables: () => {
        root.variables.globalVars = {
            count: 0,
            startNum: 0,
            varNames: {},
            vars: {}
        };
    }
};

