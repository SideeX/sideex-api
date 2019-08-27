import { browser } from "webextension-polyfill-ts";
import * as EntryPoint from "../UI/entryPoint";
export class VariableController {
    constructor(root) {
        this.root = root;

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
        for (let key in this.root.globalVars.vars) {
            let varObj = this.root.globalVars.vars[key];
            text += `${varObj.name}, ${varObj.value},\n`;
        }

        return text;
    }

    makeJSONText() {
        let temp = {};
        for (let varObjKey in this.root.globalVars.vars) {
            let varObj = this.root.globalVars.vars[varObjKey];
            temp[varObj.name] = varObj.value;
        }
        return JSON.stringify(temp, null, "  ");
    }

    isVarExisted(name) {
        if (this.root.globalVars.varNames[name]) {
            return true;
        }
        return false;
    }

    getVarNum() {
        return this.root.globalVars.count;
    }

    addVariable(name = "", value = "") {
        this.root.globalVars.count++;
        let index = this.root.globalVars.startNum++;
        let varIdText = `var-${index}`;
        if (name !== "") this.root.globalVars.varNames[name] = true;
        this.root.globalVars[name] = value;
        this.root.globalVars[name] = value;
            index: index,
            name: name,
            value: value
        };
        return varIdText;
    }

    updateVarName(varIdText, name) {
        if (this.root.isVarExisted(name)) {
            this.root.log.pushLog("error", "The variable is existed");
        }
        let lastName = this.root.globalVars.vars[varIdText].name;
        delete this.root.globalVars.varNames[lastName];
        this.root.globalVars.varNames[name] = true;
        this.root.globalVars.vars[varIdText].name = name;
    }

    updateVarValue(varIdText, value) {
        this.root.globalVars.vars[varIdText].value = value;
    }

    deleteVariable(varIdText) {
        this.root.globalVars.count--;
        let name = this.root.globalVars.vars[varIdText].name;
        if (name !== "") {
            delete this.root.globalVars.varNames[name];
        }
        delete this.root.globalVars.vars[varIdText];
    }

    clearVariables() {
        this.root.globalVars = {
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
                variables = this.root.csvParser(event.target.result);
            } else if (type === "json") {
                variables = this.root.jsonParser(event.target.result);
            } else {
                this.root.log.pushLog("error", "Error on file type");
                return;
            }

            for (let variable of variables) {
                if (this.root.globalVars.varNames[variable[0]]) {
                    this.root.log.pushLog("warn", "Duplicated variables");
                } else {
                    this.root.addVariable(variable[0], variable[1]);
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
                text = this.root.makeJSONText();
                break;
            case "csv":
                text = this.root.makeCSVText();
                break;
        }
        let downloading = browser.downloads.download({
            filename: `Global Variables.${type}`,
            url: this.root.fileController.saveFile.makeTextFile(text),
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
