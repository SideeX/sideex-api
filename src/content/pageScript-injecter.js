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
import { sideex } from "./content-initialization";

const script = document.createElement("script");
script.onload = script.remove;
script.src = browser.runtime.getURL("page_script.js");

window.addEventListener("message", function (event) {
    if (event.source.top == window && event.data) {
        if (event.data.direction == "from-page-runscript") {
            sideex.browserbot.runScriptResponse = true;
            sideex.browserbot.runScriptMessage = event.data.result;
        }
    }
});
