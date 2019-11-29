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
import { browser } from "webextension-polyfill-ts";

import { MessageController } from '../../../content/message-controller';
import { FileController } from '../IO/file-controller';
import { BackgroundRecorder } from './recorder';
import { Playback } from './playback';
import { VariableController } from './variable-controller';
import { UiTools } from '../UI/uiTools';
import { Setting } from "./setting";
import { Log } from './log';
// export { SideeX } from './api';
export const root = { isDOMBased: true, isExt: true };


root.messageController = new MessageController(root);
root.fileController = new FileController(root);
root.recorder = new BackgroundRecorder(root);
root.playback = new Playback(root);
root.variables = new VariableController(root);
root.uiTools = new UiTools(root);
root.log = new Log(root);
root.setting = new Setting(root);
// export const sideex = new SideeX(root);

MessageController.addListener(root.recorder.contentWindowIdListener);
MessageController.addListener(root.recorder.handleFormatCommand);

window.addEventListener("beforeunload", (event) => {
    (event || window.event).returnValue = false;
});
