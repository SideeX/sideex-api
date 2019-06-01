import { SeleniumError } from "./seleniumError";
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
export class PatternMatcher {
    private matcher: RegexMatcher
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
            throw new SeleniumError(`cannot find PatternMatcher.strategies.${strategyName}`);
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
        return `^${PatternMatcher.convertGlobMetaCharsToRegexpMetaChars(glob)}$`;
    }
    static strategies: { [key: string]: new(string: string)=> RegexMatcher } = {
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
}
