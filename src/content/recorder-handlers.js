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

    //click
    Recorder.addEventHandler('clickAt', 'click', function(event) {
        var self = this;
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
            setTimeout(function() { self.preventClickTwice = false; }, 30);
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

    //mouse over
    Recorder.addEventHandlerVar("nowNode", 0);
    Recorder.addEventHandlerVar("pageLoaded", true);
    Recorder.addEventHandler('mouseOver', 'mouseover', function(event) {
        if (window.document.documentElement)
            {this.nowNode = window.document.documentElement.getElementsByTagName('*').length;
            console.log("pass");
        }
        var self = this;
        if (this.pageLoaded === true) {
            var clickable = this.findClickableElement(event.target);
        if (clickable) {
            this.nodeInsertedLocator = event.target;
                this.nodeInsertedLocator = event.target;
                setTimeout(function() {
                    delete self.nodeInsertedLocator;
                }.bind(self), 500);
            
                this.nodeAttrChange = this.locatorBuilders.buildAll(event.target);
                this.nodeAttrChangeTimeout = setTimeout(function() {
                    delete self.nodeAttrChange;
                }.bind(self), 10);
            }
            //drop target overlapping
            if (this.mouseoverQ) //mouse keep down
            {
                if (this.mouseoverQ.length >= 3)
                    this.mouseoverQ.shift();
                this.mouseoverQ.push(event);
            }
        }
    }, true);
    Recorder.addEventHandler('mouseOver', 'DOMNodeInserted', function(event) {
        if (this.pageLoaded === true && window.document.documentElement.getElementsByTagName('*').length > this.nowNode) {
            var self = this;
            if (this.scrollDetector) {
                //TODO: fix target
                this.record("runScript", [
                    [
                        ["window.scrollTo(0," + window.scrollY + ")", ]
                    ]
                ], '');
                this.pageLoaded = false;
                setTimeout(function() {
                    this.pageLoaded = true;
                }.bind(self), 550);
                delete this.scrollDetector;
                delete this.nodeInsertedLocator;
            }
            if (this.nodeInsertedLocator) {
                this.record("mouseOver", this.locatorBuilders.buildAll(this.nodeInsertedLocator), '');
                this.mouseoutLocator = this.nodeInsertedLocator;
                delete this.nodeInsertedLocator;
                delete this.mouseoverLocator;
            }
        }
    }, true);
    Recorder.prototype.findClickableElement = function(e) {
        if (!e.tagName) return null;
        var tagName = e.tagName.toLowerCase();
        var type = e.type;
        if (e.hasAttribute("onclick") || e.hasAttribute("href") || tagName == "button" ||
            (tagName == "input" &&
                (type == "submit" || type == "button" || type == "image" || type == "radio" || type == "checkbox" || type == "reset"))) {
            return e;
        } else {
            if (e.parentNode != null) {
                return this.findClickableElement(e.parentNode);
            } else {
                return null;
            }
        }
    };
}

