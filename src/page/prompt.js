/*
 * Copyright SideeX committers
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

(function () {
    let originalPrompt = window.prompt;

    let nextPromptResult = false;
    let recordedPrompt = null;

    let originalConfirmation = window.confirm;
    let nextConfirmationResult = false;
    let recordedConfirmation = null;

    let originalAlert = window.alert;
    let recordedAlert = null;

    function postMessageToContentEnv(data = {}) {
        data.from = "sideex-page-env";
        window.postMessage(data, "*");
    }

    window.prompt = function (text, defaultText) {
        if (document.documentElement.hasAttribute("setPrompt")) {
            recordedPrompt = text;
            document.documentElement.removeAttribute("setPrompt");
            return nextPromptResult;
        } else {
            let result = originalPrompt(text, defaultText);
            postMessageToContentEnv({
                type: "record",
                args: {
                    recordedType: "prompt",
                    recordedMessage: text,
                    recordedResult: result
                }
            });
            return result;
        }
    };
    window.confirm = function (text) {
        if (document.documentElement.hasAttribute("setConfirm")) {
            recordedConfirmation = text;
            document.body.removeAttribute("setConfirm");
            return nextConfirmationResult;
        } else {
            let result = originalConfirmation(text);
            postMessageToContentEnv({
                type: "record",
                args: {
                    recordedType: "confirm",
                    recordedMessage: text,
                    recordedResult: result
                }
            });
            return result;
        }
    };
    window.alert = function (text) {
        if (document.documentElement.hasAttribute("SideeXPlayingFlag")) {
            recordedAlert = text;
            postMessageToContentEnv({
                type: "response",
                args: {
                    responsedType: "alert",
                    value: recordedAlert
                }
            });
            return;
        } else {
            let result = originalAlert(text);
            postMessageToContentEnv({
                type: "record",
                args: {
                    recordedType: "alert",
                    recordedMessage: text,
                    recordedResult: result
                }
            });
            return result;
        }
    };

    window.addEventListener("message", function (event) {
        if (event.source == window && event.data && event.data.from == "sideex-content-env") {
            switch (event.data.type) {
                case "command":
                    switch (event.data.args.commandType) {
                        case "setNextPromptResult":
                            nextPromptResult = event.data.args.target;
                            document.documentElement.setAttribute("setPrompt", true);
                            postMessageToContentEnv({
                                type: "response",
                                args: {
                                    responsedType: "prompt"
                                }
                            });
                            break;
                        case "getPromptMessage":
                            result = recordedPrompt;
                            recordedPrompt = null;
                            postMessageToContentEnv({
                                type: "response",
                                args: {
                                    responsedType: "prompt",
                                    value: result
                                }
                            });
                            break;
                        case "setNextConfirmationResult":
                            nextConfirmationResult = event.data.args.target;
                            document.documentElement.setAttribute("setConfirm", true);
                            postMessageToContentEnv({
                                type: "response",
                                args: {
                                    responsedType: "confirm"
                                }
                            });
                            break;
                        case "getConfirmationMessage":
                            result = recordedConfirmation;
                            recordedConfirmation = null;
                            postMessageToContentEnv({
                                type: "response",
                                args: {
                                    responsedType: "confirm",
                                    value: result
                                }
                            });
                            break;
                        case "setNextAlertResult":
                            nextAlertResult = event.data.args.target;
                            document.documentElement.setAttribute("setAlert", true);
                            postMessageToContentEnv({
                                type: "response",
                                args: {
                                    responsedType: "alert"
                                }
                            });
                            break;
                    }
                    break;
                default:
                    break;
            }
        }
    });
})();
