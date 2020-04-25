/*
 * Copyright 2017 SideeX committers
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

// #!if isExt === true
import { browser } from "webextension-polyfill-ts";
// #!endif

/**
 * A copy of data storage in an extension
 * @class
 */
class Storage {

    /**
     * Retrieve all data from storage and sync with storage
     * @constructor
     */
    constructor() {
        this.params = {
            // basic
            delay: 0,
            networkSpeed: -1,
            theme: 0, // it should be constant

            // periodical
            isPeriodical: false,
            period: 0.1
        };
        this.init();
    }

    async init() {
        browser.storage.onChanged.addListener(
            /**
            * A Handler for synchronizing with any changes in storage
            * @param {Object} changes All changes in a short interval
            */
            (changes) => {
                for (let item in changes) {
                    if (changes[item].newValue) {
                        // The data has been updated or created
                        this.params[item] = changes[item].newValue;
                    } else {
                        // The data has been removed
                        delete this.params[item];
                    }
                }
            });
        let results = await browser.storage.sync.get();
        this.params = { ...this.params, ...results };
    }

    /**
     * Set value to specific key in storage
     * @param {String} key A specific key
     * @param {String} value A single value
     */
    set(key, value) {
        this.params[key] = value;
        browser.storage.sync.set({ [key]: value });
    }

    /**
     * Retrieve single value from storage
     * @param {String} key A key to retrieve data from storage
     * @return {*} A single value
     */
    get(key) {
        return this.params[key];
    }

    async syncPanel(obj) {
        let result = await browser.storage.sync.set(obj);
        // console.log(result);
    }

    async retrieve(keys) {
        let results = await browser.storage.sync.get(keys);
        for (key in results) {
            this[key] = results[key];
        }
    }
}
const storage = new Storage()
export default storage;