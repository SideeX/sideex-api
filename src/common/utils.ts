import Sizzle from "sizzle"
declare global {
    interface CSSStyleDeclaration {
        src: string
    }
    interface String {
        supplant<T>(o: { [key: string]: T }): string
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

String.prototype.supplant = function <T>(o: { [key: string]: T }) {
    return this.replace(/\${([^{}]*)}/g, (match: string, p1: string) => {
        const r = o[p1.trim()]
        if (r instanceof String || r instanceof Number) {
            return r.toString()
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

export class Point {
    x: number
    y: number
    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }
    public add(that: Point): Point {
        return new Point(this.x + that.x, this.y + that.y)
    }
    public sub(that: Point): Point {
        return new Point(this.x - that.x, this.y - that.y)
    }
}
export class Rectangle {
    begin: Point
    end: Point
    constructor(left: number = 0, top: number = 0, right?: number, bottom?: number) {
        this.begin = new Point(left, top)
        this.end = new Point(right ? right : left, bottom ? bottom : top)
    }
    static fromRect(rect: ClientRect | DOMRect): Rectangle {
        return new Rectangle(rect.left, rect.top, rect.right, rect.bottom)
    }
    static isIntersection(a: Rectangle, b: Rectangle): boolean {
        const left = Math.max(a.left, b.left)
        const top = Math.max(a.top, b.top)
        const right = Math.min(a.right, b.right)
        const bottom = Math.min(a.bottom, b.bottom)
        return left < right && top < bottom
    }
    static union(a: Rectangle, b: Rectangle): Rectangle {
        return new Rectangle(
            Math.min(a.left, b.left),
            Math.min(a.top, b.top),
            Math.max(a.right, b.right),
            Math.max(a.bottom, b.bottom)
        )
    }
    get left() { return this.begin.x }
    set left(left: number) { this.begin.x = left }
    get top() { return this.begin.y }
    set top(top: number) { this.begin.y = top }
    get right() { return this.end.x }
    set right(right: number) { this.end.x = right }
    get bottom() { return this.end.y }
    set bottom(bottom: number) { this.end.y = bottom }
    get width() { return Math.max(0, this.right - this.left) }
    get height() { return Math.max(0, this.bottom - this.top) }
    public addRectangle(that: Rectangle): Rectangle {
        return new Rectangle(
            this.left + that.left,
            this.top + that.top,
            this.right + that.right,
            this.bottom + that.bottom
        )
    }
    public addPointOffset(that: Point): Rectangle {
        return new Rectangle(
            this.left + that.x,
            this.top + that.y,
            this.right + that.x,
            this.bottom + that.y
        )
    }
}

export class Utils {
    //self
    /** @summary Returns the text in this element */
    static getText(element: Element): string {
        let text = element.textContent

        text = Utils.normalizeNewlines(text)
        text = Utils.normalizeSpaces(text, element)

        return text.trim()
    }

    //self
    /** @summary Convert all newlines to \n */
    static normalizeNewlines(text: string): string {
        return text.replace(/\r\n|\r/g, "\n")
    }

    //self
    /** @summary Replace multiple sequential spaces with a single space, and then convert &nbsp; to space. */
    static normalizeSpaces(text: string, element?: Element): string {
        // Replace multiple spaces with a single space
        if (!element || !getComputedStyle(element).whiteSpace.match("^(pre|pre\-line)$")) {
            text = text.replace(/\ +/g, " ")
        }
        // Replace &nbsp; with a space
        return text.replace(new RegExp(String.fromCharCode(160), "g"), " ")
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
            return element.tagName.toLowerCase()
        } catch (error) {
            return null
        }
    }

    //api
    static extractExceptionMessage(ex: any): string {
        if (ex == null) return "null exception"
        if (ex instanceof Error) return ex.message
        try {
            return ex.toString()
        } catch (error) {
            return null
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
            return { type: 'tac', string: locator }
        } else {
            const result = locator.match(/^([A-Za-z]+)=.+/)
            if (result) {
                const type = result[1].toLowerCase();
                const actualLocator = locator.substring(type.length + 1)
                return { type: type, string: actualLocator }
            }
            return { type: 'implicit', string: locator }
        }
    }
    /** @summary Returns the full resultset of a CSS selector evaluation. */
    static eval_css(locator: string, inDocument: Document) {
        return Sizzle(locator, inDocument)
    }

    //tools
    /** @summary Used by locatorbuilder */
    static exactMatchPattern(string: string = null): string {
        if (string && (string.match(/^\w*:/) || string.match(/\?\*/))) {
            return "exact:" + string
        } else {
            return string
        }
    }
    /** @summary Generate full xpath of element */
    //Used by selenium-api
    static xpathGenerator(element: Element): string {
        let path = ""
        for (let current = element; current != null; current = current.parentElement) {
            if (current.parentElement == null) {
                path = "//" + current.tagName.toLowerCase() + path
                break
            } else {
                let currentTagName = current.tagName.toLowerCase()
                if (window.document.createElement(currentTagName).toString() == "[object HTMLUnknownElement]") {
                    currentTagName = "*[name()='" + currentTagName + "']"
                }
                let tagCount = 0
                let totalTagCount = 0
                let isFound = false
                for (const sibling of current.parentElement.children) {
                    if (sibling.tagName == current.tagName) {
                        if (!isFound) {
                            tagCount++
                        }
                        totalTagCount++
                    }
                    if (sibling == current) {
                        isFound = true;
                    }
                }
                let newpath = "/" + currentTagName
                if (totalTagCount > 1) {
                    newpath += "[" + tagCount + "]"
                }
                path = newpath + path
            }
        }
        return path
    }

    static async delay(time: number): Promise<void> {
        await new Promise((resolve) => { setTimeout(resolve, time) })
    }

    static async readTextFile(path: string): Promise<string> {
        const response = await fetch(path, { method: "GET" })
        if (response.ok) {
            return response.text()
        } else {
            throw response
        }
    }

    // Panel
    /** @summary Used by command_grid, log */
    static safeScrollIntoView(element: Element): void {
        try {
            element.scrollIntoView(false)
        } catch (error) {

        }
    }
    static SeleniumError = class extends Error {
        isSeleniumError: boolean = true
        constructor(message: string) {
            super(message)
        }
    }
}

export class RegexMatcher {
    private regexp: RegExp
    constructor(regexp: RegExp) {
        this.regexp = regexp;
    }
    matches(actual: string) {
        return this.regexp.test(actual);
    }
}
export interface RegexMatcherConstructor {
    new(string: string): RegexMatcher
}
//api, browserbot
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
PatternMatcher.strategies = {
    /** @summary Exact matching, e.g. "exact:***" */
    exact: class extends RegexMatcher {
        constructor(expected: string) {
            //overwrite default match strategy
            super(null);
            this.matches = function (actual: string) {
                return expected == actual;
            };
        }
    },
    /** @summary Match by regular expression, e.g. "regexp:^[0-9]+$" */
    regexp: class extends RegexMatcher {
        constructor(regexpString: string) {
            super(new RegExp(regexpString));
        }
    },
    regex: class extends RegexMatcher {
        constructor(regexpString: string) {
            super(new RegExp(regexpString));
        }
    },
    regexpi: class extends RegexMatcher {
        constructor(regexpString: string) {
            super(new RegExp(regexpString, "i"));
        }
    },
    regexi: class extends RegexMatcher {
        constructor(regexpString: string) {
            super(new RegExp(regexpString, "i"));
        }
    },

    /**
     * @summary "globContains" (aka "wildmat") patterns, e.g. "glob:one,two,*",
     * but don't require a perfect match; instead succeed if actual
     * contains something that matches globString.
     * @description Making this distinction is motivated by a bug in IE6 which
     * leads to the browser hanging if we implement *TextPresent tests
     * by just matching against a regular expression beginning and
     * ending with ".*".  The globcontains strategy allows us to satisfy
     * the functional needs of the *TextPresent ops more efficiently
     * and so avoid running into this IE6 freeze.
     */
    globContains: class extends RegexMatcher {
        constructor(globString: string) {
            super(new RegExp(PatternMatcher.regexpFromGlobContains(globString)));
        }
    },
    /** @summary "glob" (aka "wildmat") patterns, e.g. "glob:one,two,*" */
    glob: class extends RegexMatcher {
        constructor(globString: string) {
            super(new RegExp(PatternMatcher.regexpFromGlob(globString)));
        }
    }
};