/*
 * Copyright SideeX committers
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
var allListeners = [];
var documentListeners = [];
(function () {
    // var allListeners = [];
    var targetExist = [];
    // var documentListeners = [];

    EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype._removeEventListener = EventTarget.prototype.removeEventListener;

    function findElement(locator) {
        return document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function pushListenerIntoArray(element, eventType) {
        if (!targetExist.includes(element)) {
            targetExist.push(element);
            allListeners.push({ 'element': element, 'listeners': new Array() });
        }
        // if (!allListeners[targetExist.indexOf(element)].listeners.includes(eventType)) {
        //     allListeners[targetExist.indexOf(element)].listeners.push(eventType);
        // }
        allListeners[targetExist.indexOf(element)].listeners.push(eventType);
    }

    function removeListenerFromArray(element, eventType) {
        if (allListeners[targetExist.indexOf(element)].listeners.includes(eventType)) {
            var index = allListeners[targetExist.indexOf(element)].listeners.indexOf(eventType);
            allListeners[targetExist.indexOf(element)].listeners.splice(index, 1);
        }
    }

    EventTarget.prototype.addEventListener = function (eventName, eventHandler, c) {
        if (this !== window && this.tagName !== undefined && this.tagName.toLowerCase() != "script") {
            if (this.tagName.toLowerCase() == "body") {
                documentListeners.push(eventName);
            } else {
                if (this.tagName.toLowerCase() != "html" && this.tagName.toLowerCase() != "body") {
                    pushListenerIntoArray(this, eventName);
                }
            }
        } else if (this === document) {
            documentListeners.push(eventName);
        }
        this._addEventListener(eventName, eventHandler, c);
    };

    EventTarget.prototype.removeEventListener = function (eventName, eventHandler, c) {
        if (this !== window && this !== document) {
            if (this.tagName !== undefined && this.tagName.toLowerCase() != "html" && this.tagName.toLowerCase() != "body") {
                if ((targetExist.includes(this)) === true) {
                    removeListenerFromArray(this, eventName);
                }
            }
        }
        this._removeEventListener(eventName, eventHandler, c);
    };

    function handleScriptInlineListeners(element) {
        if (element.onclick !== null) {
            pushListenerIntoArray(element, 'click');
        }
        if (element.onmousemove !== null) {
            pushListenerIntoArray(element, 'mousemove');
        }
        if (element.onmouseover !== null) {
            pushListenerIntoArray(element, 'mouseover');
        }
        if (element.onkeydown !== null) {
            pushListenerIntoArray(element, 'keydown');
        }
        if (element.onkeypress !== null) {
            pushListenerIntoArray(element, 'keypress');
        }
    }

    function handleOwnAttributes(element) {
        let ownPropertyNames = Object.getOwnPropertyNames(element);
        for (let key of ownPropertyNames) {
            var ownAttributes = element[key];
            if (ownAttributes !== null && ownAttributes !== undefined) {
                for (let value of Object.getOwnPropertyNames(ownAttributes)) {
                    if (value.substring(0, 2) == 'on') {
                        let event = value.substring(2).toLowerCase();
                        pushListenerIntoArray(element, event);
                    }
                }
            }
        }
    }
    var observer = new MutationObserver(function (records) {
        for (const record of records) {
            if (record.type === "childList") {
                if (record.addedNodes.length > 0 && record.removedNodes.length == 0) {
                    for (const item of record.addedNodes) {
                        if (item.nodeType != Node.TEXT_NODE && item.nodeName != "SCRIPT" && item.nodeType != Node.COMMENT_NODE) {
                            let allElements = item.getElementsByTagName("*");
                            for (let element of allElements) {
                                handleScriptInlineListeners(element);
                                handleOwnAttributes(element);
                                let attributes = element.attributes;
                                for (let attr of attributes) {
                                    if (attr.name.substring(0, 2) == "on") {
                                        let attributeName = attr.name.substring(2);
                                        pushListenerIntoArray(element, attributeName);
                                    }
                                }
                            }
                        }
                    }
                } else if (record.addedNodes.length == 0 && record.removedNodes.length > 0) {
                    let allElements = record.removedNodes;
                    for (let element of allElements) {
                        let attributes = element.attributes;
                        if (attributes !== undefined) {
                            for (let attr of attributes) {
                                if (attr.name.substring(0, 2) == "on") {
                                    let attributeName = attr.name.substring(2);
                                    removeListenerFromArray(element, attributeName);
                                }
                            }
                        }
                    }
                }
            } else if (record.type == "attributes") {
                if (record.attributeName.substring(0, 2) == "on") {
                    let element = record.target;
                    let attributeName = record.attributeName.substring(2);
                    if (record.oldValue == null) {
                        pushListenerIntoArray(element, attributeName);
                    } else if (record.target.getAttribute(record.attributeName) == null) {
                        removeListenerFromArray(element, attributeName);
                    }
                }
            }
        }
    });
    observer.observe(window.document, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true
    });

    var observeTime = 0;
    window.addEventListener("message", function (event) {
        var exist = false;
        if (event.source == window && event.data && event.data.direction == 'from-content-recorder-mouseover') {
            if (event.data.element == "document") {
                if (documentListeners.includes("mouseover")) {
                    window.postMessage({
                        direction: "from-page-getlistener",
                        result: true,
                        type: 'mouseOver'
                    }, "*");
                } else {
                    for (let i = 0; i < allListeners.length; i++) {
                        if (allListeners[i].element.contains(findElement(event.data.realElement))) {
                            if ((allListeners[i].listeners.includes("mouseover") || allListeners[i].listeners.includes("mouseenter"))) {
                                // return to record
                                exist = true;
                                if (event.data.observeTime != observeTime) {
                                    observeTime = event.data.observeTime;
                                    window.postMessage({
                                        direction: "from-page-getlistener",
                                        result: true,
                                        type: 'mouseOver'
                                    }, "*");
                                    break;
                                }
                            }
                        }
                    }
                }
                return;
            }
            for (let i = 0; i < allListeners.length; i++) {
                if (allListeners[i].element.contains(findElement(event.data.element))) {
                    if ((allListeners[i].listeners.includes("mouseover") || allListeners[i].listeners.includes("mouseenter"))) {
                        // return to record
                        exist = true;
                        if (event.data.observeTime != observeTime) {
                            observeTime = event.data.observeTime;
                            window.postMessage({
                                direction: "from-page-getlistener",
                                result: true,
                                type: 'mouseOver'
                            }, "*");
                            break;
                        }
                    }
                }
            }
            if (!exist) {
                for (let i = 0; i < allListeners.length; i++) {
                    if (allListeners[i].element.contains(findElement(event.data.element))) {
                        if (allListeners[i].listeners.includes("mousemove")) {
                            exist = true;
                            if (event.data.observeTime != observeTime) {
                                observeTime = event.data.observeTime;
                                window.postMessage({
                                    direction: "from-page-getlistener",
                                    result: true,
                                    type: 'mouseMoveAt'
                                }, "*");
                                break;
                            }
                        }
                    }
                }
            }
        }
    });
    window.addEventListener("message", function (event) {
        if (event.source == window && event.data && event.data.direction == 'from-content-recorder-handlers-sendkeys') {
            for (let i = 0; i < allListeners.length; i++) {
                if (allListeners[i].element.isSameNode(findElement(event.data.element))) {
                    if (allListeners[i].listeners.includes("keydown")) {
                        window.postMessage({
                            direction: "from-page-getlistener-sendkeys",
                            result: true,
                            type: 'keydown'
                        }, "*");
                        break;
                    } else if (allListeners[i].listeners.includes("keypress")) {
                        window.postMessage({
                            direction: "from-page-getlistener-sendkeys",
                            result: true,
                            type: 'keypress'
                        }, "*");
                        break;
                    }
                }
            }
        }
    });
})();
