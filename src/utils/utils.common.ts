
declare global {
    interface CSSStyleDeclaration {
        src?: string
    }
    interface Array<T> {
        remove(item: T): this
        insert(index: number, item: T): this
    }
    /** @summary To expose all `window.something` */
    interface Window {
        HTMLElement: typeof HTMLElement
        HTMLHtmlElement: typeof HTMLHtmlElement
        HTMLBodyElement: typeof HTMLBodyElement
        HTMLImageElement: typeof HTMLImageElement
        SVGSVGElement: typeof SVGSVGElement
        CSSStyleSheet: typeof CSSStyleSheet
        sideex?: "webdriver"
    }
}

Array.prototype.remove = function <T>(item: T) {
    const index = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
    }
    return this;
};
Array.prototype.insert = function <T>(index: number, item: T) {
    return this.splice(index, 0, item);
};

export abstract class Utils {
    static lcfirst = function (str: string) {
        return str.charAt(0).toLowerCase() + str.substr(1);
    };

    static ucfirst = function (str: string) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    };

    static supplant(str: string, localVarsObj: { [key: string]: any }, globalVarsObj: { [key: string]: any }) {
        return str.replace(/\${([^{}]*)}/g, (match: string, p1: string) => {
            for (let vars of [localVarsObj, globalVarsObj]) {
                let r = vars[p1.trim()];
                if (typeof r == "string" || typeof r == "number") {
                    return r.toString();
                }
            }
            throw new TypeError("Variable " + match + " is not defined");
        });
    }

    //self
    /** @summary Returns the text in this element */
    static getText(element: Element): string {
        let text = element.textContent;

        text = Utils.normalizeNewlines(text);
        text = Utils.normalizeSpaces(text, element);

        return text.trim();
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
    static getElementValue(element: Element): string {
        if (element instanceof HTMLInputElement) {
            element as HTMLInputElement;
            return element.type.match("^(checkbox|radio)$") ?
                (element.checked ? 'on' : 'off') : element.value;
        } else if (element instanceof HTMLSelectElement) {
            element as HTMLSelectElement;
            return element.value;
        } else if (element instanceof HTMLTextAreaElement) {
            element as HTMLTextAreaElement;
            return element.value;
        }
        let value = element.getAttribute("value");
        return value ? value : "";
    }

    //browserbot
    static getTagName(element: Element) {
        try {
            return element.tagName.toLowerCase();
        } catch (error) {
            return null;
        }
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
    static parse_locator(locator: string): { type: string, string: string } {
        if (locator.includes("TAC_LOCATOR")) {
            return { type: 'tac', string: locator };
        } else {
            const result = locator.match(/^([A-Za-z]+)=.+/);
            if (result) {
                const type = result[1].toLowerCase();
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
                if (window.document.createElement(currentTagName).toString() == "[object HTMLUnknownElement]") {
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

    static async readTextFile(path: string): Promise<string> {
        const response = await fetch(path, { method: "GET" });
        if (response.ok) {
            return response.text();
        } else {
            throw response;
        }
    }

    // Panel
    /** @summary Used by command_grid, log */
    static safeScrollIntoView(element: Element): void {
        try {
            element.scrollIntoView(false);
        } catch (error) {

        }
    }
    static isWebdriver() {
        return typeof window.sideex !== 'undefined';
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

    static makeTextFile(text: string, type?: 'json') {
        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        let data = new Blob([text], { type: 'application/json' });
        return window.URL.createObjectURL(data);
    }

    static releaseObjectURL(url: string) {
        window.URL.revokeObjectURL(url);
    }
}
