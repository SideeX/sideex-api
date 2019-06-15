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
