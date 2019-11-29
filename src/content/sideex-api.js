/* eslint-disable no-redeclare */
/*
 * Copyright 2011 Software Freedom Conservancy
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
import sendkeysMap from "./sendkeysMap";
import { Utils } from "../common/utils";
import { PatternMatcher } from "../common/patternMatcher";
import storage from "../common/storage";
import { browser } from "webextension-polyfill-ts";
import { escapeHTML } from "../common/escape.js";
import { MessageController } from "../content/message-controller";

export class Sideex {
    constructor(browserBot) {
        this.browserBot = browserBot;
        this.window = this.browserBot.window;
        this.mouseSpeed = 10;
        this.mouseOverElement = null;
        this.waitForStartTime = 0;
        this.div = "";
        this.wait = {};
        this.window.addEventListener("message", (event) => {
            if (event.source == window && event.data) {
                if (event.data.direction == "from-page-playback-auto-wait") {
                    this.wait.type = event.data.type;
                    this.wait.result = event.data.result;
                }
            }
        });
        this.mouseMove = {};
    }
    hasCommand(command) {
        return Sideex.commands[command] != null;
    }
    async doCommand(command, target, value) {
        return await Sideex.commands[command].call(this, target, value);
    }
    async doAutoWait(type, value) {
        console.log(type);
        console.log(value);
        this.window.postMessage({
            direction: "from-content-playback-auto-wait",
            type: type,
            preWaitTime: value
        }, "*");
        return await this.getWaitResult();
    }
    async getWaitResult() {
        while (Object.keys(this.wait).length == 0) {
            await Utils.delay(10);
        }
        if (this.wait.result) {
            this.wait = {};
            return;
        } else {
            let errorMessage = "";
            switch (this.wait.type) {
                case "pageWait":
                    errorMessage = "Page Wait timed out";
                    break;
                case "ajaxWait":
                    errorMessage = "Ajax Wait timed out";
                    break;
                case "DOMWait":
                    errorMessage = "DOM Wait timed out";
                    break;
            }
            this.wait = {};
            throw errorMessage;
        }
    }

    async doVerifyLocator(commandInfo) {
        let excludedCommand = ["open", "selectWindow", "selectFrame", "close", "assertAlert", "assertConfirmation", "chooseOkOnNextConfirmation",
            "chooseCancelOnNextConfirmation", "assertPrompt", "answerOnNextPrompt", "chooseCancelOnNextPrompt", "echo", "runScript",
            "pause", "store", "storeEval", "storeTitle", "verifyTitle", "assertTitle"];
        if (excludedCommand.includes(commandInfo.command)) {
            return commandInfo.target;
        }
        try {
            let element = this.browserBot.findElement(commandInfo.target);
            await this.doShowElement(element);
            await this.doConcealElement(500);
            return Utils.xpathGenerator(element);
        } catch (e) {
            return commandInfo.target;
        }
    }

    getClientXY(element, coordString) {
        // Parse coordString
        let x = 0;
        let y = 0;
        if (coordString) {
            const coords = coordString.split(/,/);
            x = +coords[0];
            y = +coords[1];
        }
        const r = element.getBoundingClientRect();
        // Get position of element,
        // Return 2 item array with clientX and clientY
        //return [Selenium.prototype.getElementPositionLeft(element) + x, Selenium.prototype.getElementPositionTop(element) + y];
        return [Math.floor(r.left) + x, Math.floor(r.top) + y];
    }

    /** Gets the title of the current page.
     *
     * @return string the title of the current page
     */
    getTitle() {
        return this.browserBot.getTitle();
    }
    /**
     * Gets the (whitespace-trimmed) value of an input field (or anything else with a value parameter).
     * For checkbox/radio elements, the value will be "on" or "off" depending on
     * whether the element is checked or not.
     *
     * @param locator an <a href="#locators">element locator</a>
     * @return string the element value, or "on/off" for checkbox/radio elements
     */
    getValue(locator) {
        var element = this.browserBot.findElement(locator);
        return Utils.getInputValue(element).trim();
    }
    /** Gets the result of evaluating the specified JavaScript snippet.  The snippet may
     * have multiple lines, but only the result of the last line will be returned.
     *
     * <p>Note that, by default, the snippet will run in the context of the "selenium"
     * object itself, so <code>this</code> will refer to the Selenium object.  Use <code>window</code> to
     * refer to the window of your application, e.g. <code>window.document.getElementById('foo')</code></p>
     *
     * <p>If you need to use
     * a locator to refer to a single element in your application page, you can
     * use <code>this.browserBot.findElement("id=foo")</code> where "id=foo" is your locator.</p>
     *
     * @param script the JavaScript snippet to run
     * @return string the results of evaluating the snippet
     */
    getEval(script) {
        try {
            //LOG.info('script is: ' + script);
            var window = this.browserBot.getCurrentWindow();
            var result = eval(script);
            // Selenium RC doesn't allow returning null
            if (null == result)
                return "null";
            return result;
        } catch (e) {
            throw new Utils.SeleniumError("Threw an exception: " + Utils.extractExceptionMessage(e));
        }
    }
    /**
     * Retrieves the horizontal position of an element
     *
     * @param locator an <a href="#locators">element locator</a> pointing to an element OR an element itself
     * @return number of pixels from the edge of the frame.
     */
    getElementPositionLeft(locator) {
        var element;
        if ("string" == typeof locator) {
            element = this.browserBot.findElement(locator);
        } else {
            element = locator;
        }
        var x = element.offsetLeft;
        var elementParent = element.offsetParent;
        while (elementParent != null) {
            if (document.all) {
                if ((elementParent.tagName != "TABLE") && (elementParent.tagName != "BODY")) {
                    x += elementParent.clientLeft;
                }
            } else { // Netscape/DOM
                if (elementParent.tagName == "TABLE") {
                    var parentBorder = parseInt(elementParent.border);
                    if (isNaN(parentBorder)) {
                        var parentFrame = elementParent.getAttribute('frame');
                        if (parentFrame != null) {
                            x += 1;
                        }
                    } else if (parentBorder > 0) {
                        x += parentBorder;
                    }
                }
            }
            x += elementParent.offsetLeft;
            elementParent = elementParent.offsetParent;
        }
        return x;
    }
    /**
     * Retrieves the vertical position of an element
     *
     * @param locator an <a href="#locators">element locator</a> pointing to an element OR an element itself
     * @return number of pixels from the edge of the frame.
     */
    getElementPositionTop(locator) {
        var element;
        if ("string" == typeof locator) {
            element = this.browserBot.findElement(locator);
        } else {
            element = locator;
        }
        var y = 0;
        while (element != null) {
            if (document.all) {
                if ((element.tagName != "TABLE") && (element.tagName != "BODY")) {
                    y += element.clientTop;
                }
            } else { // Netscape/DOM
                if (element.tagName == "TABLE") {
                    var parentBorder = parseInt(element.border);
                    if (isNaN(parentBorder)) {
                        var parentFrame = element.getAttribute('frame');
                        if (parentFrame != null) {
                            y += 1;
                        }
                    } else if (parentBorder > 0) {
                        y += parentBorder;
                    }
                }
            }
            y += element.offsetTop;
            // Netscape can get confused in some cases, such that the height of the parent is smaller
            // than that of the element (which it shouldn't really be). If this is the case, we need to
            // exclude this element, since it will result in too large a 'top' return value.
            if (element.offsetParent && element.offsetParent.offsetHeight && element.offsetParent.offsetHeight < element.offsetHeight) {
                // skip the parent that's too small
                element = element.offsetParent.offsetParent;
            } else {
                // Next up...
                element = element.offsetParent;
            }
        }
        return y;
    }
    /**
     * Retrieves the width of an element
     *
     * @param locator an <a href="#locators">element locator</a> pointing to an element
     * @return number width of an element in pixels
     */
    getElementWidth(locator) {
        var element = this.browserBot.findElement(locator);
        return element.offsetWidth;
    }
    /**
     * Retrieves the height of an element
     *
     * @param locator an <a href="#locators">element locator</a> pointing to an element
     * @return number height of an element in pixels
     */
    getElementHeight(locator) {
        var element = this.browserBot.findElement(locator);
        return element.offsetHeight;
    }
    // Added show element by SideeX comitters (Copyright 2017)
    async doShowElement(element, customHtmlString) {
        try {
            if (document.getElementById("sideexShowElement")) {
                await this.doConcealElement(0);
            }

            let isWindowMove = false;
            let r = element.getBoundingClientRect();
            // move to element
            if (r.right <= 0) {
                window.scrollBy(r.left, 0);
                isWindowMove = true;
            }
            if (r.left >= window.innerWidth) {
                window.scrollBy(r.right - window.innerWidth, 0);
                isWindowMove = true;
            }
            if (r.bottom <= 0) {
                window.scrollBy(0, r.top);
                isWindowMove = true;
            }
            if (r.top >= window.innerHeight) {
                window.scrollBy(0, r.bottom - window.innerHeight);
                isWindowMove = true;
            }
            // update element location
            if (isWindowMove) {
                r = element.getBoundingClientRect();
            }
            let boxElement = document.createElement("div");
            //user config
            if (customHtmlString) {
                boxElement = undefined;
                const parser = new DOMParser();
                const wrapper = parser.parseFromString(customHtmlString, "text/html");
                if (wrapper.getElementsByTagName('div')[0]) {
                    boxElement = wrapper.getElementsByTagName('div')[0];
                } else {
                    throw new Error(`${customHtmlString} is not a valid htmlString`);
                }
            } else { //default css
                boxElement.style.boxShadow = "0 0 0 1px black";
                boxElement.style.outlineColor = "white";
                boxElement.style.outlineStyle = "dashed";
                boxElement.style.outlineOffset = "-1px";
                boxElement.style.outlineWidth = "1px";
                boxElement.style.backgroundColor = "rgba(250,250,128,0.4)";
            }
            //both must contain
            boxElement.style.display = "block";
            boxElement.style.pointerEvents = "none";
            boxElement.style.position = "fixed";
            boxElement.style.zIndex = "2147483647";
            boxElement.style.top = String(r.top) + "px";
            boxElement.style.left = String(r.left) + "px";
            boxElement.style.width = String(r.width) + "px";
            boxElement.style.height = String(r.height) + "px";
            boxElement.id = "sideexShowElement";
            document.body.appendChild(boxElement);

            return ;
        } catch (e) {
            return { result: false };
        }
    }
    async doConcealElement(delay) {
        try {
            await Utils.delay(delay);
            const box = document.getElementById("sideexShowElement");
            if (box) {
                document.body.removeChild(box);
            }
            return { result: true };
        } catch (e) {
            return { result: false };
        }
    }

}

Sideex.commands = {
    /**
     * Clicks on a link, button, checkbox or radio button. If the click action
     * causes a new page to load (like a link usually does), call
     * waitForPageToLoad.
     *
     * @param locator an element locator
     * @param coordString specifies the x,y position (i.e. - 10,20) of the mouse
     *      event relative to the element returned by the locator.
     *
     */
    async clickAt(locator, coordString) {
        var element = this.browserBot.findElement(locator);
        var clientXY = this.getClientXY(element, coordString);
        this.browserBot.fireMouseEvent(element, 'mouseover', true, clientXY[0], clientXY[1]);
        this.browserBot.fireMouseEvent(element, 'mousedown', true, clientXY[0], clientXY[1]);
        this.browserBot.triggerFocusEvent(element);
        this.browserBot.fireMouseEvent(element, 'mouseup', true, clientXY[0], clientXY[1]);
        this.browserBot.fireMouseEvent(element, 'click', true, clientXY[0], clientXY[1]);
        // END
    },
    /**
         * Double clicks on a link, button, checkbox or radio button. If the double click action
         * causes a new page to load (like a link usually does), call
         * waitForPageToLoad.
         *
         * @param locator an element locator
         *
         */
    async doubleClickAt(locator, coordString) {

        var element = this.browserBot.findElement(locator);
        var clientXY = this.getClientXY(element, coordString);
        this.browserBot.fireMouseEvent(element, 'mouseover', true, clientXY[0], clientXY[1]);
        this.browserBot.fireMouseEvent(element, 'mousedown', true, clientXY[0], clientXY[1]);
        this.browserBot.triggerFocusEvent(element);
        this.browserBot.fireMouseEvent(element, 'mouseup', true, clientXY[0], clientXY[1]);
        this.browserBot.fireMouseEvent(element, 'click', true, clientXY[0], clientXY[1]);
        this.browserBot.fireMouseEvent(element, 'mousedown', true, clientXY[0], clientXY[1]);
        this.browserBot.fireMouseEvent(element, 'mouseup', true, clientXY[0], clientXY[1]);
        this.browserBot.fireMouseEvent(element, 'click', true, clientXY[0], clientXY[1]);
        this.browserBot.fireMouseEvent(element, 'dblclick', true, clientXY[0], clientXY[1]);
        // END

    },
    /** @author © Ming-Hung Hsu, SideeX Team */
    async rightClickAt(locator, coordString) {
        var element = this.browserBot.findElement(locator);
        var clientXY = this.getClientXY(element, coordString);
        this.browserBot.fireMouseEvent(element, 'mouseover', true);
        this.browserBot.fireMouseEvent(element, 'mousedown', true, clientXY[0], clientXY[1], 2);
        this.browserBot.triggerFocusEvent(element);
        this.browserBot.fireMouseEvent(element, 'mouseup', true, clientXY[0], clientXY[1], 2);
        this.browserBot.fireMouseEvent(element, 'contextmenu', true, clientXY[0], clientXY[1], 2);
    },

    async doContextMenu(locator) {
        /**
         * Simulates opening the context menu for the specified element (as might happen if the user "right-clicked" on the element).
         *
         * @param locator an element locator
         *
         */
        var element = this.browserBot.findElement(locator);
        this.browserBot.contextMenuOnElement(element);
    },
    /**
     * Simulates a user pressing the left mouse button (without releasing it yet) at
     * the specified location.
     *
     * @param locator an <a href="#locators">element locator</a>
     * @param coordString specifies the x,y position (i.e. - 10,20) of the mouse
     *      event relative to the element returned by the locator.
     */
    async mouseDownAt(locator, coordString) {
        var element = this.browserBot.findElement(locator);
        var clientXY = this.getClientXY(element, coordString);
        this.mouseMove.startX = Number(clientXY[0]);
        this.mouseMove.startY = Number(clientXY[1]);
        // console.log(startX);
        // console.log(startY);
        this.browserBot.fireMouseEvent(element, 'mousedown', true, clientXY[0], clientXY[1]);
    },
    /**
     * Simulates a user pressing the mouse button (without releasing it yet) on
     * the specified element.
     *
     * @param locator an <a href="#locators">element locator</a>
     * @param coordString specifies the x,y position (i.e. - 10,20) of the mouse
     *      event relative to the element returned by the locator.
     */
    async mouseMoveAt(locator, coordString) {
        var element = this.browserBot.findElement(locator);
        var coordinateInfo = JSON.parse(coordString);
        let ifUndefined = false;
        if (this.mouseMove.startX == undefined && this.mouseMove.startY == undefined) {
            var clientXY = this.getClientXY(element);
            this.mouseMove.startX = clientXY[0];
            this.mouseMove.startY = clientXY[1];
            ifUndefined = true;
        }
        for (let i = 0; i < coordinateInfo.Movements.length; i++) {
            this.mouseMove.startX = this.mouseMove.startX + Number(coordinateInfo.Movements[i].OX);
            this.mouseMove.startY = this.mouseMove.startY + Number(coordinateInfo.Movements[i].OY);
            await Utils.delay(Number(coordinateInfo.Movements[i].TD));
            this.browserBot.fireMouseEvent(element, 'mousemove', true, this.mouseMove.startX, this.mouseMove.startY);
        }
        if (ifUndefined) {
            delete this.mouseMove.startX;
            delete this.mouseMove.startY;
        }
    },
    async mouseUpAt(locator, coordString) {
        var element = this.browserBot.findElement(locator);
        var clientXY = this.getClientXY(element, coordString);
        // console.log(clientXY[0]);
        // console.log(clientXY[1]);
        this.browserBot.fireMouseEvent(element, 'mouseup', true, clientXY[0], clientXY[1]);
        delete this.mouseMove.startX;
        delete this.mouseMove.startY;
    },
    /** @author © Ming-Hung Hsu, SideeX Team */
    async runScript(script, timeout = 1000) {
        window.postMessage({
            direction: "from-content-runscript",
            script: script
        }, "*");
        const actualMessage = await this.browserBot.getRunScriptMessage(timeout);
        if (actualMessage != "No error!!!!")
            throw new Error(actualMessage);
        else
            return true;
    },
    // © Ming-Hung Hsu, SideeX Team
    async verifyText(locator, value) {
        var element = this.browserBot.findElement(locator);
        if (Utils.getText(element) !== value) {
            throw new Error("Actual value '" + Utils.getText(element) + "' did not match '" + value + "'");
            //console.log("Actual value '" + Utils.getText(element) + "' did not match '" + value + "'");
        }
    },
    // © Ming-Hung Hsu, SideeX Team
    async verifyTitle(value) {
        if (Utils.normalizeSpaces(this.getTitle()) !== value) {
            throw new Error("Actual value '" + Utils.normalizeSpaces(this.getTitle()) + "' did not match '" + value + "'");
        }
    },
    // © Ming-Hung Hsu, SideeX Team
    async verifyValue(locator, value) {
        if (this.getValue(locator) !== value) {
            throw new Error("Actual value '" + this.getValue(locator) + "' did not match '" + value + "'");
        }
    },

    async verifyVisibility(locator, value){
        var element = this.browserBot.findElement(locator);
        var locate = element.getBoundingClientRect();
        var window_height = window.innerHeight;
        var window_width = window.innerWidth;
        //css
        if(window.getComputedStyle(element).visibility === "hidden" ||
            window.getComputedStyle(element).opacity === "0" ||
            window.getComputedStyle(element).display === "none" ||
            window.getComputedStyle(element).width === "0px" || 
            window.getComputedStyle(element).height === "0px"){ 
                throw new Error("I can't see!!");
        }
        //exceed the screen
        if(locate.top > window_height ||
            locate.bottom < 0 ||
            locate.left > window_width ||
            locate.right < 0){
                throw new Error("I can't see!!");
        }
        
    },

    // © Ming-Hung Hsu, SideeX Team
    async assertText(locator, value) {
        var element = this.browserBot.findElement(locator);
        if (Utils.getText(element) !== value) {
            throw new Error("Actual value '" + Utils.getText(element) + "' did not match '" + value + "'");
        }
    },
    // © Ming-Hung Hsu, SideeX Team
    async assertTitle(value) {
        if (Utils.normalizeSpaces(this.getTitle()) !== value) {
            throw new Error("Actual value '" + Utils.normalizeSpaces(this.getTitle()) + "' did not match '" + value + "'");
        }
    },
    // © Ming-Hung Hsu, SideeX Team
    async assertValue(locator, value) {
        if (this.getValue(locator) !== value) {
            throw new Error("Actual value '" + this.getValue(locator) + "' did not match '" + value + "'");
        }
    },
    // © Ming-Hung Hsu, SideeX Team
    async store(value, varName) {
        this.MessageController.runtimeSendMessage({ "storeStr": value, "storeVar": varName, "isGlobal": false });
    },
    // © Ming-Hung Hsu, SideeX Team
    async storeGlobalVars(value, varName) {
        this.MessageController.runtimeSendMessage({ "storeStr": value, "storeVar": varName, "isGlobal": true });
    },
    // © Ming-Hung Hsu, SideeX Team
    async storeText(locator, varName) {
        var element = this.browserBot.findElement(locator);
        var text = Utils.getText(element);
        if (text === '')
            throw new Error("Error: This element does not have property 'Text'. Please change to use storeValue command.");
        this.MessageController.runtimeSendMessage({ "storeStr": text, "storeVar": varName, "isGlobal": false });
    },
    // © Ming-Hung Hsu, SideeX Team
    async storeTitle(value, varName) {
        this.MessageController.runtimeSendMessage({ "storeStr": value, "storeVar": varName, "isGlobal": false });
    },
    // © Ming-Hung Hsu, SideeX Team
    async storeValue(locator, varName) {
        var val = this.getValue(locator);
        if (typeof val === 'undefined')
            throw new Error("Error: This element does not have property 'value'. Please change to use storeText command.");
        this.MessageController.runtimeSendMessage({ "storeStr": this.getValue(locator), "storeVar": varName, "isGlobal": false });
    },
    // © Ming-Hung Hsu, SideeX Team
    async echo(value) {
        console.log(value);
    },
    /**
     * Simulates a user hovering a mouse over the specified element.
     *
     * @param locator an <a href="#locators">element locator</a>
     */
    async mouseOver(locator, coordString) {
        /**
         * Simulates a user hovering a mouse over the specified element.
         *
         * @param locator an <a href="#locators">element locator</a>
         */
        var element = this.browserBot.findElement(locator);
        var clientXY = this.getClientXY(element, coordString);
        this.browserBot.fireMouseEvent(element, 'mouseover', true, clientXY[0], clientXY[1]);
    },

    async mouseOut(locator, coordString) {
        var element = this.browserBot.findElement(locator);
        this.browserBot.fireMouseEvent(element, 'mouseout', true);
    },
    async setCSS(locator, cssText) {
        var element = this.browserBot.findElement(locator);
        element.style = cssText;
        if (element.style == "") {
            element.removeAttribute("style");
        }
    },
    async dragAndDrop(locator, movementsString) {
        var element = this.browserBot.findElement(locator);
        var coordinateInfo = JSON.parse(movementsString);
        let len = coordinateInfo.Movements.length;
        let clientXY = this.getClientXY(element, coordinateInfo.StartPoint.X + "," + coordinateInfo.StartPoint.Y);
        let startX = clientXY[0];
        let startY = clientXY[1];
        this.browserBot.fireMouseEvent(element, 'mousedown', true, clientXY[0], clientXY[1]);
        for (let i = 0; i < len; i++) {
            await Utils.delay(Number(coordinateInfo.Movements[i].TD));
            startX = startX + Number(coordinateInfo.Movements[i].OX);
            startY = startY + Number(coordinateInfo.Movements[i].OY);
            this.browserBot.fireMouseEvent(element, 'mousemove', true, startX, startY);
        }
        startX = startX + Number(coordinateInfo.Movements[len - 1].OX);
        startY = startY + Number(coordinateInfo.Movements[len - 1].OY);
        this.browserBot.fireMouseEvent(element, 'mouseup', true, startX, startY);
        this.browserBot.fireMouseEvent(element, 'click', true, startX, startY);
    },

    async dragAndDropToObject(locatorOfObjectToBeDragged, locatorOfDragDestinationObject) {
        /** Drags an element and drops it on another element
         *
         * @param locatorOfObjectToBeDragged an element to be dragged
         * @param locatorOfDragDestinationObject an element whose location (i.e., whose center-most pixel) will be the point where locatorOfObjectToBeDragged  is dropped
         */
        if (!this.browserBot.findElement(locatorOfObjectToBeDragged).draggable) {
            //origin code
            var startX = this.getElementPositionLeft(locatorOfObjectToBeDragged);
            var startY = this.getElementPositionTop(locatorOfObjectToBeDragged);

            var destinationLeftX = this.getElementPositionLeft(locatorOfDragDestinationObject);
            var destinationTopY = this.getElementPositionTop(locatorOfDragDestinationObject);
            var destinationWidth = this.getElementWidth(locatorOfDragDestinationObject);
            var destinationHeight = this.getElementHeight(locatorOfDragDestinationObject);

            var endX = Math.round(destinationLeftX + (destinationWidth / 2));
            var endY = Math.round(destinationTopY + (destinationHeight / 2));

            var deltaX = endX - startX;
            var deltaY = endY - startY;

            var movementsString = "" + deltaX + "," + deltaY;
            this.doDragAndDrop(locatorOfObjectToBeDragged, movementsString);
        } else {
            // © Shuo-Heng Shih, SideeX Team
            var element = this.browserBot.findElement(locatorOfObjectToBeDragged);
            var target = this.browserBot.findElement(locatorOfDragDestinationObject);
            this.browserBot.triggerDragEvent(element, target);
            // END
        }
    },

    /**
     * Sets the value of an input field, as though you typed it in.
     *
     * <p>Can also be used to set the value of combo boxes, check boxes, etc. In these cases,
     * value should be the value of the option selected, not the visible text.</p>
     *
     * @param locator an <a href="#locators">element locator</a>
     * @param value the value to type
     */
    async type(locator, value) {
        if (this.browserBot.controlKeyDown || this.browserBot.altKeyDown || this.browserBot.metaKeyDown) {
            throw new Utils.SeleniumError("type not supported immediately after call to controlKeyDown() or altKeyDown() or metaKeyDown()");
        }
        var element = this.browserBot.findElement(locator);
        element.value = value;
    },
    async sendKeys(locator, value) {
        var element = Utils.parse_locator(locator);
        var win = this.browserBot.getCurrentWindow();
        var dom = win.document;
        var testElement = this.browserBot.findElementBy(element.type, element.string, dom, win);
        this.browserBot.checkElementExist(testElement, locator);
        if (sendkeysMap.ControlKeysMap[value]) {
            window.postMessage({
                direction: "from-sendkeys",
                keys: sendkeysMap.ControlKeysMap[value],
                element: element
            }, "*");
        } else if (sendkeysMap.FunctionalKeyMap[value]) {
            window.postMessage({
                direction: "from-sendkeys",
                keys: sendkeysMap.FunctionalKeyMap[value],
                element: element
            }, "*");
        } else {
            var elem = this.browserBot.findElement(locator);
            elem.value = "";
            elem.focus();
            window.postMessage({
                direction: "from-sendkeys",
                keys: "",
                element: element
            }, "*");
            for (const str of value.split("")) {
                elem.value += str;
                if (sendkeysMap.NumpadKeyMap[str]) {
                    window.postMessage({
                        direction: "from-sendkeys",
                        keys: sendkeysMap.NumpadKeyMap[str],
                        element: element
                    }, "*");
                    window.postMessage({
                        direction: "from-sendkeys",
                        keys: sendkeysMap.NormalKeyMap[str],
                        repeat: true,
                        element: element
                    }, "*");
                } else if (sendkeysMap.NormalKeyMap[str]) {
                    window.postMessage({
                        direction: "from-sendkeys",
                        keys: sendkeysMap.NormalKeyMap[str],
                        element: element
                    }, "*");
                } else {
                    window.postMessage({
                        direction: "from-sendkeys",
                        keys: str,
                        element: element
                    }, "*");
                }
            }
            window.postMessage({
                direction: "from-sendkeys",
                keys: "sendkeyEnd",
                element: element
            }, "*");
        }
    },
    /**
     * Select an option from a drop-down using an option locator.
     * @param selectLocator an <a href="#locators">element locator</a> identifying a drop-down menu
     * @param optionLocator an option locator (a label by default)
     */
    async select(selectLocator, optionLocator) {
        var element = this.browserBot.findElement(selectLocator);
        if (!("options" in element)) {
            throw new SeleniumError("Specified element is not a Select (has no options)");
        }
        var locator = OptionLocatorFactory.fromLocatorString(optionLocator);
        var option = locator.findOption(element);
        this.browserBot.selectOption(element, option);
    },
    /**
     * Add a selection to the set of selected options in a multi-select element using an option locator.
     *
     * @see #doSelect for details of option locators
     *
     * @param locator an <a href="#locators">element locator</a> identifying a multi-select box
     * @param optionLocator an option locator (a label by default)
     */
    async addSelection(locator, optionLocator) {
        var element = this.browserBot.findElement(locator);
        if (!("options" in element)) {
            throw new SeleniumError("Specified element is not a Select (has no options)");
        }
        var locator = OptionLocatorFactory.fromLocatorString(optionLocator);
        var option = locator.findOption(element);
        this.browserBot.addSelection(element, option);
    },
    /**
     * Remove a selection from the set of selected options in a multi-select element using an option locator.
     *
     * @see #doSelect for details of option locators
     *
     * @param locator an <a href="#locators">element locator</a> identifying a multi-select box
     * @param optionLocator an option locator (a label by default)
     */
    async removeSelection(locator, optionLocator) {
        var element = this.browserBot.findElement(locator);
        if (!("options" in element)) {
            throw new SeleniumError("Specified element is not a Select (has no options)");
        }
        var locator = OptionLocatorFactory.fromLocatorString(optionLocator);
        var option = locator.findOption(element);
        this.browserBot.removeSelection(element, option);
    },
    /**
     * Unselects all of the selected options in a multi-select element.
     *
     * @param locator an <a href="#locators">element locator</a> identifying a multi-select box
     */
    async removeAllSelections(locator) {
        var element = this.browserBot.findElement(locator);
        if (!("options" in element)) {
            throw new SeleniumError("Specified element is not a Select (has no options)");
        }
        for (var i = 0; i < element.options.length; i++) {
            this.browserBot.removeSelection(element, element.options[i]);
        }
    },

    /** @author © Ming-Hung Hsu, SideeX Team */
    async onsubmit(formLocator) {
        var form = this.browserBot.findElement(formLocator);
        var event = new Event('submit', {
            'bubbles': true,
            'cancelable': true // Whether the event may be canceled or not
        });
        form.dispatchEvent(event);
    },
    /** @author © Ming-Hung Hsu, SideeX Team */
    async submit(formLocator, defaultPrevented) {
        var form = this.browserBot.findElement(formLocator);
        if (defaultPrevented == "false") {
            form.submit();
        } else {
            var event;
            event = document.createEvent('Event');
            event.initEvent("submit", true, true);
            form.dispatchEvent(event);
        }
    },
    /**
     * Opens an URL in the test frame. This accepts both relative and absolute
     * URLs.
     *
     * The &quot;open&quot; command waits for the page to load before proceeding,
     * ie. the &quot;AndWait&quot; suffix is implicit.
     *
     * <em>Note</em>: The URL must be on the same domain as the runner HTML
     * due to security restrictions in the browser (Same Origin Policy). If you
     * need to open an URL on another domain, use the Selenium Server to start a
     * new browser session on that domain.
     *
     * @param url the URL to open; may be relative or absolute
     * @param ignoreResponseCode (optional) turn off ajax head request functionality
     *
     */
    async open(url, ignoreResponseCode) {
        if (ignoreResponseCode == null || ignoreResponseCode.length == 0) {
            this.browserBot.ignoreResponseCode = true;
        } else if (ignoreResponseCode.toLowerCase() == "true") {
            this.browserBot.ignoreResponseCode = true;
        } else {
            this.browserBot.ignoreResponseCode = false;
        }
        this.browserBot.openLocation(url);
        window.scrollTo(0, 0);
    },

    /**
     *to set text in the element which's conentEditable attribute is true
     *@param locator an element locator
     *@param value the context of the element in html
     */
    async editContent(locator, value){
        var element = this.browserBot.findElement(locator);
        var editable = element.contentEditable;
        if (editable == "true") {
            element.innerHTML = escapeHTML(value);
        } else {
            throw new SeleniumError("The value of contentEditable attribute of this element is not true.");
        }

    }
};

/**
 * abstract class OptionLocator
 */
class OptionLocator {
    constructor(value) {
        this.value = value;
        try {
            this.Matcher = new PatternMatcher(this.value);
        } catch (error) {
            // "index" don't have matcher
        }
    }
    findOption() {
        throw new Error("not implemented");
    }
    assertSelected() {
        throw new Error("not implemented");
    }
}
/**
 *  Factory for creating "Option Locators".
 *  An OptionLocator is an object for dealing with Select options (e.g. for
 *  finding a specified option, or asserting that the selected option of
 *  Select element matches some condition.
 *  The type of locator returned by the factory depends on the locator string:
 *     label=<exp>  (OptionLocatorByLabel)
 *     value=<exp>  (OptionLocatorByValue)
 *     index=<exp>  (OptionLocatorByIndex)
 *     id=<exp>     (OptionLocatorById)
 *     <exp> (default is OptionLocatorByLabel).
 */
class OptionLocatorFactory {
    static fromLocatorString(locatorString) {
        var locatorType = 'label';
        var locatorValue = locatorString;
        // If there is a locator prefix, use the specified strategy
        var result = locatorString.match(/^([a-zA-Z]+)=(.*)/);
        if (result) {
            locatorType = result[1];
            locatorValue = result[2];
        }
        const optionLocator = OptionLocatorFactory.optionLocators[locatorType];
        if (optionLocator) {
            return new optionLocator(locatorValue);
        }
        throw new SeleniumError("Unknown option locator type: " + locatorType);
    }
}
OptionLocatorFactory.optionLocators = {
    /**
     *  OptionLocator for options identified by their labels.
     */
    label: class extends OptionLocator {
        findOption(element) {
            for (var i = 0; i < element.options.length; i++) {
                if (this.Matcher.matches(element.options[i].text)) {
                    return element.options[i];
                }
            }
            throw new SeleniumError("Option with label '" + this.value + "' not found");
        }
        assertSelected(element) {
            var selectedLabel = element.options[element.selectedIndex].text;
            Assert.matches(this.value, selectedLabel);
        }
    },
    /**
     *  OptionLocator for options identified by their values.
     */
    value: class extends OptionLocator {
        findOption(element) {
            for (var i = 0; i < element.options.length; i++) {
                if (this.Matcher.matches(element.options[i].value)) {
                    return element.options[i];
                }
            }
            throw new SeleniumError("Option with value '" + this.value + "' not found");
        }
        assertSelected(element) {
            var selectedValue = element.options[element.selectedIndex].value;
            Assert.matches(this.value, selectedValue);
        }
    },
    /**
    *  OptionLocator for options identified by their index.
    */
    index: class extends OptionLocator {
        constructor(index) {
            const i = Number(index);
            if (isNaN(i) || i < 0) {
                throw new SeleniumError("Illegal Index: " + index);
            }
            super(index);
        }
        findOption(element) {
            if (element.options.length <= this.value) {
                throw new SeleniumError("Index out of range.  Only " + element.options.length + " options available");
            }
            return element.options[this.value];
        }
        assertSelected(element) {
            Assert.equals(this.value, element.selectedIndex);
        }
    },
    /**
     *  OptionLocator for options identified by their id.
     */
    id: class extends OptionLocator {
        findOption(element) {
            for (var i = 0; i < element.options.length; i++) {
                if (this.Matcher.matches(element.options[i].id)) {
                    return element.options[i];
                }
            }
            throw new SeleniumError("Option with id '" + this.value + "' not found");
        }
        assertSelected(element) {
            var selectedId = element.options[element.selectedIndex].id;
            Assert.matches(this.value, selectedId);
        }
    }
};
