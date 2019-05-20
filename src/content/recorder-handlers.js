/* eslint-disable no-redeclare */
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
    
    //drop
    Recorder.addEventHandler('dragAndDropToObject', 'dragstart', function(event) {
        var self = this;
        this.dropLocator = setTimeout(function() {
            self.dragstartLocator = event;
        }.bind(this), 200);
    }, true);

    Recorder.addEventHandler('dragAndDropToObject', 'drop', function(event) {
        clearTimeout(this.dropLocator);
        if (this.dragstartLocator && event.button == 0 && this.dragstartLocator.target !== event.target) {
            //value no option
            this.record("dragAndDropToObject", this.locatorBuilders.buildAll(this.dragstartLocator.target), this.locatorBuilders.build(event.target));
        }
        delete this.dragstartLocator;
        delete this.selectMousedown;
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

    //mouseout
    Recorder.addEventHandler('mouseOut', 'mouseout', function(event) {
        if (this.mouseoutLocator !== null && event.target === this.mouseoutLocator) {
            this.record("mouseOut", this.locatorBuilders.buildAll(event.target), '');
        }
        delete this.mouseoutLocator;
    }, true);
















    Recorder.addEventHandlerVar("enterTarget", null);
    Recorder.addEventHandlerVar("enterValue", null);
    Recorder.addEventHandlerVar("tabCheck", null);
    Recorder.addEventHandlerVar("preventType", false);
    Recorder.addEventHandlerVar("typelock", 0);
    Recorder.addEventHandlerVar("focusValue", null);
    Recorder.addEventHandlerVar("tempValue", null);
    Recorder.addEventHandlerVar("typeTarget", null);
    Recorder.inputTypes = ["text", "password", "file", "datetime", "datetime-local", "date", "month", "time", "week", "number", "range", "email", "url", "search", "tel", "color"];
    Recorder.addEventHandler('sendKeys', 'keydown', function (event) {
        if (event.target.tagName) {
            var key = event.keyCode;
            var tagName = event.target.tagName.toLowerCase();
            var type = event.target.type;
            if (tagName == 'input' && Recorder.inputTypes.indexOf(type) >= 0) {
                if (key == 13) {
                    this.enterTarget = event.target;
                    this.enterValue = this.enterTarget.value;
                    var tempTarget = event.target.parentElement;
                    var formChk = tempTarget.tagName.toLowerCase();
                    //console.log(tempValue + " " + enterTarget.value + " " + tabCheck + " " + enterTarget + " " + focusValue);
                    console.log(this.focusValue);
                    console.log(this.enterTarget.value);
                    if (this.tempValue == this.enterTarget.value && this.tabCheck == this.enterTarget) {
                        this.record("sendKeys", this.locatorBuilders.buildAll(enterTarget), "${KEY_ENTER}");
                        this.enterTarget = null;
                        this.preventType = true;
                    } else if (this.focusValue == this.enterTarget.value) {
                        while (formChk != 'form' && formChk != 'body') {
                            tempTarget = tempTarget.parentElement;
                            formChk = tempTarget.tagName.toLowerCase();
                        }
                        if (formChk == 'form' && (tempTarget.hasAttribute("id") || tempTarget.hasAttribute("name")) && (!tempTarget.hasAttribute("onsubmit"))) {
                            if (tempTarget.hasAttribute("id"))
                                this.record("submit", [["id=" + tempTarget.id]], "");
                            else if (tempTarget.hasAttribute("name"))
                                this.record("submit", [["name=" + tempTarget.name]], "");
                        } else
                            this.record("sendKeys", this.locatorBuilders.buildAll(this.enterTarget), "${KEY_ENTER}");
                        this.enterTarget = null;
                    }
                    if (this.typeTarget.tagName && !this.preventType && (this.typeLock = 1)) {
                        // END
                        var tagName = this.typeTarget.tagName.toLowerCase();
                        var type = this.typeTarget.type;
                        if ('input' == tagName && Recorder.inputTypes.indexOf(type) >= 0) {
                            if (this.typeTarget.value.length > 0) {
                                this.record("type", this.locatorBuilders.buildAll(this.typeTarget), this.typeTarget.value);

                                // © Chen-Chieh Ping, SideeX Team
                                if (this.enterTarget != null) {
                                    var tempTarget = this.typeTarget.parentElement;
                                    var formChk = tempTarget.tagName.toLowerCase();
                                    while (formChk != 'form' && formChk != 'body') {
                                        tempTarget = tempTarget.parentElement;
                                        formChk = tempTarget.tagName.toLowerCase();
                                    }
                                    if (formChk == 'form' && (tempTarget.hasAttribute("id") || tempTarget.hasAttribute("name")) && (!tempTarget.hasAttribute("onsubmit"))) {
                                        if (tempTarget.hasAttribute("id"))
                                            this.record("submit", [
                                                ["id=" + tempTarget.id, "id"]
                                            ], "");
                                        else if (tempTarget.hasAttribute("name"))
                                            this.record("submit", [
                                                ["name=" + tempTarget.name, "name"]
                                            ], "");
                                    } else
                                        this.record("sendKeys", this.locatorBuilders.buildAll(this.enterTarget), "${KEY_ENTER}");
                                    this.enterTarget = null;
                                }
                                // END
                            } else {
                                this.record("type", this.locatorBuilders.buildAll(this.typeTarget), this.typeTarget.value);
                            }
                        } else if ('textarea' == tagName) {
                            this.record("type", this.locatorBuilders.buildAll(this.typeTarget), this.typeTarget.value);
                        }
                    }
                    this.preventClick = true;
                    setTimeout(function () {
                        this.preventClick = false;
                    }, 500);
                    setTimeout(function () {
                        if (this.enterValue != event.target.value) this.enterTarget = null;
                    }, 50);
                }

                var tempbool = false;
                if ((key == 38 || key == 40) && event.target.value != '') {
                    if (focusTarget != null && focusTarget.value != this.tempValue) {
                        tempbool = true;
                        this.tempValue = focusTarget.value;
                    }
                    if (tempbool) {
                        this.record("type", this.locatorBuilders.buildAll(event.target), this.tempValue);
                    }

                    setTimeout(function () {
                        this.tempValue = focusTarget.value;
                    }, 250);

                    if (key == 38) this.record("sendKeys", this.locatorBuilders.buildAll(event.target), "${KEY_UP}");
                    else this.record("sendKeys", this.locatorBuilders.buildAll(event.target), "${KEY_DOWN}");
                    this.tabCheck = event.target;
                }
                if (key == 9) {
                    if (this.tabCheck == event.target) {
                        this.record("sendKeys", this.locatorBuilders.buildAll(event.target), "${KEY_TAB}");
                        this.preventType = true;
                    }
                }
            }
        }
    }, true);

    Recorder.addEventHandler('contextMenu', 'contextmenu', function(event) {
        var myPort = browser.runtime.connect();
        var tmpText = this.locatorBuilders.buildAll(event.target);
        var tmpVal = Utils.getText(event.target);
        var tmpTitle = Utils.normalizeSpaces(event.target.ownerDocument.title);
        var self = this;
        myPort.onMessage.addListener(function portListener(m) {
            if (m.cmd.includes("Text")) {
                self.record(m.cmd, tmpText, tmpVal);
            } else if (m.cmd.includes("Title")) {
                self.record(m.cmd, [[tmpTitle]], '');
            } else if (m.cmd.includes("Value")) {
                self.record(m.cmd, tmpText, getInputValue(event.target));
            }
            myPort.onMessage.removeListener(portListener);
        });
    }, true);

    Recorder.addEventHandler('type', 'input', function(event) {
        //console.log(event.target);
        this.typeTarget = event.target;
    });




}
