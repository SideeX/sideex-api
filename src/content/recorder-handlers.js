/**
 * Copyright 2017 SideeX committers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { browser } from "webextension-polyfill-ts";
import { Recorder } from "./recorder";
import { Utils } from "../common/utils";

export function recorderHandlersInit() {
    Recorder.addEventHandlerVar("preventClick", false);
    Recorder.addEventHandlerVar("preventClickTwice", false);
    Recorder.addEventHandler('clickAt', 'click', function(event) {
        if (event.button == 0 && !this.preventClick && event.isTrusted) {
            if (!this.preventClickTwice) {
                var top = event.pageY,
                    left = event.pageX;
                var element = event.target;
                do {
                    top -= element.offsetTop;
                    left -= element.offsetLeft;
                    element = element.offsetParent;
                } while (element);
                this.record("clickAt", this.locatorBuilders.buildAll(event.target), left + ',' + top);
                this.preventClickTwice = true;
            }
            setTimeout(function() { this.preventClickTwice = false; }, 30);
        }
    }, true);
    
    //double click
    Recorder.addEventHandler('doubleClickAt', 'dblclick', function(event) {
        var top = event.pageY,
            left = event.pageX;
        var element = event.target;
        do {
            top -= element.offsetTop;
            left -= element.offsetLeft;
            element = element.offsetParent;
        } while (element);
        this.record("doubleClickAt", this.locatorBuilders.buildAll(event.target), left + ',' + top);
    }, true);
}

