import { browser } from "webextension-polyfill-ts";

export class MessageController {
    // constructor(isExtension = true) {
    //     this.isExtension = isExtension;
    // }

    static tabSendMessage(message, tabId, options) {
        console.log("running MessageController.tabSendMessage()");
        if (this.isExtension) {
            console.log(`Message ${message} sent to ${tabId}`);
            console.log(browser.tabs);
            return browser.tabs.sendMessage(tabId, message, options); // ask 這樣 沒有傳的參數就是 undefined??
        } else {
            return window.postMessage(message);
        }
    }

    static runtimeSendMessage(message, extensionId, options) {
        console.log("running MessageController.runtimeSendMessage()");
        if (this.isExtension) {
            console.log(`Message ${message} sent to ${extensionId}`);
            console.log(browser.runtime);
            return browser.runtime.sendMessage(extensionId, message, options);
        } else {
            return window.postMessage(message);
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

MessageController.isExtension = true;
