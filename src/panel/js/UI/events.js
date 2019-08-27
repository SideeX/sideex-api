import { browser } from "webextension-polyfill-ts";
import { root } from "../background/initial";
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
};
