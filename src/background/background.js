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
import { browser } from "webextension-polyfill-ts";
import { Utils } from "../common/utils";

let master = {};
let clickEnabled = true;
let menusCreated = false;
const menuElements = [
    "verifyText",
    "verifyTitle",
    "verifyValue",
    "assertText",
    "assertTitle",
    "assertValue",
    "storeText",
    "storeTitle",
    "storeValue"
];

browser.tabs.onUpdated.addListener(async function (tabId, changeInfo, tabInfo) {
    if (changeInfo.status && changeInfo.status == "complete") {
        console.log("master: ", master);
        for (const contentWindowId of Object.keys(master)) {
            if (master[contentWindowId] === tabInfo.windowId) {
                try {
                    const response = await browser.tabs.sendMessage(tabId, {
                        selfWindowId: tabInfo.windowId,
                        commWindowId: Number(contentWindowId)
                    });
                    return response.check;
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
});

browser.windows.onRemoved.addListener(function (windowId) {
    for (let contentWindowId in master) {
        if (master[contentWindowId] === windowId) {
            unbind(contentWindowId);
        }
    }
});

browser.browserAction.onClicked.addListener(async function focusOrCreatePanel(tab) {
    let contentWindowId = tab.windowId;
    if (master[contentWindowId] != undefined) {
        await browser.windows.update(master[contentWindowId], { focused: true });
        return;
    } else if (!clickEnabled) {
        return;
    }

    // If we click the icon continually in a very short time,
    // multiple panels will be created and binded to the same window.
    // Add a little delay to prevent unexpected error.
    clickEnabled = false;
    (async () => {
        await Utils.delay(1000);
        clickEnabled = true;
    })();

    try {
        const panelWindowInfo = await browser.windows.create({
            url: browser.runtime.getURL("panel/index.html"),
            type: "popup",
            height: 150 + 22,
            width: 600
        });
        bind(contentWindowId, panelWindowInfo.id);
    } catch (error) {
        unbind(contentWindowId);
    }
});



function bind(contentWindowId, panelWindowId) {
    master[contentWindowId] = panelWindowId;
    if (!menusCreated) {
        menusCreated = true;
        createMenus();
    }
}

function unbind(contentWindowId) {
    delete master[contentWindowId];
    if (Object.keys(master).length === 0) {
        browser.contextMenus.removeAll().then(function () {
            menusCreated = false;
            return;
        }).catch(function () {
            // always success
        });
    }
}

function createMenus() {
    for (let element of menuElements) {
        browser.contextMenus.create({
            id: element,
            title: element,
            documentUrlPatterns: ["<all_urls>"],
            contexts: ["all"]
        });
    }
}

var port;
browser.contextMenus.onClicked.addListener(function (info) {
    port.postMessage({ cmd: info.menuItemId });
});

browser.runtime.onConnect.addListener(function (p) {
    port = p;
});

browser.runtime.onInstalled.addListener(async function (details) {
    if (details.reason == "install" || details.reason == "update") {
        await browser.tabs.create({ url: "http://sideex.org" });
    }
});
