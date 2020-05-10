import { doEscape } from '../../../common/escape';
import { Utils } from "../../../utils/utils.common";
import { cloneDeep } from "lodash";

export class SaveFile {
    constructor(root, parent) {
        this.root = root;
        this.parent = parent;

        this.textFile = undefined;
        this.downloadFile = {};

        if (root.isDOMBased) {
            this.downloadCompleted = this.downloadCompleted.bind(this);
            browser.downloads.onChanged.addListener(this.downloadCompleted);
        }
    }

    wrapTac(type, tac) {
        return `<span class="${type}-tac tac">${doEscape(tac)}</span>`;
    }

    script() {
        return `<script>
            let modes = ["target", "value"];
            for (let mode of modes) {
                let tds = document.querySelectorAll(\`.command-\${mode}\`);
                for (let td of tds) {
                    let index = parseInt(td.querySelector("datalist").dataset.usedIndex);
                    let options = td.querySelectorAll("option");
                    td.appendChild(document.createTextNode(options[index].textContent));
                }
            }
        </script>`;
    }

    wrapName(command) {
        return `<td class="command-name">${command}</td>`;
    }

    wrapDataList(options, usedIndex, isEscape = false) {
        let temp = "";
        for (let i = 0; i < options.length; i++) {
            temp += `<option class="type-${options[i].type}">${
                isEscape ? Utils.escape(options[i].value) : options[i].value}</option>`;
        }
        return `<datalist data-used-index="${usedIndex}">${temp}</datalist>`;
    }

    wrapTargets(target) {
        let usedIndex = target.usedIndex;
        return `<td class="command-target">` +
            this.wrapDataList(target.options, usedIndex, false) +
            this.wrapTac("target", target.tac) + '</td>';
    }

    wrapValues(value) {
        let usedIndex = value.usedIndex;
        return `<td class="command-value">` +
            this.wrapDataList(value.options, usedIndex, true) +
            this.wrapTac("value", value.tac) + '</td>';
    }

    parseRecordsToText(records) {
        let result = "";
        for (let i = 0; i < records.length; i++) {
            // let preWaitTime = records[i].preWaitTime;

            result +=
                `<tr class="command"` +
                this.wrapName(records[i].name) +
                this.wrapTargets(records[i].target) +
                this.wrapValues(records[i].value) +
                '</tr>';
        }
        return result;
    }

    wrapTestCase(caseIdText) {
        return `<table class="case margin-auto" data-ns="${this.root.setting.get("networkSpeed")}">
            <thead><tr><th class="case-title" rowspan="1" colspan="3">${this.parent.testCase.cases[caseIdText].title}</th></tr></thead>
            <tbody>${this.parseRecordsToText(this.parent.testCase.cases[caseIdText].records)}</tbody>
        </table>`;
    }

    wrapTestSuite(suiteIdText) {
        let caseText = "";
        let cases = this.parent.testSuite.suites[suiteIdText].cases;
        for (let caseIdText of cases) {
            caseText += this.wrapTestCase(caseIdText);
        }

        return `<div class="suite">
            <h3 class="suite-title text-align-center">${this.parent.testSuite.suites[suiteIdText].title}</h3>
            ${caseText}
        </div>`;
    }

    wrapContent(filename, content) {
        return `<!DOCTYPE html><html>
            <head>
                <meta charset="UTF-8">
                <meta name="application-name" content="sideex">
                <meta name="description" content="version=2.0.0">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${filename}</title>
                <style>
                    .tac { display: none; }
                    table { table-layout: fixed; border-collapse: collapse;
                        width: 90%; word-wrap: break-word; }
                    th, td { padding: 5px; border: 1px solid black; }
                    .text-align-center { text-align: center; }
                    .margin-auto { margin: auto; }
                </style>
            </head>
            <body>${content}${this.script()}</body>
        </html>`;
    }

    downloadSuites(suiteIdTexts) {
        let filename = this.parent.testSuite.suites[suiteIdTexts[0]].title, suiteText = "";
        let link = "";
        // for (let suiteIdText of suiteIdTexts) {
        //     suiteText += this.wrapTestSuite(suiteIdText);
        // }
        // let link = Utils.makeTextFile(
        //     pretty(this.wrapContent(filename, suiteText))
        // );
        let result = {
            time: Date.now(),
            version: {
                sideex: [3, 2, 1],
                format: [2, 0, 0]
            },
            suites: []
        };
        for (let suiteIdText of suiteIdTexts) {
            let suite = this.parent.getTestSuite(suiteIdText);
            let outputSuite = { fileName: suite.fileName, title: suite.title, cases: [] };
            for (let caseIdText of suite.cases) {
                let caseEle = this.parent.getTestCase(caseIdText);
                outputSuite.cases.push({
                    title: caseEle.title,
                    records: caseEle.records.map(record => {
                        return cloneDeep({
                            name: record.name,
                            target: record.target,
                            value: record.value,
                            pwt: record.pwt
                        });
                    })
                });
            }
            result.suites.push(outputSuite);
        }
        if(!this.root.api){
            link = Utils.makeTextFile(JSON.stringify(result, null, "  "), "json");
            this.doDownload("file", `${filename}.json`, link, { suiteIdTexts: suiteIdTexts });
        }else{
            let file = JSON.stringify(result)
            return file
        }
    }

    async downloadCompleted(downloadDelta) {
        let file = this.downloadFile[downloadDelta.id];
        if (downloadDelta.id && downloadDelta.state &&
            downloadDelta.state.current === "complete") {
            // console.log(file);
            if (file) {
                if (file.type === "file") {
                    this.parent.setSuiteModified(file.suiteIdTexts[0], false, true);
                }


                Utils.releaseObjectURL(file.url);
                delete this.downloadFile[downloadDelta.id];
            }
        } else if (downloadDelta.error) {
            let error = downloadDelta.error.current;
            if (error !== "USER_CANCELED" && error !== "USER_SHUTDOWN") {
                this.root.log.pushLog("error", `Error on downloading ${file.title}. (${error})`);
                //logConsole.syncLog(true);
            }

            Utils.releaseObjectURL(file.url);
            delete this.downloadFile[downloadDelta.id];
        } else if (downloadDelta.filename) {
            let splitName = downloadDelta.filename.current.split(/\/|\\/gi);
            let filename = splitName[splitName.length - 1];
            let dotIndex = filename.lastIndexOf(".");
            if (file) {
                file.title = dotIndex > 0 ? filename.substring(0, dotIndex) : filename;
            }
        }
    }

    saveLog() {
        let logContext = "";
        for (let log of this.root.log.logs) {
            logContext += `[${log.type.toUpperCase()}] ${log.message}\n`;
        }

        this.doDownload("log", `${Utils.getFormatTime()}.log`, Utils.makeTextFile(logContext));
    }

    async doDownload(type, filename, url, otherParams) {
        try {
            let downloadId = await browser.downloads.download({
                filename: filename,
                url: url,
                saveAs: true,
                conflictAction: 'overwrite'
            });
            this.downloadFile[downloadId] = {
                id: downloadId,
                type: type,
                url: url,
                title: filename,
                ...otherParams
            };
        } catch (e) {
            this.root.log.pushLog("error", `Error on downloading ${file.title}. (${error})`);
            //logConsole.syncLog(true);
        }
    }
}
