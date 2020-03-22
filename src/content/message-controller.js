import { browser } from "webextension-polyfill-ts";

export class MessageController {
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

// #!if isExt === false
MessageController.isExtension = false;
// #!else
MessageController.isExtension = true;
// #!endif
