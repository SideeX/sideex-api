import { FileTransformer } from './file-transformer';
import { unescapeHtml } from '../../../common/escape';
import { Utils } from '../../../utils/utils.common';
import { app, fileList } from "../UI/entryPoint";

export class LoadFile {
    constructor(root, parent) {
        this.root = root;
        this.parent = parent;

        this.olderTestSuiteResult = undefined;
        this.olderTestSuiteFile = undefined;
        this.fileTransformer = new FileTransformer(root, this);
    }

    getContent(str, tag, withClass = true, isUnescape = false) {
        let reObj = withClass ?
            new RegExp(`<${tag} class="[\\s\\S]*?">|</${tag}>`, "gi") :
            new RegExp(`<${tag}[\\s\\S]*?>|</${tag}>`, "gi");
        return isUnescape ? Utils.unescape(str.split(reObj)[1]) : str.split(reObj)[1];
    }

    getContentWithAttri(str) {
        return str.substring(str.indexOf(">") + 1, str.lastIndexOf("<"));
    }

    getUsedIndex(str) {
        let usedIndex = str.match(/data-used-index="\d"/gi)[0];
        return parseInt(usedIndex.substring(
            usedIndex.indexOf("\"") + 1, usedIndex.lastIndexOf("\"")
        ));
    }

    getTac(str) {
        let tacs = str.match(/<span class="[\s\S]*?tac">[\s\S]*?<\/span>/gi);
        if (tacs === null) return "";
        return tacs[0];
    }

    getOptionType(str) {
        return str.split(/<option class="type-|">/gi)[1];
    }

    getWaitValue(type, str) {
        let label = `data-${type.toLowerCase()}="`;
        let start = str.indexOf(label) + label.length;
        let end = str.indexOf("\"", start);
        return parseInt(str.substring(start, end));
    }

    parseTrs(content) {
        let tds = content.match(/<td class="[\s\S]*?<\/td>/gi);
        if (tds === null) return undefined;

        let command = this.getContent(tds[0], "td", true, false);

        let target = {
            usedIndex: this.getUsedIndex(tds[1]),
            options: [],
            tac: unescapeHtml(this.getContentWithAttri(this.getTac(tds[1])))
        };
        let options = tds[1].match(/<option[\s\S]*?<\/option>/gi);
        for (let option of options) {
            target.options.push({
                type: this.getOptionType(option),
                value: this.getContent(option, "option", true, false)
            });
        }

        let value = {
            usedIndex: this.getUsedIndex(tds[2]),
            options: [],
            tac: unescapeHtml(this.getContentWithAttri(this.getTac(tds[2])))
        };
        options = tds[2].match(/<option[\s\S]*?<\/option>/gi);
        for (let option of options) {
            value.options.push({
                type: this.getOptionType(option),
                value: this.getContent(option, "option", true, true)
            });
        }

        let preWaitTime = {
            beforeunload: this.getWaitValue("pbw", content),
            ajax: this.getWaitValue("paw", content),
            resource: this.getWaitValue("prw", content),
            DOM: this.getWaitValue("pdw", content)
        };

        return this.parent.newCommand(command, target, value, preWaitTime);
    }

    readRecords(caseText) {
        let records = [];
        let trs = caseText.match(/<tr class="command[\s\S]*?<\/tr>/gi);
        if (trs !== null) {
            for (let tr of trs) {
                let temp = this.parseTrs(tr);
                temp && records.push(temp);
            }
        }
        return records;
    }

    readCases(suiteText) {
        let caseTexts = suiteText.match(/<table[\s\S]*?<\/table>/gi);
        if (caseTexts) {
            for (let caseText of caseTexts) {
                let records = this.readRecords(caseText);

                let caseTitle = caseText.split(/<th class="case-title[\s\S]*?>|<\/th>/gi)[1];
                let networkSpeed = parseInt(caseText.split(/<table class="case[\s\S]*?data-ns="|">/gi)[1]);
                this.parent.setNetworkSpeed(networkSpeed);
                this.parent.addTestCase({ title: caseTitle, records: records, modified: false });
            }
        }
    }

    readSuites(filename, fileText) {
        // let selectedSuites = [];
        // let suiteTexts = fileText.match(/<div class="suite">[\s\S]*?<\/div>/gi);
        // if (suiteTexts) {
        //     for (let suiteText of suiteTexts) {
        //         let suiteTitle = suiteText.split(/<h3 class="suite-title[\s\S]*?>|<\/h3>/gi)[1];
        //         selectedSuites.push(this.parent.addTestSuite({ title: suiteTitle, modified: false }));
        //         this.readCases(suiteText);
        //     }
        //     let caseIdTexts = this.parent.getCaseIdTextsInSuite(selectedSuites);
        //     caseIdTexts.length > 0 ?
        //         this.parent.setSelectedCases([caseIdTexts[0]]) :
        //         this.parent.setSelectedSuites(selectedSuites);
        // }
        console.log("asd");
        let obj = JSON.parse(fileText);
            for (let suite of obj.suites) {
                let cases = suite.cases;
                suite.cases = [];
                this.root.fileController.addTestSuite({
                    fileName: suite.fileName,
                    title: suite.title,
                    cases: [],
                    modified: false
                });
                for (let caseEle of cases) {
                    this.root.fileController.addTestCase({
                        title: caseEle.title,
                        records: caseEle.records.map(record => {
                            return this.parent.newCommand(record.name, record.target, record.value, record.pwt);
                        }),
                        modified: false
                    });
                }
            }
    }

    readFile(file) {
        if (!file.type.includes("json")) return;

        let reader = new FileReader();
        reader.readAsText(file);
        

        reader.onload = () => {
           
            let fileText = reader.result;
            // check for input file version
            // if it is not SideeX2, transforming it
            // if (!this.checkIsVersion2(fileText)) {
            //     // TODO: write a non-blocked confirm window
            //     // confirm user if want to transform input file for loading it
            //     if (!window.confirm(`"${file.name}" is of the format of an early version of Selenium IDE. Some commands may not work. Do you still want to open it?`)) {
            //         return;
            //     }
            //     // parse for testCase or testSuite
            //     if (this.fileTransformer.checkIsTestSuite(fileText)) {
            //         // alert("Sorry, we do not support test suite of the format of an early version of Selenium IDE now.");
            //         this.olderTestSuiteResult = fileText.substring(0, fileText.indexOf("<table")) + fileText.substring(fileText.indexOf("</body>"));
            //         this.olderTestSuiteFile = file;
            //         this.fileTransformer.loadCaseIntoSuite(fileText);
            //         return;
            //     } else {
            //         fileText = this.fileTransformer.transformVersion(fileText);
            //     }
            // }
            let result = this.checkLoadedFile(fileText);
            console.log(result);
            if (!result.isSideex || !(result.version.format.length > 0 && result.version.format[0] >= 2)) {
                app.setModal({
                    isOpen: true, type: "alert",
                    title: "Error on loading file",
                    content: `"${file.name}" is of the format of an early version of SideeX.`
                });
                return;
            }
            // append on test grid
            // this.fileTransformer.appendTestSuite(file, fileText);
            this.readSuites(file.name, fileText);
            fileList.syncFiles();
        };

        reader.onerror = (event) => {
            this.root.log.pushLog("error", `Error on loading ${file.name}. (${event.message})`);
        };
    }

    checkIsVersion2(input) {
        if (input.search(/<meta name="description" content="version=2\.\d\.\d">/) >= 0) {
            return true;
        }
        if (input.search("<table") >= 0 && input.search("<datalist") >= 0) {
            return true;
        }
        return false;
    }

    checkLoadedFile(input) {
        let result = { isSideex: false, version: [] };
        // let metas = input.match(/<meta [\s\S]*?>/gi);
        // if (!metas) return result;

        // for (let meta of metas) {
        //     let nameAttrs = meta.match(/name="[\s\S]*?"/);
        //     let contentAttrs = meta.match(/content="[\s\S]*?"/gi);
        //     if (!nameAttrs && !contentAttrs) continue;

        //     let name = getAttrValue(nameAttrs[0]);
        //     let content = getAttrValue(contentAttrs[0]);

        //     !result.isSideex &&
        //         (result.isSideex = this.isSideexFile(name, content));
        //     !result.versions.length > 0 &&
        //         (result.versions = this.getVersion(name, content));
        // }
        let obj = JSON.parse(input);
        if (!obj.version) return { isSideex: boolean, version: SideeXVersion };
        console.log(obj);
        result.isSideex = obj.version.sideex ? true : false;
        result.version = obj.version.format ? obj.version : result.version;
        
        return result;

        function getAttrValue(attr) {
            return attr.substring(attr.indexOf("\"") + 1, attr.lastIndexOf("\""));
        }
    }

    isSideexFile(name, content) {
        return (name === "application-name" && content === "sideex") ?
            true : false;
    }

    getVersion(name, content) {
        if (name !== "description") return [];

        let temp = content.split("=");
        let version = [];
        let versionStrings = temp[1].split(".");
        try {
            for (let ele of versionStrings) { version.push(parseInt(ele)); }
        } catch (e) {
            return [];
        }

        return version;
    }
}
