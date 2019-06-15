import { consoleState, fileListState, footerState, toolBarState, workAreaState } from "./state.template";

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
            if (!(key in Panel.setting)) {
                console.error(`key "${key}" is not in settings`);
            }
            Panel.setting[key] = obj[key];
        }

        if (this.isDomBased) {
            this.syncStorage(obj);
        }
    },
    get(key) {
        if (key in Panel.setting) {
            return Panel.setting[key];
        }
        return undefined;
    }
}

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
                Panel.uiTools.selectForeRecord();
                break;
            case 40: // down arrow
                Panel.uiTools.selectNextRecord();
                break;
            case 46: { // del
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
                    for (let record of records) {
                        temp.push(record.id);
                    }
                    Panel.fileController.setSelectedRecords(temp);
                    break;
                }
                case 66: // Ctrl + T
                    Panel.fileController.toggleRecordBreakpoint(
                        Panel.fileController.getSelectedCases()[0],
                        parseInt(Panel.fileController.getSelectedRecord().split("-")[1])
                    );
                    break;
                case 67: // Ctrl + C
                    Panel.fileController.copyCommands();
                    break;
                case 73: // Ctrl + I
                    Panel.fileController.insertCommand("after", "",
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
            if (Panel.fileController.saveFile.textFile !== null) {
                window.URL.revokeObjectURL(Panel.fileController.saveFile.textFile);
            }
            Panel.fileController.saveFile.textFile = window.URL.createObjectURL(data);
            return Panel.fileController.saveFile.textFile;
        }
    },
    addTestSuite: () => {
        let count = ++Panel.fileController.testSuite.count;
        Panel.fileController.testSuite.suites[`suite-${count}`] = { ...Panel.fileController.testSuite.suites[`suite-0`] };
    },
    addTestCase: () => {
        let count = ++Panel.fileController.testCase.count;
        let selectedSuiteIdText = Panel.fileController.selectedSuiteIdTexts[0];
        Panel.fileController.testSuite.suites[selectedSuiteIdText].cases.push(`case-${count}`);
        Panel.fileController.testCase.cases[`case-${count}`] = { ...Panel.fileController.testCase.cases[`case-0`] };
    },
    setSelectedSuites: () => { Panel.fileController.selectedSuiteIdTexts = ["suite-0"]; },
    setSelectedCases: () => { Panel.fileController.selectedCaseIdTexts = ["case-0"]; },
    setSelectedRecords: (idTexts) => { Panel.fileController.selectedRecordIdTexts = idTexts; },
    getSelectedSuites: () => { return ["suite-0"]; },
    getSelectedCases: () => { return ["case-0"]; },
    getSelectedRecords: () => { return Panel.fileController.selectedRecordIdTexts; },
    getSelectedRecord: () => { return "records-0"; },
    getRecord: (caseIdText, index) => { return Panel.fileController.testCase.cases[caseIdText].records[index]; },
    getScreenshotVideo: () => { return "123"; },
    getSuiteTitle(suiteIdText) { return Panel.fileController.testSuite.suites[suiteIdText].title; },
    getCaseTitle: (caseIdText) => { return Panel.fileController.testCase.cases[caseIdText].title; },
    isFileNameOpened: () => { return false; },
    isSuiteNameUsed: () => { return false; },
    isCaseNameUsed: () => { return false; },
    getSuiteKey: (suiteName) => { return "suite-0"; },
    getCaseKey: (suiteIdText, caseName) => { return "case-1"; },
    deleteRecord: () => {},
    deleteAllRecords: () => {},
    addCommand: () => {
        Panel.fileController.testCase.cases["case-0"].records.push(Panel.fileController.testCase.cases["case-0"].records[0]);
    },
    insertCommand: () => {},
    addCommandAt: () => {},
    addCommandBeforeLastCommand: () => {},
    toggleRecordBreakpoint: (caseIdText, index) => {
        Panel.fileController.testCase.cases[caseIdText].records[index].breakpoint =
            !Panel.fileController.testCase.cases[caseIdText].records[index].breakpoint;
    },
    copyCommands: () => {},
    cutCommands: () => {},
    pasteCommands: () => {},
    setRecordName: (caseIdText, index, name) => { Panel.fileController.testCase.cases[caseIdText].records[index].name = name; },
    setCaseModified: (caseIdText, modified) => { Panel.fileController.testCase.cases[caseIdText].modified = modified; },
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
        Panel.fileController.testCase.cases[caseIdText].records[index][type].usedIndex = usedIndex;
    }
};
export var variables = {
    ...consoleState.variables,
    isVarExisted: (name) => {
        if (Panel.variables.globalVars.varNames[name]) {
            return true;
        }
        return false;
    },
    getVarNum: () => {
        return Panel.variables.globalVars.count;
    },
    readImportFile: (file, type) => {
        var reader = new FileReader();
        reader.onerror = function(error) {
            console.log(error);
        };

        reader.onload = function(event) {
            var variables;
            if (type == "csv") {
                variables = Panel.fileController.loadFile.csvParser(event.target.result);
            } else if (type == "json") {
                variables = Panel.fileController.loadFile.jsonParser(event.target.result);
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
        Panel.variables.globalVars.count++;
        let index = Panel.variables.globalVars.startNum++;
        let varIdText = `var-${index}`;
        Panel.variables.globalVars.vars[varIdText] = {
            index: index,
            name: "",
            value: ""
        };
        return varIdText;
    },
    updateVarName: (varIdText, name) => {
        if (Panel.variables.isVarExisted(name)) {
            Panel.log.pushLog("error", "The variable is existed");
        }
        let lastName = Panel.variables.globalVars.vars[varIdText].name;
        delete Panel.variables.globalVars.varNames[lastName];
        Panel.variables.globalVars.varNames[name] = true;
        Panel.variables.globalVars.vars[varIdText].name = name;
    },
    updateVarValue: (varIdText, value) => {
        Panel.variables.globalVars.vars[varIdText].value = value;
    },
    deleteVariable: (varIdText) => {
        Panel.variables.globalVars.count--;
        let name = Panel.variables.globalVars.vars[varIdText].name;
        if (name !== "") {
            delete Panel.variables.globalVars.varNames[name];
        }
        delete Panel.variables.globalVars.vars[varIdText];
    },
    clearVariables: () => {
        Panel.variables.globalVars = {
            count: 0,
            startNum: 0,
            varNames: {},
            vars: {}
        };
    }
};

