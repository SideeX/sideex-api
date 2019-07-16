import { browser } from "webextension-polyfill-ts";

export default {
    toolBar: {
        clickPlayButton: function (mode) {
            console.log(mode);
            Panel.recorder.isRecord = false;
            Panel.playback.isPlay = true;
            Panel.recorder.detach();
            switch (mode) {
                case "Play this case": {
                    Panel.playback.doPlay(0, 0); // Playback.PLAY_CASE
                    break;
                }
                case "Play this suite": {
                    Panel.playback.doPlay(1, 0); // Playback.PLAY_SUITE
                    break;
                }
                case "Play all suites": {
                    Panel.playback.doPlay(2, 0); // Playback.PLAY_ALL_SUITES
                    break;
                }
            }
            EntryPoint.toolBar.syncButtonState();
        },
        clickRecordButton: function () {
            Panel.recorder.isRecord = !Panel.recorder.isRecord;
            if (Panel.recorder.isRecord) {
                console.log("Recording");
                Panel.recorder.attach();
                Panel.recorder.notificationCount = 0;
                Panel.recorder.prepareRecord();

                Panel.recorder.isRecord = true;
            } else {
                console.log("Stop");
                Panel.recorder.detach();
                Panel.recorder.isRecord = false;
            }
            EntryPoint.toolBar.syncButtonState();
            EntryPoint.fileList.syncFiles();
        },
        clickStopButton: function () {
            Panel.playback.stop();

            Panel.playback.isPlay = false;
            EntryPoint.toolBar.syncButtonState();
        },
        clickPauseButton: function () {
            Panel.playback.pause();

            Panel.playback.isPlay = false;
            Panel.playback.isPause = true;
            EntryPoint.toolBar.syncButtonState();
        },
        clickResumeButton: function () {
            Panel.playback.resume();

            Panel.playback.isPlay = true;
            Panel.playback.isPause = false;
            EntryPoint.toolBar.syncButtonState();
        },
        clickSettingButton: function () {
            browser.runtime.openOptionsPage();
        },
        changeSpeed: function (value) {
            Panel.setting.set({ delay: 500 * (5 - value) });
            EntryPoint.toolBar.updateSpeed(parseInt(value));
        }

    },
    //NOTE: 1. define func in var-crtler? 2. object or parameter? 3. local var? 4. logconsole in entrypoint?
    variables: {
        add: (name, value) => {
            Panel.variables.addVariable(name, value);
        },
        get: (target) => {
            switch (target) {
                case "count":
                    return Panel.variables.getVarNum();
                case "startNum":
                    return Panel.variables.globalVars.startNum;
                case "varNames":
                    return Panel.variables.globalVars.varNames;
                case "vars":
                    return Panel.variables.globalVars.vars;
                default:
                    break;
            }
        },
        //NOTE: (name)?
        delete: (varIdText) => {
            Panel.variables.deleteVariable(varIdText); //"var-0"
        },
        //NOTE: UI: setModal ?
        clearAll: () => {
            Panel.variables.clearVariables();
        },
        changeName: (varIdText, name) => {
            if (varIdText)
                Panel.variables.updateVarName(varIdText, name);
        },
        changeValue: (varIdText, value) => {
            if (varIdText)
                Panel.variables.updateVarValue(varIdText, value);
        }
    },
    recorder: {
        start: () => {
            console.log("Recording");
            Panel.recorder.attach();
            Panel.recorder.notificationCount = 0;
            Panel.recorder.prepareRecord();
            Panel.recorder.isRecord = true;

            EntryPoint.toolBar.syncButtonState();
            EntryPoint.fileList.syncFiles();
        },
        stop: () => {
            console.log("Stop");
            Panel.recorder.detach();
            Panel.recorder.isRecord = false;

            EntryPoint.toolBar.syncButtonState();
            EntryPoint.fileList.syncFiles();
        }
    }
};
