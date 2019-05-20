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
import storage from "../common/storage";
import { browser } from "webextension-polyfill-ts";

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
                case "resourceWait":
                    errorMessage = "Resource Wait timed out";
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
    async doubleClickAt(locator,coordString) {
       
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

    async mouseOut(locator,coordString){
        var element = this.browserbot.findElement(locator);
        this.browserBot.fireMouseEvent(element, 'mouseout', true);
    },
    async dragAndDrop(locator, movementsString, coordString) {
        /** Drags an element a certain distance and then drops it
         * @param locator an element locator
         * @param movementsString offset in pixels from the current location to which the element should be moved, e.g., "+70,-300"
         */
        var element = this.browserBot.findElement(locator, coordString);
        var clientStartXY = getClientXY(element)
        var clientStartX = clientStartXY[0];
        var clientStartY = clientStartXY[1];
    
        var movements = movementsString.split(/,/);
        var movementX = Number(movements[0]);
        var movementY = Number(movements[1]);
    
        var clientFinishX = ((clientStartX + movementX) < 0) ? 0 : (clientStartX + movementX);
        var clientFinishY = ((clientStartY + movementY) < 0) ? 0 : (clientStartY + movementY);
    
        var mouseSpeed = this.mouseSpeed;
        var move = function(current, dest) {
            if (current == dest) return current;
            if (Math.abs(current - dest) < mouseSpeed) return dest;
            return (current < dest) ? current + mouseSpeed : current - mouseSpeed;
        }
    
        this.browserBot.triggerMouseEvent(element, 'mousedown', true, clientStartX, clientStartY);
        this.browserBot.triggerMouseEvent(element, 'mousemove', true, clientStartX, clientStartY);
        var clientX = clientStartX;
        var clientY = clientStartY;
    
        while ((clientX != clientFinishX) || (clientY != clientFinishY)) {
            clientX = move(clientX, clientFinishX);
            clientY = move(clientY, clientFinishY);
            this.browserbot.triggerMouseEvent(element, 'mousemove', true, clientX, clientY);
        }
    
        this.browserBot.triggerMouseEvent(element, 'mousemove', true, clientFinishX, clientFinishY);
        this.browserBot.triggerMouseEvent(element, 'mouseup', true, clientFinishX, clientFinishY);
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
    }
};