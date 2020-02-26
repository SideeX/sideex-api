import Sizzle from "sizzle";

export abstract class Utils {
    /** @summary Returns the full resultset of a CSS selector evaluation. */
    static eval_css(locator: string, inDocument: Document) {
        return Sizzle(locator, inDocument);
    }
}
