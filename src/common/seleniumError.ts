export class SeleniumError extends Error {
    isSeleniumError: boolean = true
    constructor(message: string) {
        super(message);
    }
}
