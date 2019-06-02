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
import { Utils } from "../common/utils";
import { LocatorBuilders } from "./locatorBuilders";
import { recorderHandlersInit } from "./recorder-handlers";

export class Recorder {
    constructor(window) {
        this.window = window;
        this.attached = false;
        this.locatorBuilders = new LocatorBuilders(window);
        this.frameLocation = this.getFrameLocation();
        browser.runtime.sendMessage({
            frameLocation: this.frameLocation
        }).catch(function () {
            // Failed silently if receiving end does not exist
        });

        this.listenerMap = {};
    }

    initialize() {
        /* scroll, mouseOver */
        this.pageLoaded = true;

        /* scroll */
        this.totalNode = 0;
        this.scrollDetector = false;

        /* mouseOver */
        this.mouseOverElement = {};
        this.mouseOverCache = {};
        this.mouseOverDelayTime = 200;
        this.mouseOverQueue = [];

        /* mouseOut */
        this.mouseOutElements = [];
        this.lastRecordMouseOver = 0;

        /* delete node insert*/
        this.deleteTimestamp = [];

        /* clickAt, mouseOver, dragAndDrop */
        this.mouseDownDetector = false;

        /* sendKeys */
        this.typeRecorded = true;
        this.typeType = "";
        this.typeTagName = "";
        this.enterWithPress = false;
        this.tempEnterPress = false;
        this.submitEvent = false;

        /* pre-wait time calculation */
        this.commandTimestamp = 0;
        this.prevCommandTimestamp = 0;
    }

    // This part of code is copyright by Software Freedom Conservancy(SFC)
    parseEventKey(eventKey) {
        if (eventKey.match(/^C_/)) {
            return { eventName: eventKey.substring(2), capture: true };
        } else {
            return { eventName: eventKey, capture: false };
        }
    }

    // This part of code is copyright by Software Freedom Conservancy(SFC)
    attach() {
        if (this.attached) {
            return;
        }
        this.attached = true;
        this.initialize();
        this.eventListeners = {};
        for (let [eventKey, handlers] of Object.entries(Recorder.eventHandlers)) {
            var eventInfo = this.parseEventKey(eventKey);
            var eventName = eventInfo.eventName;
            var capture = eventInfo.capture;
            this.eventListeners[eventKey] = (event) => {
                for (const handler of handlers) {
                    handler.call(this, event);
                }
            };
            this.window.document.addEventListener(eventName, this.eventListeners[eventKey], capture);
        }

        // Should status should be cleared after detached?
        if (!this.executeOnce) {
            this.executeOnce = true;
            for (let identifier in Recorder.initialVars) {
                if (Recorder.initialVars[identifier].ctor) {
                    let ctor = Recorder.initialVars[identifier].ctor;
                    let args = [null].concat(Recorder.initialVars[identifier].args);
                    let factory = ctor.bind.apply(ctor, args);
                    this[identifier] = new factory();
                } else {
                    this[identifier] = Recorder.initialVars[identifier].value;
                }
            }
        }
    }

    // This part of code is copyright by Software Freedom Conservancy(SFC)
    detach() {
        if (!this.attached) {
            return;
        }
        this.attached = false;
        this.observer.disconnect();
        for (let eventKey in this.eventListeners) {
            var eventInfo = this.parseEventKey(eventKey);
            var eventName = eventInfo.eventName;
            var capture = eventInfo.capture;
            this.window.document.removeEventListener(eventName, this.eventListeners[eventKey], capture);
        }
        delete this.eventListeners;
    }

    getFrameLocation() {
        let currentWindow = window;
        let currentParentWindow;
        let frameLocation = "";
        while (currentWindow !== window.top) {
            currentParentWindow = currentWindow.parent;
            for (let idx = 0; idx < currentParentWindow.frames.length; idx++)
                if (currentParentWindow.frames[idx] === currentWindow) {
                    frameLocation = ":" + idx + frameLocation;
                    currentWindow = currentParentWindow;
                    break;
                }
        }
        return frameLocation = "root" + frameLocation;
    }

    record(command, target, value, insertBeforeLastCommand, actualFrameLocation) {
        if (target.length === 0) {
            target = this.prebuildedTarget;
            this.prebuildedTarget = null;
        }
        let preWaitTime = getPreWaitTime.call(this);
        sendMessageToPanel.call(this, command, preprocessTarget(target), preprocessValue(value),
            preWaitTime, insertBeforeLastCommand, actualFrameLocation);

        /**
         * Calculate pre-wait time
         */
        function getPreWaitTime() {
            let preWaitTime = {
                ajax: 0,
                resource: 0,
                DOM: 0,
                beforeunload: 0
            };
            return preWaitTime;
        }

        function preprocessTarget(target) {
            let temp = [];
            let result = {
                options: [],
                tac: ""
            };
            for (let item of target) {
                temp.push({ type: item[1] ? item[1] : "other", value: item[0] });
            }
            result.options = temp;
            return result;
        }

        function preprocessValue(value) {
            if (typeof value !== "string") return preprocessTarget(value);
            return {
                options: [{
                    type: "other",
                    value:  value
                }],
                tac: ""
            };
        }

        async function sendMessageToPanel(command, target, value, preWaitTime, insertBeforeLastCommand, actualFrameLocation) {
            try {
                console.log(`-> Record: %c${command}`, "color: blue;");
                await browser.runtime.sendMessage({
                    command: command,
                    target: target,
                    value: value,
                    preWaitTime: preWaitTime,
                    insertBeforeLastCommand: insertBeforeLastCommand,
                    frameLocation: (actualFrameLocation != undefined) ? actualFrameLocation : this.frameLocation
                });
            } catch (error) {
                // If receiving end does not exist, detach the recorder
                this.detach();
            }
        }
    }

    static addEventHandlerVar(name, valueOrConstructor, ...args) {
        this.initialVars[name] = {};
        if (valueOrConstructor instanceof Function) {
            this.initialVars[name].ctor = valueOrConstructor;
            this.initialVars[name].args = args;
        } else {
            this.initialVars[name].value = valueOrConstructor;
        }
    }
    static addEventHandler(handlerName, eventName, handler, capture) {
        handler.handlerName = handlerName;
        let key = capture ? ('C_' + eventName) : eventName;
        if (!this.eventHandlers[key]) {
            this.eventHandlers[key] = [];
        }
        this.eventHandlers[key].push(handler);
    }

}

Recorder.eventHandlers = {};
Recorder.initialVars = {};

recorderHandlersInit();
