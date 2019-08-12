/*
 * Copyright 2017 SideeX committers
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
import { WindowController } from './window-controller';
import { Preprocessor } from './preprocessor';
import { Utils } from "../../../common/utils";

export class Playback {
    constructor(isDOMBased) {
        this.isDOMBased = isDOMBased;
        this.shutdown = false;
        this.isPlay = false;
        this.isPause = false;
        this.isStop = false;

        this.playMode = 0;
        this.playSuites = [];
        this.showCase = [];

        this.commandFailed = false;
        this.caseFailed = false;
        this.suiteFailed = false;
        this.playSpeed = 5;
        this.curCaseIdText = "";
        this.curPlayIndex = [];
        this.whileTimes = 0;
        this.timesOfPlay = 0;
        this.errorMessage = "";

        // wait
        this.implicitTime = 0;
        this.contentWindowId = 0;
        this.idOfTimeout;
        this.timeout = Playback.DEFAULT_TIMEOUT_VALUE;

        if (isDOMBased) {
            this.windowController = new WindowController(this);
        }
        this.preprocessor = new Preprocessor();
    }

    setContentWindowId(contentWindowId) {
        this.contentWindowId = contentWindowId;
        this.windowController.setContentWindowId(contentWindowId);
    }

    getContentWindowId() {
        return this.contentWindowId;
    }

    async periodPlay(playMode, optionPara) {
        if (!Panel.setting.get("periodical")) {
            return false;
        }

        this.timesOfPlay++;
        await Utils.delay(Panel.setting.get("period") * 60 * 1000);
        if (this.isStop) {
            return false;
        }

        return true;
    }

    setPlayFlag(bool, playMode) {
        this.isPlay = bool;
        this.playMode = playMode;
        if (bool) {
            EntryPoint.footer.setCondition(this.curCaseIdText, "is playing...");
        }
    }

    setStopFlags(bool) {
        this.isPause = bool;
        this.isStop = bool;
        this.shutdown = bool;
    }

    addLog(type, message) {
        Panel.log.pushLog(type, message);
        Panel.fileController.appendLog(type, message);
    }

    setPlayCasesAndSuites(mode) {
        let testSuite = { order: [], suites: {} };
        let selectedSuiteIdTexts = Panel.fileController.getSelectedSuites();
        switch (mode) {
            case Playback.PLAY_CASE:
                testSuite.order.push(selectedSuiteIdTexts[0]);
                testSuite.suites[selectedSuiteIdTexts[0]] = {
                    cases: [Panel.fileController.getSelectedCases()[0]]
                };
                break;
            case Playback.PLAY_SUITE:
                testSuite.order.push(selectedSuiteIdTexts[0]);
                testSuite.suites[selectedSuiteIdTexts[0]] = {
                    cases: Panel.fileController.getCaseIdTextsInSuite(selectedSuiteIdTexts[0])
                };
                break;
            case Playback.PLAY_ALL_SUITES:
                testSuite.order = [...Panel.fileController.testSuite.order];
                testSuite.suites = { ...Panel.fileController.testSuite.suites };
                break;
            default:
                this.addLog("error", "play error code");
                return;
        }
        return testSuite;
    }

    preparePlay(playMode) {
        this.timesOfPlay = 0;
        this.setPlayFlag(true, playMode);
        this.setStopFlags(false);

        EntryPoint.footer.setProgressAnimation(true);
        return;
    }

    initPlay(playMode, testSuite) {
        this.whileTimes = 0;
        this.curPlayIndex = [];
        let preprocessResult = this.preprocessor.preprocess(playMode, testSuite);
        this.playSuites = [ ...preprocessResult.playSuites ];
        Panel.variables.initLocalVars();
        Panel.recorder.preRecorder.flushBuffer(false);
        console.log(preprocessResult);

        EntryPoint.footer.setResultValue("run", preprocessResult.caseNum);
        EntryPoint.footer.setResultValue("success", 0);
        EntryPoint.footer.setResultValue("failure", 0);
        return preprocessResult;
    }

    finishPlay(playMode) {
        this.setPlayFlag(false, playMode);
        EntryPoint.footer.setCondition(this.curCaseIdText, "is finished");
    }

    async doPlayLoop(playSuites, startIndex) {
        this.curPlayIndex.push({ direction: 0, index: -1 });
        for (let suite of playSuites) {
            this.curPlayIndex[this.curPlayIndex.length - 1].index++;
            Panel.fileController.setSelectedSuites([suite.idText]);
            this.addLog("info", `Playing test suite ${suite.title}`);

            this.curPlayIndex.push({ direction: 0, index: -1 });
            this.suiteFailed = false;
            for (let caseEle of suite.cases) {
                this.curPlayIndex[this.curPlayIndex.length - 1].index++;
                Panel.fileController.setSelectedCases([caseEle.idText]);
                this.addLog("info", `Playing test case ${caseEle.title}`);
                EntryPoint.fileList.syncFiles();

                this.curCaseIdText = caseEle.idText;
                await this.playCommands(caseEle, startIndex);

                // await this.waitForResumption();
            }
            this.curPlayIndex.pop();
            if (this.isStop) { this.stop(); break; }
        }
        this.curPlayIndex.pop();
    }

    async doPlay(mode, startIndex) {
        this.preparePlay(mode);
        do {
            let preprocessResult = this.initPlay(mode, this.setPlayCasesAndSuites(mode));
            if (!preprocessResult.isPassed) break;
            await this.doPlayLoop(this.playSuites, startIndex);
        } while (await this.periodPlay(mode));
        this.finishPlay(mode);
        EntryPoint.footer.setProgressAnimation(false);
        EntryPoint.toolBar.syncButtonState();
    }

    async waitForResumption() {
        while (true) {
            if (!await this.checkPauseAfterDelay()) {
                return;
            }
        }
    }
    // TODO: utils
    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    checkPauseAfterDelay() {
        let self = this;
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(self.isPause);
            }, 100);
        });
    }

    async prepareCommands(caseIdText, fromIndex = 0) {
        this.implicitTime = 0;
        this.caseFailed = false;
        this.curPlayIndex.push({ direction: 0, index: fromIndex - 1 });

        try {
            await this.windowController.init();
        } catch (e) {
            console.error(e);
            this.addLog("error", "Initialization failed.");
            return false;
        }
        let records = Panel.fileController.getRecords(caseIdText);
        // Panel.fileController.clearIncludedRecords(records);
        Panel.fileController.clearRecordsStatus("snapshot", records, true);
        Panel.fileController.clearRecordsStatus("status", records, true);

        EntryPoint.footer.setCondition(caseIdText, "is playing...");
        EntryPoint.workArea.syncCommands();

        return true;
    }

    async doCommands(fromIndex, records) {
        let i = fromIndex;
        for (; i < records.length; i++) {
            this.curPlayIndex[this.curPlayIndex.length - 1].index++;
            let record = records[i];
            record.index = this.curPlayIndex[this.curPlayIndex.length - 1].index;

            // breakpoint
            if (record.breakpoint) {
                this.addLog("info", "Breakpoint: Stop.");
                this.pause();
                await this.waitForResumption();
            }

            // pause or stop
            if (this.isStop) return i;
            if (this.isPause) await this.waitForResumption();

            await Utils.delay(Panel.setting.get("delay"));

            let command = this.initCommand(record, false);
            if (command !== null) {
                console.log("play: ", command.name, command.target, command.value, command.preWaitTime);
                await this.doCommand(command);
            }

            this.finishCommand(this.commandFailed, record);

            if (this.caseFailed) break;

            if (record.name === "WHILE" || record.name === "IF") {
                try {
                    if (eval(record.expression)) {
                        this.curPlayIndex.push({ direction: 0, index: -1 });
                        do {
                            if (this.isStop) break;
                            Panel.fileController.clearRecordsStatus("status", record.children[0], true);
                            Panel.fileController.clearRecordsStatus("snapshot", record.children[0], true);
                            await this.doCommands(0, record.children[0]);
                            this.curPlayIndex[this.curPlayIndex.length - 1].index = -1;
                        } while ((--record.limitTimes) > 0);
                    } else {
                        this.curPlayIndex.push({ direction: 1, index: -1 });
                        await this.doCommands(0, record.children[1]);
                    }
                    this.curPlayIndex.pop();
                } catch (e) {
                    console.log(e);
                    this.caseFailed = true;
                    this.commandFailed = true;
                    this.addLog("error", e.message);
                    break;
                }
            }
            if (record.name === "INCLUDE") {
                if (record.children) {
                    this.curPlayIndex.push({ direction: 0, index: -1 });
                    await this.doCommands(0, record.children[0]);
                    this.curPlayIndex.pop();
                } else {
                    this.caseFailed = true;
                    this.commandFailed = true;
                    this.addLog("error", "Cannot find the included records");
                    break;
                }
            }
        }
        return i + 1;
    }

    initCommand(record, notExecute) {
        this.commandFailed = false;
        let selectTarget = record.target.options[record.target.usedIndex];
        let selectValue = record.value.options[record.value.usedIndex];

        let name = record.name;
        let target = selectTarget.type === "tac" ? record.target.tac : selectTarget.value;
        let value = selectValue.type === "tac" ? record.target.tac : selectValue.value;
        let preWaitTime = record.preWaitTime;

        // parse variable
        try {
            target = this.preprocessTargetValue(target);
            value = this.preprocessTargetValue(value);
        } catch (e) {
            console.error(e);
            this.errorMessage = e.message;
            this.commandFailed = true;
            this.caseFailed = true;
            return null;
        }

        if (!notExecute) {
            Panel.fileController.setRecordStatus(record, "execute");
            this.addLog("info", `Executing: | ${name} | ${selectTarget.value} | ${selectValue.value} |`);
            let index = 0;
            for (let temp of this.curPlayIndex) { index += temp.index; }
            EntryPoint.workArea.setAutoScroll({ isUsed: true, idText: `records-${index}` });
            EntryPoint.workArea.syncCommands();
            EntryPoint.console.syncLog();
        }

        return {
            name: name,
            target: target,
            value: value,
            preWaitTime: preWaitTime
        };
    }

    async doCommand(command) {
        do {
            if (this.isStop) return;

            try {
                await this.dispatchCommand(JSON.stringify(this.curPlayIndex), command);
                break;
            } catch (e) {
                console.error(e);
                if (this.shutdown) {
                    await this.waitForResumption();
                    continue;
                }
                this.errorMessage = e.message ? e.message : e;
                if (this.isReceivingEndError(this.errorMessage)) {
                    await this.delay();
                    continue;
                }
                if (this.errorMessage.match(/Element[\s\S]*?not found/)) {
                    if (this.implicitTime != 0 && (Date.now() - this.implicitTime > 10000)) {
                        this.addLog("error", "Implicit Wait timed out after 10000ms");
                        this.implicitTime = 0;
                    } else {
                        if (this.implicitTime == 0) {
                            this.addLog("info", "Wait until the element is found");
                            this.implicitTime = Date.now();
                        }
                        await this.delay();
                        continue;
                    }
                }

                this.implicitTime = 0;
                this.commandFailed = true;
                if (!(command.name.includes("verify") && this.errorMessage.includes("did not match"))) {
                    this.caseFailed = true;
                    break;
                }
            }
        } while (!this.commandFailed);

        if (this.determineCommandType(command.name) == Playback.COMMAND_TYPE_CONTENT ||
            this.determineCommandType(command.name) == Playback.COMMAND_TYPE_EXTENSION_SELECT) {
            while (!this.commandFailed) {
                try {
                    await this.doAutoWaitSeries(command.preWaitTime);
                    break;
                } catch (e) {
                    console.log(e);
                    continue;
                }
            }
        }
    }

    finishCommand(isFail, record) {
        let status = isFail ? "fail" : "success";
        Panel.fileController.setRecordStatus(record, status);
        EntryPoint.workArea.syncCommands();
    }

    async finishCommands(index, isFail, records) {
        // await Panel.snapshot.createSnapshotVideo();
        this.addLog(`${isFail ? "error" : "info"}`, `Test case ${isFail ? "failed" : "passed"}`);
        this.cleanUp();
        this.curPlayIndex.pop();
    }

    async playCommands(caseEle, fromIndex) {
        if (!await this.prepareCommands(caseEle.idText, fromIndex)) return;
        let index = await this.doCommands(fromIndex, caseEle.records);
        await this.finishCommands(index, this.caseFailed, caseEle.records);
        return;
    }

    cleanUp() {
        Panel.variables.clearLocalVars();
        if (this.isDOMBased) {
            this.windowController.clear();
        }
    }

    async stop() {
        this.isStop = true;
        this.isPause = false;
        this.setPlayFlag(false, this.playMode);
        this.addLog("info", "Stop executing");
        // Panel.uiTools.setGridClick(false);
        EntryPoint.footer.setCondition(this.curCaseIdText, "is stopped");
        EntryPoint.toolBar.syncButtonState();
        clearTimeout(this.idOfTimeout);
    }

    pause() {
        this.isPause = true;
        this.setPlayFlag(false, this.playMode);

        this.addLog("info", "Pausing");
        EntryPoint.toolBar.syncButtonState();
        EntryPoint.footer.setCondition(this.curCaseIdText, "is paused");
    }

    async resume() {
        if (this.isPause) {
            this.isPause = false;
            this.shutdown = false;
            this.setPlayFlag(true, this.playMode);

            if (this.isDOMBased) {
                this.windowController.attach();
            }
            // Panel.uiTools.setGridClick(true);
            this.addLog("info", "Resuming");
            EntryPoint.toolBar.syncButtonState();
            EntryPoint.footer.setCondition(this.curCaseIdText, "is resuming");
        }
    }

    preprocessTargetValue(str) {
        if (!str.includes("TAC_LOCATOR") && !Panel.variables.isKeyBoardVars(str)) {
            return str.supplant(Panel.variables.localVars, Panel.variables.globalVars);
        }
        return str;
    }

    preprocessValue(str) {
        // if (!isKeyBoardVars(str)) {
        //     return str.supplant(Panel.variables.localVars);
        // }
        return str;
    }

    async doAutoWaitSeries(preWaitTime) {
        if (!preWaitTime) {
            return Promise.resolve();
        }
        // await this.doAutoWait("pageWait");
        // await this.doAutoWait("ajaxWait", preWaitTime.ajax);
        // await this.doAutoWait("DOMWait", preWaitTime.DOM);
        if (this.shutdown)
            return;
        else
            await this.windowController.sendCommand("waitSeries", "", 0, JSON.stringify(this.curPlayIndex));
    }

    // async doAutoWait(type, value = 0) {
    // }

    async dispatchCommand(index, command) {
        let result;
        let name = command.name, target = command.target, value = command.value;
        
        switch (this.determineCommandType(name)) {
            case Playback.COMMAND_TYPE_CONTENT:
            case Playback.COMMAND_TYPE_CONTEXTMENU: {
                result = await this.windowController.sendCommand(name, target, value, index);
                console.log(result);
                return this.handleCommandResult(result);
            }
            case Playback.COMMAND_TYPE_EXTENSION:
            case Playback.COMMAND_TYPE_EXTENSION_SELECT: {
                let commandCapital = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
                return this.windowController[`do${commandCapital}`](target, value);
            }
            case Playback.COMMAND_TYPE_PANEL: {
                return Promise.resolve();
            }
            default: {
                return Promise.reject("Command Not Found");
            }
        }
    }

    delay() {
        let self = this;
        return new Promise(function (resolve) {
            setTimeout(resolve, self.timeout);
        });
    }

    handleCommandResult(result) {
        if (result.status) {
            return true;
        } else {
            return Promise.reject(result.message);
        }
    }

    isReceivingEndError(errorMessage) {
        switch (errorMessage) {
            case "TypeError: response is undefined": //Firefox
            case "Error: Could not establish connection. Receiving end does not exist.": //Firefox
            case "Could not establish connection. Receiving end does not exist.": //Chrome
            case "The message port closed before a reponse was received.": //Chrome(misspelling)
            case "The message port closed before a response was received.": //Chrome
                return true;
            default:
                return false;
        }
    }

    determineCommandType(command) {
        switch (command) {
            case "open":
            case "runScript":
            case "clickAt":
            case "onclick":
            case "echo":
            case "doubleClickAt":
            case "rightClickAt":
            case "mouseDownAt":
            case "mouseMoveAt":
            case "mouseOut":
            case "mouseOver":
            case "mouseUpAt":
            case "dragAndDrop":
            case "dragAndDropToObject":
            case "sendKeys":
            case "submit":
            case "onsubmit":
            case "type":
            case "editContent":
            case "addSelection":
            case "removeSelection":
            case "select":
            case "answerOnNextPrompt":
            case "chooseCancelOnNextPrompt":
            case "assertPrompt":
            case "chooseOkOnNextConfirmation":
            case "chooseCancelOnNextConfirmation":
            case "assertConfirmation":
            case "assertAlert":
            case "waitForElementPresent":
                return Playback.COMMAND_TYPE_CONTENT;
            case "close":
            case "pause":
                return Playback.COMMAND_TYPE_EXTENSION;
            case "selectWindow":
            case "selectFrame":
                return Playback.COMMAND_TYPE_EXTENSION_SELECT;
            case "store":
            case "storeGlobalVars":
            case "storeText":
            case "storeTitle":
            case "storeValue":
            case "verifyText":
            case "verifyTitle":
            case "verifyValue":
            case "assertText":
            case "assertTitle":
            case "assertValue":
                return Playback.COMMAND_TYPE_CONTEXTMENU;
            default:
                return Playback.COMMAND_TYPE_UNDEFINED;
        }
    }
}

Playback.COMMAND_TYPE_CONTENT = 0;
Playback.COMMAND_TYPE_EXTENSION = 1;
Playback.COMMAND_TYPE_EXTENSION_SELECT = 2;
Playback.COMMAND_TYPE_PANEL = 3;
Playback.COMMAND_TYPE_CONTEXTMENU = 4;
Playback.COMMAND_TYPE_UNDEFINED = 404;
Playback.DEFAULT_TIMEOUT_VALUE = 30;

Playback.PLAY_CASE = 0;
Playback.PLAY_SUITE = 1;
Playback.PLAY_ALL_SUITES = 2;


