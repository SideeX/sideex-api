import { browser } from "webextension-polyfill-ts";

export class MessageController {
    constructor(isExtension) {
        this.isExtension = isExtension;
    }

    tabSendMessage(message, tabId, options) {
        if (this.isExtension) {
            console.log(`Message ${message} sent to ${tabId}`);
            return browser.tabs.sendMessage(tabId, message, options); // ask 這樣 沒有傳的參數就是 undefined??
        } else {
            return window.postMessage(message);
        }
    }

    runtimeSendMessage(message, extensionId, options) {
        if (this.isExtension) {
            console.log(`Message ${message} sent to ${extensionId}`);
            return browser.runtime.sendMessage(extensionId, message, options);
        } else {
            return window.postMessage(message);
        }
    }

    addListener(callback) {
        if (this.isExtension) {
            return browser.runtime.onMessage.addListener(callback);
        } else {
            return window.addEventListener("message", callback);
        }
    }
}
