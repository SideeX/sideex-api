/*
* Copyright 2017 SideeX committers
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*/


(function () {
    // for webdriver to save to global
    if (typeof window.sideex !== 'undefined') {
        window.isEnter = false;
    }

    let isEnter = false;

    window.addEventListener("click", function (event) {
        if (!isEnter) {
            if (event.target.getAttribute('type') == 'submit') {
                let tempTarget = event.target.parentElement;
                let formChk = tempTarget.tagName.toLowerCase();
                while (formChk != 'form' && formChk != 'body') {
                    tempTarget = tempTarget.parentElement;
                    formChk = tempTarget.tagName.toLowerCase();
                }
                if (formChk == 'form') {
                    let originalOnsubmit = tempTarget.onsubmit;
                    let originalSubmit = tempTarget.submit;
                    if (tempTarget.onsubmit != null) {
                        tempTarget.onsubmit = function () {
                            let event;
                            event = document.createEvent('Event');
                            event.initEvent('onsubmit', true, true);
                            event.view = window;
                            event.bubbles = true;
                            tempTarget.dispatchEvent(event);
                            originalOnsubmit();
                        };
                    }
                    if (tempTarget.submit != null) {
                        tempTarget.submit = function () {
                            let event;
                            event = document.createEvent('Event');
                            event.initEvent('cleanBuffer', true, true);
                            event.view = window;
                            event.bubbles = true;
                            tempTarget.dispatchEvent(event);
                            originalSubmit.apply(tempTarget);
                        };
                    }
                }
            }
        }
    }, true);

    window.addEventListener("keydown", function (event) {
        if (event.key == "Enter") {
            let tempTarget = event.target.parentElement;
            let formChk = tempTarget.tagName;
            while (["FORM", "BODY", "HTML"].indexOf(formChk) == -1) {
                tempTarget = tempTarget.parentElement;
                formChk = tempTarget.tagName;
            }
            if (formChk == 'FORM') {
                let originalOnsubmit = tempTarget.onsubmit;
                let originalSubmit = tempTarget.submit;
                if (tempTarget.onsubmit != null) {
                    tempTarget.onsubmit = function () {
                        let event;
                        event = document.createEvent('Event');
                        event.initEvent('onsubmit', true, true);
                        event.view = window;
                        event.bubbles = true;
                        tempTarget.dispatchEvent(event);
                        originalOnsubmit();
                    };
                }
                if (tempTarget.submit != null) {
                    tempTarget.submit = function () {
                        let event;
                        event = document.createEvent('Event');
                        event.initEvent('cleanBuffer', true, true);
                        event.view = window;
                        event.bubbles = true;
                        tempTarget.dispatchEvent(event);
                        originalSubmit.apply(tempTarget);
                    };
                }
            }
        }
        isEnter = true;
        setTimeout(() => {
            isEnter = false;
        }, 500);
    }, true);
})();

