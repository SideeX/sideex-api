import { browser } from "webextension-polyfill-ts";

export class MessageController {
    // constructor(isExtension = true) {
    //     this.isExtension = isExtension;
    // }

    static tabSendMessage(message, tabId, options) {
        if (this.isExtension) {
            return browser.tabs.sendMessage(tabId, message, options);
        } else {
            console.log("ruunning tabSendMessage");
            return window.postMessage(message);
        }
    }

    static runtimeSendMessage(message, extensionId, options) {
        if (this.isExtension) {
            return browser.runtime.sendMessage(extensionId, message, options);
        } else {
            console.log("ruunning runtimeSendMessage");
            return window.postMessage(message);
        }
    }

    static addListener(callback) {
        if (this.isExtension) {
            return browser.runtime.onMessage.addListener(callback);
        } else {
            console.log("ruunning addListener");
            return window.addEventListener("message", callback);
        }
    }
}

MessageController.isExtension = false;
