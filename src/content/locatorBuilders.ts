/*
 * Copyright Shinya Kasatani
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
// @ts-ignore
import { BrowserBot } from "./browserbot"
import { Utils } from "../utils/index"

export class LocatorBuilders {
    window: Window
    static order: string[];
    static builderMap: { [key: string]: (this: LocatorBuilders, element: Element, dom: Document) => string };
    static _preferredOrder: string[];
    private _pageBot: BrowserBot = null;
    constructor(window: Window) {
        this.window = window;
    }
    detach() {
        if (this._pageBot) {
            this._pageBot = undefined;
        }
    }
    get pageBot() {
        if (this._pageBot == null) {
            this._pageBot = new BrowserBot();
            this._pageBot.getCurrentWindow = () => {
                return this.window;
            };
        }
        return this._pageBot;
    }
    buildWith(name: string, element: Element, dom?: Document) {
        return LocatorBuilders.builderMap[name].call(this, element, dom) as string;
    }
    elementEquals(_name: string, element: Element, locator: string) {
        const fe = this.findElement(locator);
        return element == fe
        //TODO: add match function to the ui locator builder, note the inverted parameters
        //return (element == fe) || (LocatorBuilders.builderMap[name] && LocatorBuilders.builderMap[name].match && LocatorBuilders.builderMap[name].match(element, fe));
    }
    build(element: Element) {
        const locators = this.buildAll(element);
        if (locators.length > 0) {
            return locators[0][0];
        }
        else {
            return "LOCATOR_DETECTION_FAILED";
        }
    }
    buildAll(element: Element, dom?: Document) {
        const locators: [string, string][] = [];
        const coreLocatorStrategies = BrowserBot.locationStrategies;
        for (const builder of LocatorBuilders.order) {
            try {
                const locator = this.buildWith(builder, element, dom);
                if (locator && (builder == 'tac' || (element == this.findElement(locator, dom)) || (coreLocatorStrategies[builder]))) {
                    locators.push([locator, builder]);
                }
            } catch (e) {
                console.error(e);
            }
        }
        return locators;
    }
    findElement(locator: string, dom?: Document): Element {
        try {
            return this.pageBot.findElement(locator, null, dom);
        } catch (error) {
            return null;
        }
    }
    /*
     * Utility function: Encode XPath attribute value.
     */
    attributeValue(value: string) {
        const splitvalue: string[] = [];
        /** match two kinds of quotation marks (' and ") , if it contain one kind, qoute it with another one */
        const matches = value.match(/.*?(["'])(\1|[^"'])*/g);
        if (matches) {
            for (const match of value.match(/.*?(["'])(\1|[^"'])*/g)) {
                if (match.indexOf("'") >= 0) {
                    splitvalue.push('"' + match + '"');
                } else {
                    splitvalue.push("'" + match + "'");
                }
            }
            const result = splitvalue.join(",");
            if (splitvalue.length > 1) {
                return 'concat(' + result + ')';
            }
            return result;
        } else {
            return value;
        }
    }
    xpathHtmlElement(name: string) {
        if (this.window.document.contentType == 'application/xhtml+xml') {
            // "x:" prefix is required when testing XHTML pages
            return "x:" + name;
        } else {
            return name;
        }
    }
    relativeXPathFromParent(current: Element) {
        const index = this.getNodeNumber(current);
        let currentPath = '/' + this.xpathHtmlElement(current.tagName.toLowerCase());
        if (index > 0) {
            currentPath += '[' + index + ']';
        }
        return currentPath;
    }
    getNodeNumber(current: Element) {
        const children = current.parentNode.children;
        let total = 0;
        for (const child of children) {
            if (child.tagName == current.tagName) {
                total++;
                if (child == current) {
                    break;
                }
            }
        }
        return total;
    }
    getCSSSubPath(element: Element) {
        let cssAttributes = ['id', 'name', 'class', 'type', 'alt', 'title', 'value'];
        let index = this.getNodeNumber(element);
        let subPath = element.tagName.toLowerCase();
        for (let attr of cssAttributes) {
            let value = element.getAttribute(attr);
            if (value) {
                if (attr == 'id') {
                    subPath = '#' + value;
                } else if (attr == 'class') {
                    subPath = element.tagName.toLowerCase() + '.' + value.replace(/\s+/g, ".").replace("..", ".");
                } else {
                    subPath = element.tagName.toLowerCase() + '[' + attr + '="' + value + '"]';
                }
                break;
            }
        }
        let elements = Utils.eval_css(subPath, element.ownerDocument);
        return (index > 1 && elements.length > 1) ? subPath + ':nth-child(' + index + ')' : subPath;
    }
    preciseXPath(xpath: string, element: Element) {
        //only create more precise xpath if needed
        if (this.findElement(xpath) != element) {
            const result = element.ownerDocument.evaluate(xpath, element.ownerDocument, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            //skip first element (result:0 xpath index:1)
            for (let i = 0; i < result.snapshotLength; i++) {
                const newPath = 'xpath=(' + xpath + ')[' + (i + 1) + ']';
                if (this.findElement(newPath) == element) {
                    return newPath;
                }
            }
        }
        return xpath;
    }
    /*
     * Class methods
     */
    static add(name: string, finder: (this: LocatorBuilders, element: Element, dom?: any) => string) {
        this.order.push(name);
        this.builderMap[name] = finder;
        this._orderChanged();
    }
    /**
     * Call when the order or preferred order changes
     */
    private static _orderChanged() {
        var changed = this._ensureAllPresent(this.order, this._preferredOrder);
        this._sortByRefOrder(this.order, this._preferredOrder);
        if (changed) {
            // NOTE: for some reasons we does not use this part
            // this.notify('preferredOrderChanged', this._preferredOrder);
        }
    }
    /**
     * Set the preferred order of the locator builders
     *
     * @param preferredOrder can be an array or a comma separated string of names
     */
    static setPreferredOrder(preferredOrder: String | string[]) {
        if (preferredOrder instanceof String) {
            this._preferredOrder = preferredOrder.split(',');
        }
        else {
            this._preferredOrder = preferredOrder;
        }
        this._orderChanged();
    }
    /**
     * Returns the locator builders preferred order as an array
     */
    static get getPreferredOrder() {
        return this._preferredOrder;
    }
    /**
     * Sorts arrayToSort in the order of elements in sortOrderReference
     * @param arrayToSort
     * @param sortOrderReference
     */
    private static _sortByRefOrder(arrayToSort: String[], sortOrderReference: String[]) {
        var raLen = sortOrderReference.length;
        arrayToSort.sort(function (a, b) {
            var ai = sortOrderReference.indexOf(a);
            var bi = sortOrderReference.indexOf(b);
            return (ai > -1 ? ai : raLen) - (bi > -1 ? bi : raLen);
        });
    }
    /**
     * Function to add to the bottom of destArray elements from source array that do not exist in destArray
     * @param sourceArray
     * @param destArray
     */
    private static _ensureAllPresent(sourceArray: String[], destArray: String[]) {
        let changed = false;
        for (const source of sourceArray) {
            if (destArray.indexOf(source) == -1) {
                destArray.push(source);
                changed = true;
            }
        }
        return changed;
    }
}


/*
 * ===== builders =====
 */
LocatorBuilders._preferredOrder = [];
LocatorBuilders.order = ['id', 'name', 'xpath:link', 'xpath:img', 'xpath:attributes', 'xpath:idRelative', 'xpath:href', 'xpath:position', 'css', 'link'];
LocatorBuilders.builderMap = {
    'id': function (element: Element) {
        if (element.id) {
            return 'id=' + element.id;
        }
        return null;
    },
    'link': function (element: Element) {
        if (element.tagName == 'A') {
            const text = element.textContent;
            if (!text.match(/^\s*$/)) {
                return "link=" + Utils.exactMatchPattern(text.replace(/\xA0/g, " ").replace(/^\s*(.*?)\s*$/, "$1"));
            }
        }
        return null;
    },
    'name': function (element: Element) {
        if (element.hasAttribute("name")) {
            return 'name=' + element.getAttribute("name");
        }
        return null;
    },
    'xpath:link': function (element: Element) {
        if (element.tagName == 'A') {
            const text = element.textContent;
            if (!text.match(/^\s*$/)) {
                return this.preciseXPath(`//${this.xpathHtmlElement('a')}[contains(text(),'${text.trim()}')]`, element);
            }
        }
        return null;
    },
    'xpath:img': function (element: Element) {
        if (element.tagName == 'IMG') {
            const e = element as HTMLImageElement
            if (e.alt != '') {
                return this.preciseXPath(`//${this.xpathHtmlElement('img')}[@alt='${this.attributeValue(e.alt)}']`, e);
            } else if (e.title != '') {
                return this.preciseXPath(`//${this.xpathHtmlElement('img')}[@title='${this.attributeValue(e.title)}']`, e);
            } else if (e.src != '') {
                return this.preciseXPath(`//${this.xpathHtmlElement('img')}[contains(@src,'${this.attributeValue(e.src)}')]`, e);
            }
        }
        return null;
    },
    'xpath:attributes': function (element: Element) {
        const PREFERRED_ATTRIBUTES = ['id', 'name', 'value', 'type', 'action', 'onclick'];
        const attributesXPath = (name: string, attNames: string[], attributes: { [key: string]: string }) => {
            let locator = "//" + this.xpathHtmlElement(name) + "[";
            for (const [i, att] of attNames.entries()) {
                if (+i > 0) {
                    locator += " and ";
                }
                locator += '@' + att + "=" + this.attributeValue(attributes[att]);
            }
            locator += "]";
            return this.preciseXPath(locator, element);
        }

        if (element.attributes) {
            const attsMap: { [key: string]: string } = {};
            for (const att of element.attributes) {
                attsMap[att.name] = att.value;
            }
            const names: string[] = [];
            // try preferred attributes
            for (const name of PREFERRED_ATTRIBUTES) {
                if (attsMap[name] != null) {
                    names.push(name);
                    const locator = attributesXPath(element.tagName.toLowerCase(), names, attsMap);
                    if (element == this.findElement(locator)) {
                        return locator;
                    }
                }
            }
        }
        return null;
    },
    'xpath:idRelative': function (element: Element) {
        let path = '';
        for (let current = element; current.parentElement != null; current = current.parentElement) {
            path = this.relativeXPathFromParent(current) + path;
            const parent = current.parentElement;
            if (parent.hasAttribute("id")) {
                return this.preciseXPath(`//${this.xpathHtmlElement(parent.tagName.toLowerCase())}[@id='${this.attributeValue(parent.getAttribute('id'))}']${path}`, element);
            }
        }
        return null;
    },
    'xpath:href': function (element: Element) {
        if (element.attributes && element.hasAttribute("href")) {
            const href = element.getAttribute("href");
            if (href.search(/^http?:\/\//)) {
                return this.preciseXPath(`//${this.xpathHtmlElement('a')}[@href='${this.attributeValue(href)}']`, element);
            } else {
                // use contains(), because in IE getAttribute("href") will return absolute path
                return this.preciseXPath(`//${this.xpathHtmlElement('a')}[contains(@href,'${this.attributeValue(href)}']`, element);
            }
        }
        return null;
    },
    'xpath:position': function (element: Element, dom: Document) {
        let path = '';
        for (let current = element; current != null; current = current.parentElement) {
            let currentPath = "";
            const currentElement = current.tagName.toLowerCase();
            if (current.parentElement != null) {
                currentPath = this.relativeXPathFromParent(current);
            } else {
                currentPath = '/' + this.xpathHtmlElement(currentElement);
            }
            if (this.window.document.createElement(currentElement).toString() == "[object HTMLUnknownElement]") {
                const index = currentPath.indexOf('[');
                currentPath = "/*[name()='" + currentElement + "']" + (index == -1 ? "" : currentPath.substring(index));
            }
            path = currentPath + path;
            const locator = '/' + path;
            if (element == this.findElement(locator, dom)) {
                return locator;
            }
        }
        return null;
    },
    'css': function (element: Element, dom: Document) {
        let sub_path = this.getCSSSubPath(element);
        for (let current = element; this.findElement("css=" + sub_path, dom) != element && current.tagName != 'HTML'; current = current.parentElement) {
            sub_path = this.getCSSSubPath(current.parentElement) + ' > ' + sub_path;
        }
        return "css=" + sub_path;
    }
};