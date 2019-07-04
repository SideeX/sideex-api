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
'use strict';

class AutoWait {

    constructor() {
        this.startTime = 0;
        this.waitErrType = "";
    }

    doAutoWaitPreprocessing() {
        this.clearXHRInstance();

        let _send = window.XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.send = function () {
            window.ajax_obj.push(this);
            return _send.apply(this, arguments);
        };
    }

    clearXHRInstance() {
        window.ajax_obj = [];
    }

    checkAjaxWait() {
        if (window.ajax_obj.length == 0) {
            return true;
        } else {
            for (const obj of window.ajax_obj) {
                // if readyState is 1~3, then keep waiting
                switch (obj.readyState) {
                    case 1:
                    case 2:
                        return false;
                    case 3:
                        continue;
                    default:
                        break;
                }
                this.removeArrayItem(window.ajax_obj, obj);
                console.log(window.ajax_obj);
            }
            return true;
        }
    }

    async checkPageWaitLoop() {
        this.waitErrType = "pageWait";
        while (true) {
            let response = window.document.readyState == "complete";
            if (this.startTime != 0 && (Date.now() - this.startTime) > AutoWait.PAGE_WAIT_TIMEOUT) {
                this.startTime = 0;
                if (typeof window.sideexDone !== 'undefined') {
                    window.sideexDone(false);
                }
                return false;
            } else if (response) {
                this.startTime = 0;
                return true;
            } else {
                if (this.startTime == 0) {
                    this.startTime = Date.now();
                }
                await this.delay(30);
                continue;
            }
        }
    }

    async checkAjaxWaitLoop() {
        this.waitErrType = "ajaxWait";
        while (true) {
            let response = this.checkAjaxWait();
            if (this.startTime != 0 && (Date.now() - this.startTime) > AutoWait.COMMAND_WAIT_TIMEOUT) {
                this.startTime = 0;
                return false;
            } else if (response) {
                this.startTime = 0;
                return true;
            } else {
                if (this.startTime == 0) {
                    this.startTime = Date.now();
                }
                await this.delay(1000);
                continue;
            }
        }
    }

    async checkDOMWait(preWaitTime) {
        this.waitErrType = "DOMWait";
        await this.delay(preWaitTime);
        return true;
    }

    async delay(time) {
        await new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }

    removeArrayItem(array, item) {
        var index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array;
    }

    static get PAGE_WAIT_TIMEOUT() {
        return 30000;
    }

    static get COMMAND_WAIT_TIMEOUT() {
        return 10000;
    }
}

window.autoWait = new AutoWait;

autoWait.doAutoWaitPreprocessing();

window.addEventListener("unload", autoWait.clearXHRInstance, false);

window.addEventListener("message", async function (event) {
    if (event.source == window && event.data) {
        if (event.data.direction == "from-content-playback-auto-wait") {
            let type = event.data.type;
            let result = false;
            result = await autoWait.checkPageWaitLoop();
            result = result && await autoWait.checkAjaxWaitLoop();
            result = result && await autoWait.checkDOMWait();

            window.postMessage({
                direction: "from-page-playback-auto-wait",
                type: type,
                result: result
            }, "*");

        }
    }
});
