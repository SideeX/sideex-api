
import { v4 as uuidv4 } from 'uuid';
import { Utils } from '../utils/index';
import { TimeoutError } from './timeoutError';
type MessageListener<T = {}> = (data: MessageData<T>, source?: CrossOriginWindow) => Promise<any>;
declare global {
    interface Window {
        /**
         * @summery Awaitable version of window.postMessage
         * @param {string} eventName only listener register with same `eventName` from `addAsyncMessageListener` will received.
         * @returns `Promise<T = any>` `T` is the listener's return type from `addAsyncMessageListener`
         */
        postMessageAsync<T = any>(eventName: string, data: any, options?: Partial<MessagePostOptions>): Promise<T>
        addAsyncMessageListener<T = {}>(eventName: string, callback: MessageListener<T>): void
        removeAsyncMessageListener<T = {}>(eventName: string, callback: MessageListener<T>): void
    }
}
const messageListeners: Record<string, MessageListener<any>[]> = {};
async function init() {
    if (document.readyState == "loading") {
        await new Promise((resolve) => {
            document.addEventListener("DOMContentLoaded", resolve, { once: true });
        });
    }
    window.addEventListener("message", async (event: WindowMessageEvent) => {
        if (event.data && event.data._details && !event.data._details.callbackId && event.data._details.eventName in messageListeners) {
            const promises: Promise<any>[] = [];
            for (const listerner of messageListeners[event.data._details.eventName]) {
                promises.push(listerner(event.data, event.source as WindowProxy));
            }
            let results: any[] = [];
            const returnObj: MessageData = {
                _details: {
                    id: uuidv4(),
                    callbackId: event.data._details.id,
                    eventName: event.data._details.eventName
                }
            };
            try {
                results = (await Promise.all(promises)).filter(value => value);
                returnObj._details.returnValue = results[0];
            } catch (error) {
                if (error instanceof Error) {
                    returnObj._details.error = error.message;
                } else if (error instanceof String) {
                    returnObj._details.error = error.toString();
                } else {
                    returnObj._details.error = JSON.stringify(error);
                }
            }
            if (Utils.is<Window>(event.source, event?.source?.postMessage instanceof Function)) {
                event.source.postMessage(returnObj, "*");
            } else {
                window.postMessage.call(event.source, returnObj, "*");
            }
            if (results.length > 1) {
                throw new Error(`More than one onMessage listener send response, eventName=${event.data._details.eventName}`);
            }
        }
    });
}
init();
interface WindowMessageEvent<T = {}> extends MessageEvent {
    data: MessageData<T>
}
export type MessageData<T = {}> = T & {
    /** @private For listeners mechanism ,do not put data here. */
    _details?: MessageDetails
}
interface MessageDetails {
    id: string
    eventName: string
    callbackId?: string
    returnValue?: any
    error?: string
}
interface MessagePostOptions {
    targetOrigin: string,
    timeout: number
}
Reflect.defineProperty(window, "postMessageAsync", {
    configurable: true,
    writable: true,
    async value<T = void>(this: Window, eventName: string, data: MessageData, options?: Partial<MessagePostOptions>): Promise<T> {
        return await postMessageCrossOrigin(this, eventName, data, options);
    }
});

Reflect.defineProperty(window, "addAsyncMessageListener", {
    configurable: true,
    writable: true,
    value<T = {}>(eventName: string, callback: MessageListener<T>) {
        if (messageListeners[eventName] == undefined) {
            messageListeners[eventName] = [];
        }
        if (!messageListeners[eventName].includes(callback)) {
            messageListeners[eventName].push(callback);
        }
    }
});

Reflect.defineProperty(window, "removeAsyncMessageListener", {
    configurable: true,
    writable: true,
    value<T = {}>(eventName: string, callback: MessageListener<T>) {
        if (messageListeners[eventName] && messageListeners[eventName].includes(callback)) {
            messageListeners[eventName].remove(callback);
            if (messageListeners[eventName].length == 0) {
                messageListeners[eventName] = undefined;
            }
        }
    }
});


type CrossOriginWindow = Pick<Window, "postMessage">

/**
 * @description async `postMessage` with target window assignment function
 */
export async function postMessageCrossOrigin<T = any>(targetWindow: CrossOriginWindow, eventName: string, data: MessageData, options?: Partial<MessagePostOptions>): Promise<T> {
    const _options = Object.assign({ targetOrigin: "*", timeout: 0 } as MessagePostOptions, options);
    const id = uuidv4();
    data._details = {
        id: id,
        eventName: eventName
    };
    const sendMessage = async () => {
        return await new Promise<T>((resolve, reject) => {
            const callback = (event: WindowMessageEvent) => {
                if (event.data?._details?.callbackId == id) {
                    window.removeEventListener("message", callback);
                    if (event.data._details.error) {
                        reject(event.data._details.error);
                    } else {
                        resolve(event.data._details.returnValue);
                    }
                }
            };
            window.addEventListener("message", callback);
            if (targetWindow?.postMessage instanceof Function) {
                targetWindow.postMessage(data, _options.targetOrigin);
            } else {
                window.postMessage.call(targetWindow, data, _options.targetOrigin);
            }
        });
    };
    if (document.readyState == "loading") {
        await new Promise((resolve) => {
            document.addEventListener("DOMContentLoaded", resolve, { once: true });
        });
    }
    return _options.timeout > 0 ? await Utils.promiseTimeout(sendMessage, _options.timeout, new TimeoutError(`postMessageAsync timeout, eventName=${eventName}`), true) : await sendMessage();
}
// #!endif
