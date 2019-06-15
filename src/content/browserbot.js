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

/*
 * This script provides the Javascript API to drive the test application contained within
 * a Browser Window.
 * TODO:
 *    Add support for more events (keyboard and mouse)
 *    Allow to switch "user-entry" mode from mouse-based to keyboard-based, firing different
 *          events in different modes.
 */

// The window to which the commands will be sent.  For example, to click on a
// popup window, first select that window, and then do a normal click command.
import { Utils, PatternMatcher } from "../common/utils";
export class BrowserBot {
    constructor() {
        this.altKeyDown = false;
        this.controlKeyDown = false;
        this.shiftKeyDown = false;
        this.metaKeyDown = false;
        this.window = window;
    }
    triggerFocusEvent(element) {
        var evt = new FocusEvent('focus');
        element.dispatchEvent(evt);
    }
    triggerChangeEvent(element) {
        const evt = new Event("change", {
            "view": window,
            "bubbles": true,
            "cancelable": true
        });
        element.dispatchEvent(evt);
    }
    /** © Ming-Hung Hsu, SideeX Team */
    fireMouseEvent(element, eventType, canBubble = true, clientX = 0, clientY = 0, button = 0) {
        const evt = new MouseEvent(eventType, {
            "bubbles": canBubble,
            "cancelable": true,
            "clientX": clientX,
            "clientY": clientY,
            "ctrlKey": this.controlKeyDown,
            "shiftKey": this.shiftKeyDown,
            "altKey": this.altKeyDown,
            "metaKey": this.metaKeyDown,
            "button": button
        });
        return element.dispatchEvent(evt);
    }
    /** © Shuo-Heng Shih, SideeX Team */
    triggerDragEvent(element, target) {
        var script = `\
        function simulateDragDrop(sourceNode, destinationNode){\
        function createCustomEvent(type) {                     \
            var event = new CustomEvent('CustomEvent');        \
            event.initCustomEvent(type, true, true, null);     \
            event.dataTransfer = {                             \
                data: {                                        \
                },                                             \
                setData: function(type, val) {                 \
                    this.data[type] = val;                     \
                },                                             \
                getData: function(type) {                      \
                    return this.data[type];                    \
                }                                              \
            };                                                 \
            return event;                                      \
        }                                                      \
        function dispatchEvent(node, type, event) {            \
            if (node.dispatchEvent) {                          \
                return node.dispatchEvent(event);              \
            }                                                  \
            if (node.fireEvent) {                              \
                return node.fireEvent('on' + type, event);     \
            }                                                  \
        }                                                      \
        var event = createCustomEvent('dragstart');            \
        dispatchEvent(sourceNode, 'dragstart', event);         \
                                                               \
        var dropEvent = createCustomEvent('drop');             \
        dropEvent.dataTransfer = event.dataTransfer;           \
        dispatchEvent(destinationNode, 'drop', dropEvent);     \
                                                               \
        var dragEndEvent = createCustomEvent('dragend');       \
        dragEndEvent.dataTransfer = event.dataTransfer;        \
        dispatchEvent(sourceNode, 'dragend', dragEndEvent);    \
    }                                                          \
    simulateDragDrop(document.evaluate('${Utils.xpathGenerator(element)}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, document.evaluate('${Utils.xpathGenerator(target)}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);\
    `;
        const doc = this.getCurrentWindow().document;
        const scriptTag = doc.createElement("script");
        scriptTag.type = "text/javascript";
        scriptTag.text = script;
        doc.body.appendChild(scriptTag);
    }
    // END
    openLocation(target) {
        var win = this.getCurrentWindow();
        if (win.location.href === target) {
            win.location.reload();
        } else {
            win.location.href = target;
        }
    }
    getCurrentWindow() {
        return window;
    }
    getTitle() {
        var t = this.getCurrentWindow().document.title;
        if (typeof (t) == "string") {
            t = t.trim();
        }
        return t;
    }
    /*****************************************************************/
    /* BROWSER-SPECIFIC FUNCTIONS ONLY AFTER THIS LINE */
    /**
     * Find a locator based on a prefix.
     */
    findElementBy(locatorType, locator, inDocument, inWindow) {
        const locatorFunction = BrowserBot.locationStrategies[locatorType];
        if (!locatorFunction) {
            throw new Utils.SeleniumError("Unrecognised locator type: '" + locatorType + "'");
        }
        return locatorFunction.call(this, locator, inDocument, inWindow);
    }
    /*
     * Finds an element recursively in frames and nested frames
     * in the specified document, using various lookup protocols
     */
    findElementRecursive(locatorType, locatorString, inDocument, inWindow) {
        var element = this.findElementBy(locatorType, locatorString, inDocument, inWindow);
        if (element != null) {
            return element;
        }
        for (var i = 0; i < inWindow.frames.length; i++) {
            // On some browsers, the document object is undefined for third-party
            // frames.  Make sure the document is valid before continuing.
            try {
                if (inWindow.frames[i].document) {
                    element = this.findElementRecursive(locatorType, locatorString, inWindow.frames[i].document, inWindow.frames[i]);
                    if (element != null) {
                        return element;
                    }
                }
            } catch (e) {
                return null;
            }
        }
    }
    /*
     * Finds an element on the current page, using various lookup protocols
     */
    findElementOrNull(locator, win, dom) {
        locator = Utils.parse_locator(locator);
        if (win == null) {
            win = this.getCurrentWindow();
        }
        if (dom == null) {
            dom = win.document;
        }
        // var element = this.findElementRecursive(locator.type, locator.string, win.document, win);
        // NOTE: Because we do go into frame by selectFrame commands, we do not find
        // element go into frame by findElementRecursive operations.
        var element = this.findElementBy(locator.type, locator.string, dom, win);
        return (element != null) ? element : null;
    }
    findElement(locator, win, dom) {
        var element = this.findElementOrNull(locator, win, dom);
        this.checkElementExist(element, locator);
        return element;
    }
    checkElementExist(element, locator) {
        if (element == null) {
            if (locator.includes("TAC_LOCATOR")) {
                throw new Utils.SeleniumError("Element located by TAC not found");
            } else if (locator == "auto-located-by-tac") {
                throw new this.SeleniumError("The value \"auto-located-by-tac\" only can be automatically generated when recording a command");
            } else
                throw new Utils.SeleniumError("Element " + locator + " not found");
        }
    }
    /*
     * Select the specified option and trigger the relevant events of the element.
     */
    selectOption(element, optionToSelect) {
        this.triggerFocusEvent(element);
        var changed = false;
        for (var i = 0; i < element.options.length; i++) {
            var option = element.options[i];
            if (option.selected && option != optionToSelect) {
                option.selected = false;
                changed = true;
            } else if (!option.selected && option == optionToSelect) {
                option.selected = true;
                changed = true;
            }
        }
        if (changed) {
            this.triggerChangeEvent(element);
        }
    }
    /*
     * Select the specified option and trigger the relevant events of the element.
     */
    addSelection(element, option) {
        this.checkMultiselect(element);
        this.triggerFocusEvent(element);
        if (!option.selected) {
            option.selected = true;
            this.triggerChangeEvent(element);
        }
    }
    /*
     * Select the specified option and trigger the relevant events of the element.
     */
    removeSelection(element, option) {
        this.checkMultiselect(element);
        this.triggerFocusEvent(element);
        if (option.selected) {
            option.selected = false;
            this.triggerChangeEvent(element);
        }
    }
    checkMultiselect(element) {
        if (!element.multiple) {
            throw new Utils.SeleniumError("Not a multi-select");
        }
    }
    /**
     * Refine a list of elements using a filter.
     */
    selectElementsBy(filterType, filter, elements) {
        var filterFunction = BrowserBot.filterFunctions[filterType];
        if (!filterFunction) {
            throw new Utils.SeleniumError("Unrecognised element-filter type: '" + filterType + "'");
        }
        return filterFunction(filter, elements);
    }
    selectElements(filterExpr, elements, defaultFilterType) {
        var filterType = (defaultFilterType || 'value');
        // If there is a filter prefix, use the specified strategy
        var result = filterExpr.match(/^([A-Za-z]+)=(.+)/);
        if (result) {
            filterType = result[1].toLowerCase();
            filterExpr = result[2];
        }
        return this.selectElementsBy(filterType, filterExpr, elements);
    }
    /* prompt */
    cancelNextPrompt() {
        return this.setNextPromptResult(null);
    }
    postMessageToPageEnv(data = {}) {
        data.from = "sideex-content-env";
        window.postMessage(data, "*");
    }
    async setNextPromptResult(result) {
        this.promptResponse = false;
        this.postMessageToPageEnv({
            type: "command",
            args: {
                commandType: "setNextPromptResult",
                target: result
            }
        });
        for (let count = 0; count <= 60; count++) {
            if (this.promptResponse) {
                this.promptResponse = false;
                return;
            }
            await Utils.delay(500);
        }
        throw "No response";
    }
    async getPromptMessage() {
        this.promptResponse = false;
        this.promptMessage = null;
        this.postMessageToPageEnv({
            type: "command",
            args: {
                commandType: "getPromptMessage"
            }
        });
        for (let count = 0; count <= 60; count++) {
            if (this.promptResponse) {
                const message = this.promptMessage;
                this.promptResponse = false;
                this.promptMessage = null;
                return message;
            }
            await Utils.delay(500);
        }
        throw "No response";
    }
    // confirm
    async setNextConfirmationResult(result) {
        this.confirmationResponse = false;
        this.postMessageToPageEnv({
            type: "command",
            args: {
                commandType: "setNextConfirmationResult",
                target: result
            }
        });
        for (let count = 0; count <= 60; count++) {
            if (this.confirmationResponse) {
                this.confirmationResponse = false;
                return;
            }
            await Utils.delay(500);
        }
        throw "No response";
    }
    async getConfirmationMessage() {
        this.confirmationResponse = false;
        this.confirmationMessage = null;
        this.postMessageToPageEnv({
            type: "command",
            args: {
                commandType: "getConfirmationMessage"
            }
        });
        for (let count = 0; count <= 60; count++) {
            if (this.confirmationResponse) {
                const message = this.confirmationMessage;
                this.confirmationResponse = false;
                this.confirmationMessage = null;
                return message;
            }
            await Utils.delay(500);
        }
        throw "No response";
    }
    async getAlertMessage() {
        for (let count = 0; count <= 60; count++) {
            if (this.alertResponse) {
                const message = this.alertMessage;
                this.alertResponse = false;
                this.alertMessage = null;
                return message;
            }
            await Utils.delay(500);
        }
        throw "No response";
    }
    /** © Ming-Hung Hsu, SideeX Team */
    async getRunScriptMessage() {
        for (let count = 0; count <= 4; count++) {
            if (this.runScriptResponse) {
                const message = this.runScriptMessage;
                this.runScriptResponse = false;
                this.runScriptMessage = null;
                return message;
            }
            await Utils.delay(200);
        }
        throw "No response";
    }
}

BrowserBot.locationStrategies = {
    /**
     * The implicit locator, that is used when no prefix is supplied.
     */
    implicit(locator, inDocument, inWindow) {
        if (locator.startsWith('//')) {
            return BrowserBot.locationStrategies.xpath(locator, inDocument, inWindow);
        }
        // TODO: Can't find locateElementByDomTraversal
        if (locator.startsWith('document.')) {
            return BrowserBot.locationStrategies.domtraversal(locator, inDocument, inWindow);
        }
        return BrowserBot.locationStrategies.identifier(locator, inDocument, inWindow);
    },
    /**
     * In non-IE browsers, getElementById() does not search by name.  Instead, we
     * we search separately by id and name.
     */
    identifier(identifier, inDocument, inWindow) {
        // HBC - use "this" instead of "BrowserBot.prototype"; otherwise we lose
        // the non-prototype fields of the object!
        return BrowserBot.locationStrategies.id(identifier, inDocument, inWindow) || BrowserBot.locationStrategies.name(identifier, inDocument, inWindow) || null;
    },
    /**
     * Find the element with id - can't rely on getElementById, coz it returns by name as well in IE..
     */
    id(identifier, inDocument, inWindow) {
        var element = inDocument.getElementById(identifier);
        if (element && element.getAttribute('id') === identifier) {
            return element;
        } else {
            return null;
        }
    },
    /**
     * Find an element by name, refined by (optional) element-filter
     * expressions.
     */
    name(locator, document, inWindow) {
        var elements = document.getElementsByTagName("*");
        // © Jie-Lin You, SideeX Team
        /*
            var filters = locator.split(' ');
            filters[0] = 'name=' + filters[0];

            while (filters.length) {
                var filter = filters.shift();
                elements = this.selectElements(filter, elements, 'value');
            }
        */
        // END
        var filter = 'name=' + locator;
        elements = this.selectElements(filter, elements, 'value');
        if (elements.length > 0) {
            return elements[0];
        }
        return null;
    },
    /**
     * Finds an element identified by the xpath expression. Expressions _must_
     * begin with "//".
     */
    xpath(xpath, inDocument, inWindow) {
        return inDocument.evaluate(xpath, inDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    },
    /**
     * Finds a link element with text matching the expression supplied. Expressions must
     * begin with "link:".
     */
    link(linkText, inDocument, inWindow) {
        var links = inDocument.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            var element = links[i];
            if (PatternMatcher.matches(linkText, Utils.getText(element))) {
                return element;
            }
        }
        return null;
    },
    /**
     * Only used for TAC locator.
     */
    tac(locator, inDocument, inWindow) {
        var allElements = inDocument.getElementsByTagName("*");
        for (let i = 0, l = allElements.length; i < l; i++) {
            if (allElements[i] == null) {
                continue;
            }
            let style = inWindow.getComputedStyle(allElements[i]);
            if (style.display == "none" || style.visibility == "hidden") {
                let hidden = inDocument.createAttribute("hidden-annotated-by-tac");
                allElements[i].setAttributeNode(hidden);
            }
        }
        let newDoc = inDocument.documentElement.outerHTML;
        for (let i = 0, l = allElements.length; i < l; i++) {
            if (allElements[i] == null) {
                continue;
            }
            if (allElements[i].hasAttribute("hidden-annotated-by-tac")) {
                allElements[i].removeAttribute("hidden-annotated-by-tac");
            }
        }
        var oldDoc = "";
        var oldXPath = "//html";
        var tacMethod = new Tac(oldXPath, oldDoc, newDoc);
        if (!tacMethod.testOldXPath()) {
            tacMethod.fixOldXPath();
        }
        locator = locator.split("TAC_LOCATOR:")[1];
        var xpath = tacMethod.locate(locator);
        return (xpath != null) ? inDocument.evaluate(xpath, inDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue : null;
    },
    /**
     * Find an element by css selector
     */
    css(locator, document) {
        var elements = Utils.eval_css(locator, document);
        if (elements.length != 0)
            return elements[0];
        return null;
    }
};

BrowserBot.filterFunctions = {
    name(name, elements) {
        var selectedElements = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].name === name) {
                selectedElements.push(elements[i]);
            }
        }
        return selectedElements;
    },
    value(value, elements) {
        var selectedElements = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].value === value) {
                selectedElements.push(elements[i]);
            }
        }
        return selectedElements;
    },
    index(index, elements) {
        index = Number(index);
        if (isNaN(index) || index < 0) {
            throw new Utils.SeleniumError("Illegal Index: " + index);
        }
        if (elements.length <= index) {
            throw new Utils.SeleniumError("Index out of range: " + index);
        }
        return [elements[index]];
    }
};
