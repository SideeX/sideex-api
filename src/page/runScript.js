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
(function () {
    let isWanted = false;
    window.onerror = function (msg) {
        if (isWanted) {
            window.postMessage({
                direction: "from-page-runscript",
                result: msg
            }, "*");
            isWanted = false;
        }
    };
    window.addEventListener("message", function (event) {
        if (event.source == window && event.data && event.data.direction == "from-content-runscript") {
            isWanted = true;
            let doc = window.document;
            let scriptTag = doc.createElement("script");
            scriptTag.type = "text/javascript";
            scriptTag.text = event.data.script;
            doc.body.appendChild(scriptTag);
        }
    });

    // to check if sideex is using webdriver
    if (typeof window.sideex !== 'undefined') {
        window.addEventListener("message", function (event) {
            if (event.source.top == window && event.data && event.data.direction == "from-page-runscript") {
                selenium.browserbot.runScriptResponse = true;
                selenium.browserbot.runScriptMessage = event.data.result;
            }
        });
    }
})();
