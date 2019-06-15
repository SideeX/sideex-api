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
    let sendString = false;
    let tempElement = "";
    let sendKeysAttribute = ["text", "password", "email", "url", "search", "tel", "number"];
    function triggerKeyEvent(element, eventType, keySequence, canBubble, controlKeyDown, altKeyDown, shiftKeyDown) {
        let charCode = (eventType == 'keypress') ? keySequence.charCode : 0;
        let keyCode = (eventType == 'keypress') ? keySequence.charCode : keySequence.keyCode;
        let which = (eventType == 'keypress') ? keySequence.charCode : keySequence.which;
        let event = document.createEvent('Event');
        event.initEvent(eventType, true, true);
        event.view = window;
        event.altKey = altKeyDown;
        event.ctrlKey = controlKeyDown;
        event.shiftKey = shiftKeyDown;
        event.keyCode = keyCode;
        event.which = which;
        event.charCode = charCode;
        event.code = keySequence.code;
        event.key = keySequence.key;
        event.bubbles = true;
        element.dispatchEvent(event);
    }

    function triggerInputEvent(element, eventType, data) {
        let event;
        event = document.createEvent('Event');
        event.initEvent(eventType, true, true);
        event.view = window;
        event.data = data.data;
        element.dispatchEvent(event);
    }

    function findElement(locator) {
        switch (locator.type) {
            case 'id':
                return document.querySelector('#' + locator.string);
            case 'link': {
                return Array.from(document.getElementsByTagName("A")).find(link => link.textContent == locator.string);
            }
            case 'name':
                return document.getElementsByName(locator.string)[0];
            case 'css':
                return document.querySelector(locator.string);
            case 'implicit':
                return document.evaluate(locator.string, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            default:
                return null;
        }
    }

    window.addEventListener("message", function (event) {
        if (event.source == window && event.data && event.data.direction == "from-sendkeys") {
            let element = tempElement;
            if (sendString) {
                element = findElement(event.data.element);
            }
            if (event.data.keys == "") {
                //element.value = "";
                sendString = true;
                tempElement = element;
                return;
            }

            if ('string' == typeof event.data.keys) {
                if (event.data.keys == "sendkeyEnd") {
                    let evt = document.createEvent('Event');
                    evt.initEvent('change', true, false);
                    element.dispatchEvent(evt);
                    sendString = false;
                    tempElement = "";
                } else {
                    triggerInputEvent(element, 'textInput', event.data.keys);
                    triggerInputEvent(element, 'input', event.data.keys);
                    //element.value += event.data.keys;
                }
            } else if (event.data.keys.charCode != 0 && event.data.keys.keyCode != 13) {
                if (sendKeysAttribute.indexOf(element.type) >= 0) {
                    if (!event.data.repeat) {
                        //element.value += event.data.keys.data;
                    }
                    triggerKeyEvent(element, 'keydown', event.data.keys);
                    triggerKeyEvent(element, 'keypress', event.data.keys);
                    triggerInputEvent(element, 'textInput', event.data.keys);
                    triggerInputEvent(element, 'input', event.data.keys);
                    triggerKeyEvent(element, 'keyup', event.data.keys);
                } else {
                    //element.value = event.data.keys.data;
                }
            } else {
                if (event.data.keys.keyCode == 13 && event.data.keys.press) {
                    triggerKeyEvent(element, 'keydown', event.data.keys);
                    triggerKeyEvent(element, 'keypress', event.data.keys);
                    triggerKeyEvent(element, 'keyup', event.data.keys);
                } else {
                    triggerKeyEvent(element, 'keydown', event.data.keys);
                    triggerKeyEvent(element, 'keyup', event.data.keys);
                }
            }
        }
    });

    // for webdriver to save to global
    if (typeof window.sideex !== 'undefined') {
        window.sendKeysAttribute = sendKeysAttribute;
        window.triggerKeyEvent = triggerKeyEvent;
        window.triggerInputEvent = triggerInputEvent;
        window.findElement = findElement;
    }
})();
