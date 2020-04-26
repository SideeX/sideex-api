import "../utils/windowListeners";

export class MessageController {
    static tabSendMessage(message, tabId, options) {
        if (this.isExtension) {
            return browser.tabs.sendMessage(tabId, message, options);
        } else {
            return window.postMessageAsync("message", message);
            // window.postMessage(message);
            // return Promise.resolve('Success');
        }
    }

    static runtimeSendMessage(message, extensionId, options) {
        if (this.isExtension) {
            return browser.runtime.sendMessage(extensionId, message, options);
        } else {
            // window.postMessage(message);
            // return Promise.resolve('Success');
            return window.postMessageAsync("message", message);
        }
    }

    static addListener(callback) {
        if (this.isExtension) {
            return browser.runtime.onMessage.addListener(callback);
        } else {
            // return window.addEventListener("message", callback);
            return window.addAsyncMessageListener("message", callback);
        }
    }
}

// #!if isExt === false
MessageController.isExtension = false;
// #!else
MessageController.isExtension = true;
// #!endif
