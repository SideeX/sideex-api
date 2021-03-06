/**
 * Copyright SideeX committers
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
import { Recorder } from "./recorder";
import { Utils } from "../utils/index";
import { MessageController } from "../content/message-controller";

export function recorderHandlersInit() {
    Recorder.addEventHandlerVar("preventClick", false);
    Recorder.addEventHandlerVar("preventClickTwice", false);

    //click
    Recorder.addEventHandler('clickAt', 'click', function (event) {
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
            setTimeout(function () { self.preventClickTwice = false; }, 30);
        }
    }, true);

    //double click
    Recorder.addEventHandler('doubleClickAt', 'dblclick', function (event) {
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
    Recorder.addEventHandler('mouseOver', 'mouseover', function (event) {
        if (window.document.documentElement) {
            this.nowNode = window.document.documentElement.getElementsByTagName('*').length;
            console.log("pass");
        }
        var self = this;
        if (this.pageLoaded === true) {
            var clickable = this.findClickableElement(event.target);
            if (clickable) {
                this.nodeInsertedLocator = event.target;
                this.nodeInsertedLocator = event.target;
                setTimeout(function () {
                    delete self.nodeInsertedLocator;
                }.bind(self), 500);

                this.nodeAttrChange = this.locatorBuilders.buildAll(event.target);
                this.nodeAttrChangeTimeout = setTimeout(function () {
                    delete self.nodeAttrChange;
                }.bind(self), 10);
            }
            //drop target overlapping
            if (this.mouseoverQ) { //mouse keep down
                if (this.mouseoverQ.length >= 3)
                    this.mouseoverQ.shift();
                this.mouseoverQ.push(event);
            }
        }
    }, true);
    Recorder.addEventHandler('mouseOver', 'DOMNodeInserted', function (event) {
        if (this.pageLoaded === true && window.document.documentElement.getElementsByTagName('*').length > this.nowNode) {
            var self = this;
            if (this.scrollDetector) {
                //TODO: fix target
                this.record("runScript", [
                    [
                        ["window.scrollTo(0," + window.scrollY + ")"]
                    ]
                ], '');
                this.pageLoaded = false;
                setTimeout(function () {
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
    Recorder.addEventHandler('dragAndDrop', 'mousedown', function (event) {
        var self = this;
        if (event.clientX < window.document.documentElement.clientWidth && event.clientY < window.document.documentElement.clientHeight) {
            this.mousedown = event;
            this.mouseup = setTimeout(function () {
                delete self.mousedown;
            }.bind(this), 200);

            this.selectMouseup = setTimeout(function () {
                self.selectMousedown = event;
            }.bind(this), 200);
        }
        this.mouseoverQ = [];

        if (event.target.nodeName) {
            var tagName = event.target.nodeName.toLowerCase();
            if ('option' == tagName) {
                var parent = event.target.parentNode;
                if (parent.multiple) {
                    var options = parent.options;
                    for (var i = 0; i < options.length; i++) {
                        options[i]._wasSelected = options[i].selected;
                    }
                }
            }
        }
    }, true);
    // END

    // © Shuo-Heng Shih, SideeX Team
    Recorder.addEventHandler('dragAndDrop', 'mouseup', function (event) {
        clearTimeout(this.selectMouseup);
        if (this.selectMousedown) {
            let x = event.clientX - this.selectMousedown.clientX;
            let y = event.clientY - this.selectMousedown.clientY;

            function getSelectionText() {
                var text = "";
                var activeEl = window.document.activeElement;
                var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
                if (activeElTagName == "textarea" || activeElTagName == "input") {
                    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
                } else if (window.getSelection) {
                    text = window.getSelection().toString();
                }
                return text.trim();
            }

            if (this.selectMousedown && event.button === 0 && (x + y) && (event.clientX < window.document.documentElement.clientWidth && event.clientY < window.document.documentElement.clientHeight) && getSelectionText() === '') {
                var sourceRelateX = this.selectMousedown.pageX - this.selectMousedown.target.getBoundingClientRect().left - window.scrollX;
                var sourceRelateY = this.selectMousedown.pageY - this.selectMousedown.target.getBoundingClientRect().top - window.scrollY;
                var targetRelateX, targetRelateY;
                if (!!this.mouseoverQ.length && this.mouseoverQ[1].relatedTarget == this.mouseoverQ[0].target && this.mouseoverQ[0].target == event.target) {
                    targetRelateX = event.pageX - this.mouseoverQ[1].target.getBoundingClientRect().left - window.scrollX - sourceRelateX;
                    targetRelateY = event.pageY - this.mouseoverQ[1].target.getBoundingClientRect().top - window.scrollY - sourceRelateY;
                    this.record("mouseDownAt", this.locatorBuilders.buildAll(this.selectMousedown.target), sourceRelateX + ',' + sourceRelateY);
                    this.record("mouseMoveAt", this.locatorBuilders.buildAll(this.mouseoverQ[1].target), `{"Movements":[{"TD":0,"OX":${targetRelateX},"OY":${targetRelateY}}]}`);
                    this.record("mouseUpAt", this.locatorBuilders.buildAll(this.mouseoverQ[1].target), targetRelateX + ',' + targetRelateY);
                } else {
                    targetRelateX = event.pageX - event.target.getBoundingClientRect().left - window.scrollX;
                    targetRelateY = event.pageY - event.target.getBoundingClientRect().top - window.scrollY;
                    this.record("mouseDownAt", this.locatorBuilders.buildAll(event.target), targetRelateX + ',' + targetRelateY);
                    this.record("mouseMoveAt", this.locatorBuilders.buildAll(event.target), `{"Movements":[{"TD":0,"OX":${targetRelateX},"OY":${targetRelateY}}]}`);
                    this.record("mouseUpAt", this.locatorBuilders.buildAll(event.target), targetRelateX + ',' + targetRelateY);
                }
            }
        } else {
            delete this.clickLocator;
            delete this.mouseup;
            let x = event.clientX - this.mousedown.clientX;
            let y = event.clientY - this.mousedown.clientY;

            if (this.mousedown && this.mousedown.target !== event.target && !(x + y)) {
                this.record("mouseDown", this.locatorBuilders.buildAll(this.mousedown.target), '');
                this.record("mouseUp", this.locatorBuilders.buildAll(event.target), '');
            } else if (this.mousedown && this.mousedown.target === event.target) {
                //var self = this;
                //var target = this.locatorBuilders.buildAll(this.mousedown.target);
                // setTimeout(function() {
                //     if (!self.clickLocator)
                //         this.record("click", target, '');
                // }.bind(this), 100);
            }

        }
        delete this.mousedown;
        delete this.selectMousedown;
        delete this.mouseoverQ;

    }, true);
    // END
    //drop
    Recorder.addEventHandler('dragAndDropToObject', 'dragstart', function (event) {
        var self = this;
        this.dropLocator = setTimeout(function () {
            self.dragstartLocator = event;
        }.bind(this), 200);
    }, true);

    Recorder.addEventHandler('dragAndDropToObject', 'drop', function (event) {
        clearTimeout(this.dropLocator);
        if (this.dragstartLocator && event.button == 0 && this.dragstartLocator.target !== event.target) {
            //value no option
            this.record("dragAndDropToObject", this.locatorBuilders.buildAll(this.dragstartLocator.target), this.locatorBuilders.build(event.target));
        }
        delete this.dragstartLocator;
        delete this.selectMousedown;
    }, true);
    Recorder.prototype.findClickableElement = function (e) {
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
    Recorder.addEventHandler('mouseOut', 'mouseout', function (event) {
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
                    // console.log(this.focusValue);
                    // console.log(this.enterTarget.value);
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
                        let tagName = this.typeTarget.tagName.toLowerCase();
                        let type = this.typeTarget.type;
                        if ('input' == tagName && Recorder.inputTypes.indexOf(type) >= 0) {
                            if (this.typeTarget.value.length > 0) {
                                this.record("type", this.locatorBuilders.buildAll(this.typeTarget), this.typeTarget.value);

                                // © Chen-Chieh Ping, SideeX Team
                                if (this.enterTarget != null) {
                                    let tempTarget = this.typeTarget.parentElement;
                                    let formChk = tempTarget.tagName.toLowerCase();
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

    Recorder.addEventHandler('contextMenu', 'contextmenu', function (event) {
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
            } else if (m.cmd.includes("Visibility")) {
                self.record(m.cmd, tmpText, tmpVal);
            }
            myPort.onMessage.removeListener(portListener);
        });
    }, true);

    Recorder.addEventHandler('type', 'input', function (event) {
        //console.log(event.target);
        this.typeTarget = event.target;
    });

    //Select Tag
    Recorder.prototype.getOptionLocator = function (option) {
        var label = option.text.replace(/^ *(.*?) *$/, "$1");
        if (label.match(/\xA0/)) { // if the text contains &nbsp;
            return "label=regexp:" + label.replace(/[\(\)\[\]\\\^\$\*\+\?\.\|\{\}]/g, function (str) {
                return '\\' + str;
            })
                .replace(/\s+/g, function (str) {
                    if (str.match(/\xA0/)) {
                        if (str.length > 1) {
                            return "\\s+";
                        } else {
                            return "\\s";
                        }
                    } else {
                        return str;
                    }
                });
        } else {
            return "label=" + label;
        }
    };

    MessageController.runtimeSendMessage({
        attachRecorderRequest: true
    }).catch(() => {
        // Failed silently if receiving end does not exist
    });

    //select / addSelect / removeSelect
    Recorder.addEventHandler('select', 'focus', function (event) {
        if (event.target.nodeName) {
            var tagName = event.target.nodeName.toLowerCase();
            if ('select' == tagName && event.target.multiple) {
                var options = event.target.options;
                for (var i = 0; i < options.length; i++) {
                    if (options[i]._wasSelected == null) {
                        // is the focus was gained by mousedown event, _wasSelected would be already set
                        options[i]._wasSelected = options[i].selected;
                    }
                }
            }
        }
    }, true);

    Recorder.addEventHandler('select', 'change', function (event) {
        if (event.target.tagName) {
            var tagName = event.target.tagName.toLowerCase();
            if ('select' == tagName) {
                if (!event.target.multiple) {
                    var option = event.target.options[event.target.selectedIndex];
                    this.record("select", this.locatorBuilders.buildAll(event.target), this.getOptionLocator(option));
                } else {
                    var options = event.target.options;
                    for (var i = 0; i < options.length; i++) {
                        if (options[i]._wasSelected == null) { }
                        if (options[i]._wasSelected != options[i].selected) {
                            var value = this.getOptionLocator(options[i]);
                            if (options[i].selected) {
                                this.record("addSelection", this.locatorBuilders.buildAll(event.target), value);
                            } else {
                                this.record("removeSelection", this.locatorBuilders.buildAll(event.target), value);
                            }
                            options[i]._wasSelected = options[i].selected;
                        }
                    }
                }
            }
        }
    });
    Recorder.addEventHandlerVar("getEle", null);
    Recorder.addEventHandlerVar("checkFocus", 0);
    Recorder.addEventHandlerVar("contentTest", "");
    Recorder.addEventHandler('editContent', 'focus', function (event) {
        var editable = event.target.contentEditable;
        if (editable == 'true') {
            this.getEle = event.target;
            this.contentTest = this.getEle.innerHTML;
            this.checkFocus = 1;
        }

    }, true);
    Recorder.addEventHandler('editContent', 'blur', function (event) {
        if (this.checkFocus == 1) {
            if (event.target == this.getEle) {
                if (this.getEle.innerHTML != this.contentTest) {
                    //console.log("success");
                    this.record("editContent", this.locatorBuilders.buildAll(event.target), this.getEle.innerHTML);
                }
                this.checkFocus = 0;
            }
        }
    }, true);

}
