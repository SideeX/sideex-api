import { browser } from "webextension-polyfill-ts";
import { root } from "../background/initial";
import * as EntryPoint from "../UI/entryPoint";
import { toolBar, workArea, fileList} from "./entryPoint";

export default {
    toolBar: {
        clickPlayButton: function (mode) {
            console.log(mode);
            root.recorder.isRecord = false;
            root.playback.isPlay = true;
            root.recorder.detach();
            switch (mode) {
                case "Play this case": {
                    root.playback.doPlay(0, 0); // Playback.PLAY_CASE
                    break;
                }
                case "Play this suite": {
                    root.playback.doPlay(1, 0); // Playback.PLAY_SUITE
                    break;
                }
                case "Play all suites": {
                    root.playback.doPlay(2, 0); // Playback.PLAY_ALL_SUITES
                    break;
                }
            }
            EntryPoint.toolBar.syncButtonState();
        },
        clickRecordButton: function () {
            root.recorder.isRecord = !root.recorder.isRecord;
            if (root.recorder.isRecord) {
                console.log("Recording");
                root.recorder.attach();
                root.recorder.notificationCount = 0;
                root.recorder.prepareRecord();

                root.recorder.isRecord = true;
            } else {
                console.log("Stop");
                root.recorder.detach();
                root.recorder.isRecord = false;
            }
            EntryPoint.toolBar.syncButtonState();
            EntryPoint.fileList.syncFiles();
        },
        clickStopButton: function () {
            root.playback.stop();

            root.playback.isPlay = false;
            EntryPoint.toolBar.syncButtonState();
        },
        clickPauseButton: function () {
            root.playback.pause();

            root.playback.isPlay = false;
            root.playback.isPause = true;
            EntryPoint.toolBar.syncButtonState();
        },
        clickResumeButton: function () {
            root.playback.resume();

            root.playback.isPlay = true;
            root.playback.isPause = false;
            EntryPoint.toolBar.syncButtonState();
        },
        clickSettingButton: function () {
            browser.runtime.openOptionsPage();
        },
        changeSpeed: function (value) {
            root.setting.set({ delay: 500 * (5 - value) });
            EntryPoint.toolBar.updateSpeed(parseInt(value));
        }

    },
    fileList: {
        // context menu
        clickAddTestSuite: function (event) {
            let untitledCount = root.fileController.testSuite.untitledCount;
            fileList.setModal({
                isOpen: true, type: "add suite",
                params: { title: `Untitled Test Suite${untitledCount == 0 ? "" : ` ${untitledCount}`}` }
            });
        },
        clickAddTestSuiteModalEnter: function (event, inputValue) {
            let checkResult = root.fileController.checkNameValid(inputValue);
            if (checkResult.result) {
                if (!root.fileController.isSuiteNameUsed(inputValue)) {
                    root.fileController.addTestSuite({ title: inputValue });
                    fileList.setModal({ isOpen: false, type: "default" });
                    fileList.syncFiles();
                } else {
                    fileList.setModal({
                        error: "This name has been used. Please use another one."
                    });
                }
            } else {
                fileList.setModal({ error: checkResult.message });
            }
        },
        clickAddTestCase: function (event) {
            let untitledCount = root.fileController.testCase.untitledCount;
            fileList.setModal({
                isOpen: true, type: "add case",
                params: { title: `Untitled Test Case${untitledCount == 0 ? "" : ` ${untitledCount}`}` }
            });
        },
        clickAddTestCaseModalEnter: function (event, inputValue) {
            let selectedSuiteIdText = root.fileController.getSelectedSuites()[0];
            let checkResult = root.fileController.checkNameValid(inputValue);
            if (checkResult.result) {
                if (!root.fileController.isCaseNameUsed(inputValue, selectedSuiteIdText)) {
                    let caseIdText = root.fileController.addTestCase({ title: inputValue });
                    root.fileController.setCaseModified(caseIdText, true, true);
                    fileList.setModal({ isOpen: false, type: "default" });
                    fileList.syncFiles();
                } else {
                    fileList.setModal({
                        error: "This name has been used. Please use another one."
                    });
                }
            } else {
                fileList.setModal({ error: checkResult.message });
            }
        },
        clickOpenTestSuite: function (event) {
            document.getElementById("open-files").click();
        },
        changeOpenFile: function (event) {
            for (let i = 0; i < event.target.files.length; i++) {
                if (root.fileController.isFileNameOpened(event.target.files[i].name)) {
                    app.setModal({
                        isOpen: true, type: "alert",
                        title: "Error on opening file",
                        content: `"${event.target.files[i].name}" has been opened.`
                    });
                    continue;
                }
                root.fileController.loadFile.readFile(event.target.files[i]);
            }
            event.target.value = null;
            fileList.syncFiles();
        },
        clickCloseAllTestSuites: function (event) {
            let suiteIdTexts = root.fileController.getAllSuiteIdTexts();
            let suiteTitles = [];
            for (let suiteIdText of suiteIdTexts) {
                suiteTitles.push(`"${root.fileController.getSuiteTitle(suiteIdText)}"`);
            }
            suiteTitles.length > 0 &&
                fileList.setModal({
                    isOpen: true, type: "close suites",
                    params: { title: suiteTitles.join(", ") }
                });
        },
        clickCloseAllTestSuitesEnter: function (event) {
            let suiteIdTexts = root.fileController.getAllSuiteIdTexts();
            if (suiteIdTexts.length > 0) {
                for (let suiteIdText of suiteIdTexts) {
                    root.fileController.deleteSuite(suiteIdText);
                }
                fileList.setModal({ isOpen: false, type: "default" });
                fileList.syncFiles();
            }
        },
        clickCloseTestSuite: function (event) {
            let suiteIdText = root.fileController.getSelectedSuites()[0];
            suiteIdText &&
                fileList.setModal({
                    isOpen: true, type: "close suite",
                    params: { title: `"${root.fileController.getSuiteTitle(suiteIdText)}"` }
                });
        },
        clickCloseTestSuiteEnter: function (event) {
            let suiteIdText = root.fileController.getSelectedSuites()[0];
            if (suiteIdText) {
                fileList.setModal({ isOpen: false, type: "default" });
                root.fileController.deleteSuite(suiteIdText);
                fileList.syncFiles();
            }
        },
        clickRemoveTestCase: function (event) {
            let caseIdText = root.fileController.getSelectedCases()[0];
            caseIdText &&
                fileList.setModal({
                    isOpen: true, type: "delete case",
                    params: { title: root.fileController.getCaseTitle(caseIdText) }
                });
        },
        clickRemoveTestCaseEnter: function (event) {
            let caseIdText = root.fileController.getSelectedCases()[0];
            root.fileController.setCaseModified(caseIdText, true, true);
            if (caseIdText) {
                fileList.setModal({ isOpen: false, type: "default" });
                root.fileController.deleteCase(caseIdText);
                fileList.syncFiles();
            }
        },
        clickSaveTestSuite: function (event) {
            let suiteIdText = root.fileController.getSelectedSuites()[0];
            root.fileController.saveFile.downloadSuites([suiteIdText]);
            fileList.syncFiles();
        },
        clickSaveTestSuites: function (event) {
            let suiteIdTexts = root.fileController.getSelectedSuites();
            root.fileController.saveFile.downloadSuites(suiteIdTexts);
            fileList.syncFiles();
        },
        clickRenameTestSuite: function (event) {
            let suiteIdText = root.fileController.getSelectedSuites()[0];
            fileList.setModal({
                isOpen: true, type: "rename suite",
                params: { title: root.fileController.getSuiteTitle(suiteIdText) }
            });
        },
        clickRenameTestSuiteModalEnter: function (event, inputValue) {
            let suiteIdText = root.fileController.getSelectedSuites()[0];
            let checkResult = root.fileController.checkNameValid(inputValue);
            if (checkResult.result) {
                if (!root.fileController.isSuiteNameUsed(inputValue)) {
                    root.fileController.setSuiteTitle(suiteIdText, inputValue);
                    root.fileController.setSuiteModified(suiteIdText, true, false);
                    fileList.setModal({ isOpen: false, type: "default" });
                    fileList.syncFiles();
                } else {
                    fileList.setModal({
                        error: "The test suite name has been used. Please use another name."
                    });
                }
            } else {
                fileList.setModal({ error: checkResult.message });
            }
        },
        clickRenameTestCase: function (event) {
            let caseIdText = root.fileController.getSelectedCases()[0];
            fileList.setModal({
                isOpen: true, type: "rename case",
                params: { title: root.fileController.getCaseTitle(caseIdText) }
            });
        },
        clickRenameTestCaseModalEnter: function (event, inputValue) {
            let suiteIdText = root.fileController.getSelectedSuites()[0];
            let caseIdText = root.fileController.getSelectedCases()[0];
            let checkResult = root.fileController.checkNameValid(inputValue);
            if (checkResult.result) {
                if (!root.fileController.isCaseNameUsed(inputValue, suiteIdText)) {
                    root.fileController.setCaseTitle(caseIdText, inputValue);
                    root.fileController.setCaseModified(caseIdText, true, true);
                    fileList.setModal({ isOpen: false, type: "default" });
                    fileList.syncFiles();
                } else {
                    fileList.setModal({
                        error: "The test case name has been used. Please use another name."
                    });
                }
            } else {
                fileList.setModal({ error: checkResult.message });
            }
        }
    },

    workArea: {
        clickAddCommand: function (event) {
            event.stopPropagation();
            root.uiTools.setIsOnWorkArea(true);
            root.recorder.prepareRecord();
            let info = root.fileController.insertCommand("after", "",
                { options: [{ type: "other", value: "" }] },
                { options: [{ type: "other", value: "" }] },
            );
            let recordInfo = root.fileController.getRecord(info.caseIdText, info.index);
            root.fileController.setSelectedRecords([`records-${info.index}`]);

            workArea.syncCommands();
            fileList.syncFiles();
            workArea.setEditBlock({
                index: info.index, isOpen: true, isSelect: false,
                usedIndex: {
                    target: recordInfo.target.usedIndex,
                    value: recordInfo.value.usedIndex
                },
                value: {
                    name: recordInfo.name,
                    targets: recordInfo.target.options,
                    values: recordInfo.value.options
                }
            });
        },
        clickDeleteCommand: function (event) {
            event.stopPropagation();
            root.uiTools.setIsOnWorkArea(true);
            let caseIdText = root.fileController.getSelectedCases()[0];
            let recordIdText = root.fileController.getSelectedRecords()[0];
            let index = parseInt(recordIdText.split('-')[1]);
            root.fileController.deleteRecord(caseIdText, index);

            workArea.syncCommands();
        },
        clickDeleteAllCommand: function (event) {
            event.stopPropagation();
            root.uiTools.setIsOnWorkArea(true);
            let caseIdText = root.fileController.getSelectedCases()[0];
            root.fileController.deleteAllRecords(caseIdText);

            workArea.syncCommands();
        },
        clickCopyCommands: function (event) {
            event.stopPropagation();
            root.uiTools.setIsOnWorkArea(true);
            root.fileController.copyCommands();
        },
        clickCutCommands: function (event) {
            event.stopPropagation();
            root.uiTools.setIsOnWorkArea(true);
            root.fileController.cutCommands();
        },
        clickPasteCommands: function (event) {
            event.stopPropagation();
            root.uiTools.setIsOnWorkArea(true);
            root.fileController.pasteCommands();

            workArea.syncCommands();
        },
        clickPlayFromHere: function (event) {
            event.stopPropagation();
            root.uiTools.setIsOnWorkArea(true);
            let recordIdText = root.fileController.getSelectedRecords()[0];
            if (recordIdText) {
                root.recorder.detach();
                let index = parseInt(recordIdText.split("-")[1]);
                root.recorder.isRecord = false;
                root.playback.isPlay = true;
                root.playback.doPlay(0, index);

                toolBar.syncButtonState();
            }
        },
        clickToggleBreakpoint: function (event) {
            event.stopPropagation();
            root.uiTools.setIsOnWorkArea(true);
            let index = parseInt(root.fileController.getSelectedRecord().split("-")[1]);
            root.fileController.toggleRecordBreakpoint(
                root.fileController.getSelectedCases()[0], index
            );

            workArea.syncCommands();
        },
        clickClearRecordsStatus: function (event) {
            event.stopPropagation();
            root.uiTools.setIsOnWorkArea(true);
            let caseIdText = root.fileController.getSelectedCases()[0];
            let records = root.fileController.getRecords(caseIdText);
            let caseEle = root.fileController.getTestCase(caseIdText);
            root.fileController.clearIncludedRecords(records);
            root.fileController.clearRecordsStatus(["status", "snapshot"], records, true);
            root.fileController.setFileStatus(caseEle, "default");
            root.snapshot.resizeAllSnapshots();
            workArea.syncCommands();
            fileList.syncFiles();
        },
        clickSnapshotImage: function (snapshotIdText, recordName = "") {
            workArea.syncSnapshotModal("image",
                root.snapshot.getSnapshotObj(snapshotIdText).url, recordName);
        },
        clickSnapshotVideo: async function () {
            await root.snapshot.createSnapshotVideo();
            let url = root.fileController.getScreenshotVideo();
            let curReport = root.report.getCurrentReport();
            let subtitle = curReport ? curReport.title : "";
            workArea.syncSnapshotModal("video", url, subtitle);
        },
        clickBreakpoint: function (caseIdText, index) {
            root.fileController.toggleRecordBreakpoint(caseIdText, index);
            workArea.syncCommands();
        },
        clickWorkArea: function (event) {
            event.stopPropagation();
            root.uiTools.setIsOnWorkArea(true);
        }
    },
    
};
