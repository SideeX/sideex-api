import { browser } from "webextension-polyfill-ts";

export class Setting {
    constructor(isDomBased) {
        this.params = {
            // basic
            delay: 0,
            tac: false,
            networkSpeed: -1,
            theme: 0, // it should be constant

            // periodical
            isPeriodical: false,
            period: 0.1
        };
        this.isDomBased = isDomBased;

        if (isDomBased) {
            this.init();
        }
    }

    async init() {
        browser.storage.onChanged.addListener(this.syncHandler.bind(this));
        let results = await browser.storage.sync.get();
        this.params = { ...this.params, ...results };
    }

    /**
     * Set value to specific key in storage
     * @param {String} key A specific key
     * @param {String} value A single value
     */
    set(obj) {
        for (let key in obj) {
            if (!(key in this.params)) {
                console.error(`key "${key}" is not in settings`);
            }
            this.params[key] = obj[key];
        }

        if (this.isDomBased) {
            this.syncStorage(obj);
        }
    }

    /**
     * Retrieve single value from storage
     * @param {String} key A key to retrieve data from storage
     * @return {*} A single value
     */
    get(key) {
        if (key in this.params) {
            return this.params[key];
        }
        return undefined;
    }

    async syncStorage(obj) {
        let result = await browser.storage.sync.set(obj);
        // console.log(result);
    }

    async retrieve(keys) {
        let results = await browser.storage.sync.get(keys);
        for (key in results) {
            this.params[key] = results[key];
        }
    }

    importSetting(path) {

    }

    exportSetting(path) {

    }

    /**
     * A Handler for synchronizing with any changes in storage
     * @param {Object} changes All changes in a short interval
     */
    syncHandler(changes) {
        for (let item in changes) {
            if ("newValue" in changes[item]) {
                // The data has been updated or created
                this.params[item] = changes[item].newValue;
            } else {
                // The data has been removed
                delete this.params[item];
            }
        }
    }
}