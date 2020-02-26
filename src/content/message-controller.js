import { browser } from "webextension-polyfill-ts";

export class MessageController {
    static tabSendMessage(message, tabId, options) {
        if (this.isExtension) {
            console.log("extension");
            return browser.tabs.sendMessage(tabId, message, options);
        } else {
            console.log("api");
            console.log(message);
            window.postMessage(message);
            console.log("finish postmessage");
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
            console.log(callback);
            console.log("listner_extension");
            return browser.runtime.onMessage.addListener(callback);
        } else {
            console.log(callback);
            console.log("listner_others");
            return window.addEventListener("message", callback);
        }
    }
}

// #!if isExt === false
MessageController.isExtension = false;
// #!else
MessageController.isExtension = true;
// #!endif
