import { browser } from "webextension-polyfill-ts";

export class MessageController {
    // constructor(isExtension = true) {
    //     this.isExtension = isExtension;
    // }

    static tabSendMessage(message, tabId, options) {
        if (this.isExtension) {
            return browser.tabs.sendMessage(tabId, message, options);
        } else {
            window.postMessage(message);
            return Promise.resolve('Success');
        }
    }

    static runtimeSendMessage(message, extensionId, options) {
        if (this.isExtension) {
            return browser.runtime.sendMessage(extensionId, message, options);
        } else {
            window.postMessage(message);
            return Promise.resolve('Success');
        }
    }

    static addListener(callback) {
        if (this.isExtension) {
            return browser.runtime.onMessage.addListener(callback);
        } else {
            return window.addEventListener("message", callback);
        }
    }
}

MessageController.isExtension = false;
