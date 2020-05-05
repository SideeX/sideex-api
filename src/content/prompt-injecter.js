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
import { browserBot } from "./content-initialization";
let script = document.createElement('script');
script.src = browser.runtime.getURL('page/prompt.js');
script.onload = script.remove;

window.addEventListener("message", function (event) {
    if (event.source == window && event.data && event.data.from == "sideex-page-env") {
        switch (event.data.type) {
            case "record":
                switch (event.data.args.recordedType) {
                    case "prompt":
                        if (event.data.args.recordedResult != null) {
                            recorder.record("answerOnNextPrompt", [[event.data.args.recordedResult]], "", true);
                        } else {
                            recorder.record("chooseCancelOnNextPrompt", [[""]], "", true);
                        }
                        recorder.record("assertPrompt", [[event.data.args.recordedMessage]], "", false);
                        break;
                    case "confirm":
                        if (event.data.args.recordedResult == true) {
                            recorder.record("chooseOkOnNextConfirmation", [[""]], "", true);
                        } else {
                            recorder.record("chooseCancelOnNextConfirmation", [[""]], "", true);
                        }
                        recorder.record("assertConfirmation", [[event.data.args.recordedMessage]], "", false);
                        break;
                    case "alert":
                        //record("answerOnNextAlert",[[event.data.args.recordedResult]],"",true);
                        recorder.record("assertAlert", [[event.data.args.recordedMessage]], "", false);
                        break;
                }
                break;
            case "response":
                switch (event.data.args.responsedType) {
                    case "prompt":
                        browserBot.promptResponse = true;
                        if (event.data.args.value)
                            browserBot.promptMessage = event.data.args.value;
                        break;
                    case "confirm":
                        browserBot.confirmationResponse = true;
                        if (event.data.args.value)
                            browserBot.confirmationMessage = event.data.args.value;
                        break;
                    case "alert":
                        browserBot.alertResponse = true;
                        if (event.data.args.value)
                            browserBot.alertMessage = event.data.args.value;
                        break;
                }
                break;
            default:
                break;
        }
    }
});
