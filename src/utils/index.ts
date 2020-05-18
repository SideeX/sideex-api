import isEqual from "lodash/isEqual";
export * from "./Point";
export * from "./Rectangle";
import Sizzle from "sizzle";
declare global {
    interface CSSStyleDeclaration {
        src: string
    }
    interface String {
        supplant<T>(o1: { [key: string]: T }, o2: { [key: string]: T }): string
        lcfirst(): string
        ucfirst(): string
    }
    interface Array<T> {
        remove(item: T): this
        insert(index: number, item: T): this
    }
    /** @summary To expose all window.something */
    interface Window {
        HTMLElement: typeof HTMLElement
        HTMLBodyElement: typeof HTMLBodyElement
        HTMLImageElement: typeof HTMLImageElement
        SVGSVGElement: typeof SVGSVGElement
        CSSStyleSheet: typeof CSSStyleSheet
    }
    
}

String.prototype.supplant = function <T>(localVarsObj: { [key: string]: T }, globalVarsObj: { [key: string]: T }) {
    return this.replace(/\${([^{}]*)}/g, (match: string, p1: string) => {
        for (let vars of [localVarsObj, globalVarsObj]) {
            let r = vars[p1.trim()];
            if (typeof r == "string" || typeof r == "number") {
                return r.toString();
            }
        }
        throw new TypeError("Variable " + match + " does not defined")
    })
}
String.prototype.lcfirst = function () {
    return this.charAt(0).toLowerCase() + this.substr(1)
}
String.prototype.ucfirst = function () {
    return this.charAt(0).toUpperCase() + this.substr(1)
}
Array.prototype.remove = function <T>(item: T) {
    const index = this.indexOf(item)
    if (index > -1) {
        this.splice(index, 1)
    }
    return this
}
Array.prototype.insert = function <T>(index: number, item: T) {
    return this.splice(index, 0, item)
}
/*
 * Do not use Array.prototype.something = <function> to polyfill directly, may break some website which use `for ... in` loop
 * https://stackoverflow.com/questions/500504/why-is-using-for-in-with-array-iteration-a-bad-idea
 * https://stackoverflow.com/questions/870032/setting-a-custom-property-with-dontenum
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 */
Reflect.defineProperty(Array.prototype, "remove", {
    configurable: true,
    writable: true,
    value<T>(this: Array<T>, item: T) {
        const index = this.indexOf(item);
        if (index > -1) {
            this.splice(index, 1);
            return true;
        }
        return false;
    }
});
Reflect.defineProperty(Array.prototype, "insert", {
    configurable: true,
    writable: true,
    value<T>(this: Array<T>, index: number, item: T) {
        return this.splice(index, 0, item);
    }
});

export abstract class Utils {
    static lcfirst(str: string) {
        return str.charAt(0).toLowerCase() + str.substr(1);
    }

    static ucfirst(str: string) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }

    //self
    /** @summary Returns the text in this element */
    static getText(element: HTMLElement): string {
        let text = element.innerText;

        text = Utils.normalizeNewlines(text);
        text = Utils.normalizeSpaces(text, element);

        return text.trim();
    }

    /**
     * Retrieves the tooltip of an element
     *
     * @param element an <a href="#locators">element locator</a> pointing to an element
     * @return tooltip title
     */
    static getTooltip(element: Element): string {

        if (Utils.is<HTMLElement>(element, element instanceof window.HTMLElement)) {
            if (Utils.is<HTMLImageElement>(element, element.tagName === "IMG")) {
                return element.title;
            } else {
                return element.title;//text tooltip
            }

        } else if (element instanceof SVGElement) { //svg tooltip
            if (element.children.length > 0) { // if children have title, return title
                for (let i = 0; i < element.children.length; i++) {
                    if (element.children[i].tagName === "title") {
                        return element.children[i].textContent;
                    }
                }
            }
            // if children title no found, go to find parent title
            let parent: Node = element.parentNode;
            while (parent instanceof SVGElement) {
                for (let i = 0; i < parent.children.length; i++) {
                    if (parent.children[i].tagName === "title") {
                        return parent.children[i].textContent;
                    }
                }
                parent = parent.parentNode;
            }
        }

        return "";
    }

    static escape(text: string): string {
        return text.replace(/[&"'<>\n\t]/g,
            (m) => ({ "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;", "\n": "\\n", "\t": "\\t" } as { [key: string]: string })[m]);
    }

    static unescape(text: string): string {
        return text.replace(/(&amp;)|(&quot;)|(&#39;)|(&lt;)|(&gt;)|(\\n)|(\\t)/g,
            (m) => ({ "&amp;": "&", "&quot;": '"', "&#39;": "'", "&lt;": "<", "&gt;": ">", "\\n": "\n", "\\t": "\t" } as { [key: string]: string })[m]);
    }

    //self
    /** @summary Convert all newlines to \n */
    static normalizeNewlines(text: string): string {
        return text.replace(/\r\n|\r/g, "\n");
    }

    //self
    /** @summary Replace multiple sequential spaces with a single space, and then convert &nbsp; to space. */
    static normalizeSpaces(text: string, element?: Element): string {
        // Replace multiple spaces with a single space
        if (!element || !getComputedStyle(element).whiteSpace.match("^(pre|pre-line)$")) {
            text = text.replace(/ +/g, " ");
        }
        // Replace &nbsp; with a space
        return text.replace(new RegExp(String.fromCharCode(160), "g"), " ");
    }

    //api, recorder-handler
    /** @summary Get the value of an element */
    static getElementValue(element: Element) {
        let value = element.getAttribute("value") ?? "";
        if (element instanceof HTMLInputElement && ["checkbox", "radio"].includes(element.type)) {
            value = element.checked ? 'on' : 'off';
        } else if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
            value = element.value;
        }
        return value;
    }

    //api, recorder-handler
    /** @summary Get the value of an <input> element */
    static getInputValue(inputElement: HTMLInputElement): string {
        try {
            if (inputElement.type.match("^(checkbox|radio)$")) {
                return (inputElement.checked ? 'on' : 'off')
            }
        } catch (error) {

        }
        return inputElement.value
    }

    //browserbot
    static getTagName(element: Element) {
        try {
            return element.tagName.toLowerCase();
        } catch (error) {
            return null;
        }
    }

    static isInShadowDom(node: Node) {
        for (; node; node = node.parentNode) {
            if (node.nodeType == Node.DOCUMENT_FRAGMENT_NODE)
                return true;
        }
        return false;
    }

    //api
    static extractExceptionMessage(ex: any): string {
        if (ex == null) return "null exception";
        if (ex instanceof Error) return ex.message;
        try {
            return ex.toString();
        } catch (error) {
            return null;
        }
    }


    /**
     * @summary Locator evaluation support
     *
     * @description Parses a Selenium locator, returning its type and the unprefixed locator
     * string as an object.
     *
     * @param {string}locator the locator to parse
     */
    static parse_locator(locator: string): { type: Strategies, string: string } {
        if (locator.includes("TAC_LOCATOR")) {
            return { type: 'tac', string: locator };
        } else {
            const result = locator.match(/^([A-Za-z]+)=.+/);
            if (result) {
                const type = result[1].toLowerCase() as Strategies;
                const actualLocator = locator.substring(type.length + 1);
                return { type: type, string: actualLocator };
            }
            return { type: 'implicit', string: locator };
        }
    }

    //tools
    /** @summary Used by locatorbuilder */
    static exactMatchPattern(string: string = null): string {
        if (string && (string.match(/^\w*:/) || string.match(/\?\*/))) {
            return "exact:" + string;
        } else {
            return string;
        }
    }
    /** @summary Generate full xpath of element */
    //Used by selenium-api
    static xpathGenerator(element: Element): string {
        let path = "";
        for (let current = element; current != null; current = current.parentElement) {
            if (current.parentElement == null) {
                path = "//" + current.tagName.toLowerCase() + path;
                break;
            } else {
                let currentTagName = current.tagName.toLowerCase();
                if (document.createElement(currentTagName).toString() == "[object HTMLUnknownElement]") {
                    currentTagName = "*[name()='" + currentTagName + "']";
                }
                let tagCount = 0;
                let totalTagCount = 0;
                let isFound = false;
                for (const sibling of current.parentElement.children) {
                    if (sibling.tagName == current.tagName) {
                        if (!isFound) {
                            tagCount++;
                        }
                        totalTagCount++;
                    }
                    if (sibling == current) {
                        isFound = true;
                    }
                }
                let newpath = "/" + currentTagName;
                if (totalTagCount > 1) {
                    newpath += "[" + tagCount + "]";
                }
                path = newpath + path;
            }
        }
        return path;
    }

    static async delay(time: number): Promise<void> {
        await new Promise((resolve) => { setTimeout(resolve, time); });
    }

    static isWebdriver() {
        return window.sideex == 'webdriver';
    }

    static getFormatTime() {
        let now = new Date();

        let year = `${now.getFullYear()}`;
        let month = `${now.getMonth() + 1}`.padStart(2, "0");
        let date = `${now.getDate()}`.padStart(2, "0");
        let hours = `${now.getHours()}`.padStart(2, "0");
        let minutes = `${now.getMinutes()}`.padStart(2, "0");
        let seconds = `${now.getSeconds()}`.padStart(2, "0");

        return `${year}${month}${date} ${hours}-${minutes}-${seconds}`;
    }

    static makeTextFile(text: BlobPart, type?: 'html' | 'json' | 'csv' | 'zip') {
        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        let blobType = 'text/plain';
        switch (type) {
            case 'html':
                blobType = 'text/html';
                break;
            case 'json':
                blobType = 'application/json';
                break;
            case 'csv':
                blobType = 'text/csv';
                break;
            case 'zip':
                blobType = 'application/zip';
                break;
        }
        return URL.createObjectURL(new Blob([text], { type: blobType }));
    }

    static releaseObjectURL(url: string) {
        URL.revokeObjectURL(url);
    }
    /**
     * Compare if all elements of two arrays are equal.
     * @param {Array} array1 - First array to be compared.
     * @param {Array} array2 - Second array to be compared.
     * @returns {boolean} true if two arrays are equal.
     */
    static compareTwoArray<T>(array1: T[], array2: T[]): boolean {
        // if the other array is a falsy value, return
        if (!array2)
            return false;

        // compare lengths - can save a lot of time
        if (array1.length != array2.length)
            return false;

        for (let i = 0; i < array1.length; i++) {
            // Check if we have nested arrays
            if (array1[i] instanceof Array && array2[i] instanceof Array) {
                // recurse into the nested arrays
                if (!Utils.compareTwoArray(array1, array2))
                    return false;
            } else if (!isEqual(array1[i], array2[i])) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    }
    /**
     * Remove all child nodes of a node.
     * @argument {Node} node - A node to remove all child nodes.
     */
    static emptyNode(node: Node) {
        while (node.firstChild) {
            node.firstChild.remove();
        }
    }

    /**
     * @description Run a `Promise` or `Async Function` in `timeout`, if time cost more than `timeout`, `timeoutReturn` will return
     * unless `throwError` is `true`, `timeoutReturn` will throw as an exception instead of return.
     * @param promise a `Promise` or `Async Function`
     * @param timeout timeout
     * @param timeoutReturn The return value before time runs out
     * @param throwError `timeoutReturn` will throw as an exception if `true`
     */
    static async promiseTimeout<T, E extends boolean>(promise: Promise<T> | ((...args: any[]) => Promise<T>), timeout: number, timeoutReturn?: E extends true ? any : T, throwError: E = false as E): Promise<T> {
        let _promise: Promise<T>;
        if (promise instanceof Promise) {
            _promise = promise;
        } else {
            _promise = promise();
        }
        return Promise.race([
            (async () => {
                await Utils.delay(timeout);
                if (throwError) {
                    throw timeoutReturn;
                } else {
                    return timeoutReturn;
                }
            })(),
            _promise
        ]);
    }
    static is<T>(_target: any, expression: boolean = true): _target is T {
        return expression;
    }
    /** lock the browser default shortcuts and this should be careful */
    static stopNativeEvent(event: Event | React.BaseSyntheticEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    static assertSutieCaseNameValid(name: string) {
        if (name.length <= 0) {
            throw new Error("You need to type something");
        }
        if (name.match(/\/|\\|:|\?|"|\*|<|>|\||\./gi)) {
            throw new Error(`The name cannot contain . / \\ : * ? " < > |`);
        }
    }
    
    static SeleniumError = class extends Error {
        isSeleniumError: boolean = true
        constructor(message: string) {
            super(message)
        }
    }

    /** @summary Returns the full resultset of a CSS selector evaluation. */
    static eval_css(locator: string, inDocument: Document) {
        return Sizzle(locator, inDocument);
    }
}

export class PatternMatcher {
    private matcher: RegexMatcher
    static strategies: { [key: string]: RegexMatcherConstructor }
    constructor(pattern: string) {
        this.selectStrategy(pattern);
    }
    selectStrategy(pattern: string): void {
        let strategyName = 'glob';
        // by default
        if (/^([a-z-]+):(.*)/.test(pattern)) {
            var possibleNewStrategyName = RegExp.$1;
            var possibleNewPattern = RegExp.$2;
            if (PatternMatcher.strategies[possibleNewStrategyName]) {
                strategyName = possibleNewStrategyName;
                pattern = possibleNewPattern;
            }
        }
        const matchStrategy = PatternMatcher.strategies[strategyName];
        if (!matchStrategy) {
            throw new Utils.SeleniumError("cannot find PatternMatcher.strategies." + strategyName);
        }
        this.matcher = new matchStrategy(pattern);
    }
    matches(actual: string) {
        // Note: appending an empty string avoids a Konqueror bug
        return this.matcher.matches(actual + '');
    }
    /** @summary A "static" convenience method for easy matching */
    static matches(pattern: string, actual: string) {
        return new PatternMatcher(pattern).matches(actual);
    }

    static convertGlobMetaCharsToRegexpMetaChars(glob: string) {
        return glob.replace(/([.^$+(){}[\]\\|])/g, "\\$1")
            .replace(/\?/g, "(.|[\r\n])")
            .replace(/\*/g, "(.|[\r\n])*");
    }
    static regexpFromGlobContains(globContains: string) {
        return PatternMatcher.convertGlobMetaCharsToRegexpMetaChars(globContains);
    }
    static regexpFromGlob = function (glob: string) {
        return "^" + PatternMatcher.convertGlobMetaCharsToRegexpMetaChars(glob) + "$";
    }
}

