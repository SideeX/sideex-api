import { browser } from "webextension-polyfill-ts";
export class VariableController {
    constructor() {
        this.keyBoard = ["KEY_ENTER", "KEY_DOWN", "KEY_UP", "KEY_LEFT", "KEY_RIGHT"];
        this.globalVars = {
            count: 0,
            startNum: 0,
            varNames: {},
            vars: {}
        };
        this.localVars = {
            count: 0,
            startNum: 0,
            varNames: {},
            vars: {}
        };
    }

    initLocalVars() {
        this.localVars = Object.assign({}, this.globalVars);
    }

    makeCSVText() {
        let text = "";
        for (let key in Panel.variables.globalVars.vars) {
            let varObj = Panel.variables.globalVars.vars[key];
            text += `${varObj.name}, ${varObj.value},\n`;
        }

        return text;
    }

    makeJSONText() {
        let temp = {};
        for (let varObjKey in Panel.variables.globalVars.vars) {
            let varObj = Panel.variables.globalVars.vars[varObjKey];
            temp[varObj.name] = varObj.value;
        }
        return JSON.stringify(temp, null, "  ");
    }

    isVarExisted(name) {
        if (Panel.variables.globalVars.varNames[name]) {
            return true;
        }
        return false;
    }

    getVarNum() {
        return Panel.variables.globalVars.count;
    }

    addVariable(name = "", value = "") {
        Panel.variables.globalVars.count++;
        let index = Panel.variables.globalVars.startNum++;
        let varIdText = `var-${index}`;
        if (name !== "") Panel.variables.globalVars.varNames[name] = true;
        Panel.variables.globalVars[name] = value;
        Panel.variables.globalVars.vars[varIdText] = {
            index: index,
            name: name,
            value: value
        };
        return varIdText;
    }

    updateVarName(varIdText, name) {
        if (Panel.variables.isVarExisted(name)) {
            Panel.log.pushLog("error", "The variable is existed");
        }
        let lastName = Panel.variables.globalVars.vars[varIdText].name;
        delete Panel.variables.globalVars.varNames[lastName];
        Panel.variables.globalVars.varNames[name] = true;
        Panel.variables.globalVars.vars[varIdText].name = name;
    }

    updateVarValue(varIdText, value) {
        Panel.variables.globalVars.vars[varIdText].value = value;
    }

    deleteVariable(varIdText) {
        Panel.variables.globalVars.count--;
        let name = Panel.variables.globalVars.vars[varIdText].name;
        if (name !== "") {
            delete Panel.variables.globalVars.varNames[name];
        }
        delete Panel.variables.globalVars.vars[varIdText];
    }

    clearVariables() {
        Panel.variables.globalVars = {
            count: 0,
            startNum: 0,
            varNames: {},
            vars: {}
        };
    }

    clearLocalVars() {
        this.localVars = {};
    }

    /**
     * Read file of variable
     * @param {FILE Object} file - input for reading file.
     * @param {String} type - input file type, e.g. "csv", "json"
     */
    readImportFile(file, type) {
        var reader = new FileReader();
        reader.onerror = function(error) {
            console.log(error);
        };

        reader.onload = function(event) {
            let variables;
            if (type === "csv") {
                variables = Panel.variables.csvParser(event.target.result);
            } else if (type === "json") {
                variables = Panel.variables.jsonParser(event.target.result);
            } else {
                Panel.log.pushLog("error", "Error on file type");
                return;
            }

            for (let variable of variables) {
                if (Panel.variables.globalVars.varNames[variable[0]]) {
                    Panel.log.pushLog("warn", "Duplicated variables");
                } else {
                    Panel.variables.addVariable(variable[0], variable[1]);
                }
            }
            EntryPoint.console.syncVariable();
        };

        reader.readAsText(file);
    }

    exportVariables(type) {
        let text = "";
        switch (type) {
            case "json":
                text = Panel.variables.makeJSONText();
                break;
            case "csv":
                text = Panel.variables.makeCSVText();
                break;
        }
        let downloading = browser.downloads.download({
            filename: `Global Variables.${type}`,
            url: Panel.fileController.saveFile.makeTextFile(text),
            saveAs: true,
            conflictAction: 'overwrite'
        });
    }

    csvParser(str) {
        let variables = [];
        str = str.replace(/\r/g, "");
        str = str.replace(/,\n/g, ",");
        str = str.replace(/\n/g, ",");
        let temp = str.split(",");
        for (let i = 0; i < temp.length; i += 2) {
            if (temp[i] !== "" && temp[i + 1] !== "") {
                variables.push([temp[i], temp[i + 1]]);
            }
        }
        return variables;
    }

    jsonParser(str) {
        let variables = [];
        let temp = JSON.parse(str);
        for (let key in temp) {
            variables.push([key, typeof temp[key] === "object" ?
                JSON.stringify(temp[key]) : temp[key]]);
        }
        return variables;
    }

    isKeyBoardVars(str) {
        for (let i = 0; i < this.keyBoard.length; i++) {
            if (str === `\${${this.keyBoard[i]}}`) {
                return true;
            }
        }
        return false;
    }
}
