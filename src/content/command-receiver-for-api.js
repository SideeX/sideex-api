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
import TargetSelecter from "./targetSelecter";
import { sideex, locatorBuilders, browserBot, recorder} from "./content-initialization";
import { MessageController } from "../content/message-controller";

var targetSelecter = null;
MessageController.addListener(async function doCommands(request) {
    // console.log(request);
    // request = request.data;
    switch (request.action) {
        case "Wait": {
            await sideex.doAutoWait(request.command, request.value);
            return {};
        }
        case "Command": {
            // console.log("command", request.command);
            let command = request.command;
            let value = request.value;
            if (sideex.hasCommand(command)) {
                document.documentElement.setAttribute("SideeXPlayingFlag", true);
                let target = await sideex.doVerifyLocator(request);
                try {
                    await sideex.doCommand(command, target, value);
                } catch (e) {
                    console.error(command + " failed\n", e.stack);
                    document.documentElement.removeAttribute("SideeXPlayingFlag");
                    return { status: false, message: e.message };
                }
            } else {
                return { result: "Unknown command: " + command };
            }
            // Command success
            document.documentElement.removeAttribute("SideeXPlayingFlag");
            return { status: true };
        }
        case "SelectElement": {
            // console.log("selectelement");
            if (request.selecting) {
                targetSelecter = new TargetSelecter(function (element, win) {
                    if (element && win) {
                        //var locatorBuilders = new LocatorBuilders(win);
                        var target = locatorBuilders.buildAll(element);
                        locatorBuilders.detach();
                        if (target != null && target instanceof Array) {
                            if (target) {
                                //self.editor.treeView.updateCurrentCommand('targetCandidates', target);
                                MessageController.runtimeSendMessage({
                                    selectTarget: true,
                                    target: target
                                });
                            } else {
                                //alert("LOCATOR_DETECTION_FAILED");
                            }
                        }
                    }
                    targetSelecter = null;
                }, async function () {
                    await MessageController.runtimeSendMessage({
                        cancelSelectTarget: true
                    });
                });
            } else {
                if (targetSelecter) {
                    targetSelecter.cleanup();
                    targetSelecter = null;
                    return {};
                }
            }
            return {};
        }
        case "ShowElement": {
            try {
                let element = browserBot.findElement(request.targetValue.value);
                await sideex.doShowElement(element, request.customHtml);
                await sideex.doConcealElement(500);
                return { result: true };
            } catch (error) {
                return { result: false };
            }
        }
        case "AttachRecorder": {
            recorder.attach();
            return {};
        }
        case "DetachRecorder": {
            recorder.detach();
            return {};
        }
        // default:
            // throw new Error("Action not found");
    }
});

