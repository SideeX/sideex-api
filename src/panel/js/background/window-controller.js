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

export class WindowController {

    constructor(playback = null) {
        this.playingTabNames = {};
        this.playingTabIds = {};
        this.playingTabStatus = {};
        this.playingFrameLocations = {};
        this.playingTabCount = 1;
        this.currentPlayingTabId = -1;
        this.contentWindowId = 0;
        this.playback = playback;
        this.currentPlayingFrameLocation = 'root';
        this.waitInterval = WindowController.DEFAULT_WAIT_INTERVAL;
        this.waitTimes = WindowController.DEFAULT_WAIT_TIMES;
        this.attached = false;
        this.bindAll();
    }

    tabStatusHandler(tabId, changeInfo) {
        if (changeInfo.status) {
            if (changeInfo.status == "loading") {
                this.setLoading(tabId);
            } else {
                this.setComplete(tabId);
            }
        }
    }

    frameLocationMessageHandler(message, sender) {
        if (message.frameLocation) {
            this.setFrame(sender.tab.id, message.frameLocation, sender.frameId);
        }
    }

    newTabHandler(details) {
        if (this.hasTab(details.sourceTabId)) {
            this.setNewTab(details.tabId);
        }
    }

    bindAll() {
        this.tabStatusHandler = this.tabStatusHandler.bind(this);
        this.frameLocationMessageHandler = this.frameLocationMessageHandler.bind(this);
        this.newTabHandler = this.newTabHandler.bind(this);
    }

    async init() {
        this.attach();
        this.playingTabNames = {};
        this.playingTabIds = {};
        this.playingTabStatus = {};
        this.playingFrameLocations = {};
        this.playingTabCount = 1;
        this.currentPlayingTabId = undefined;
        this.currentPlayingWindowId = undefined;
        this.currentPlayingFrameLocation = "root";
        let tab = await this.queryActiveTab(this.contentWindowId);
        await this.setFirstTab(tab);
    }

    clear() {
        this.detach();
        this.playingTabNames = {};
        this.playingTabIds = {};
        this.playingTabStatus = {};
        this.playingFrameLocations = {};
        this.playingTabCount = 1;
        this.currentPlayingTabId = undefined;
        this.currentPlayingWindowId = undefined;
        this.currentPlayingFrameLocation = "root";
    }

    attach() {
        if (this.attached) {
            return;
        }
        this.attached = true;
        browser.tabs.onUpdated.addListener(this.tabStatusHandler);
        browser.runtime.onMessage.addListener(this.frameLocationMessageHandler);
        browser.webNavigation.onCreatedNavigationTarget.addListener(this.newTabHandler);
    }

    detach() {
        if (!this.attached) {
            return;
        }
        this.attached = false;
        browser.tabs.onUpdated.removeListener(this.tabsOnUpdatedHandler);
        browser.runtime.onMessage.removeListener(this.frameLocationMessageHandler);
        browser.webNavigation.onCreatedNavigationTarget.removeListener(this.newTabHandler);
    }

    setContentWindowId(contentWindowId) {
        this.contentWindowId = contentWindowId;
    }

    getContentWindowId() {
        return this.contentWindowId;
    }

    getCurrentPlayingTabId() {
        return this.currentPlayingTabId;
    }

    getCurrentPlayingFrameLocation() {
        return this.currentPlayingFrameLocation;
    }

    getFrameId(tabId) {
        if (tabId >= 0) {
            return this.playingFrameLocations[tabId][this.currentPlayingFrameLocation];
        } else {
            return this.playingFrameLocations[this.currentPlayingTabId][this.currentPlayingFrameLocation];
        }
    }

    getCurrentPlayingFrameId() {
        return this.getFrameId(this.currentPlayingTabId);
    }

    getPageStatus() {
        return this.playingTabStatus[this.getCurrentPlayingTabId()];
    }

    async queryActiveTab(windowId) {
        let tabs = await browser.tabs.query({windowId: windowId, active: true, url: ["http://*/*", "https://*/*"]});
        return tabs[0];
    }

    async sendCommand(command, target, value, index, top) {
        let tabId = this.getCurrentPlayingTabId();
        let frameId = this.getCurrentPlayingFrameId();
        let action = ("waitSeries" === command ) ? "Wait" : "Command";
        return await browser.tabs.sendMessage(tabId, {
            action: action,
            command: command,
            target: target,
            value: value,
            index: index
        }, { frameId: top ? 0 : frameId });
    }

    setLoading(tabId) {
        // Does clearing the object will cause some problem(e.g. missing the frameId)?
        // Ans: Yes, but I don't know why
        this.initTabInfo(tabId);
        // this.initTabInfo(tabId, true); (failed)
        this.playingTabStatus[tabId] = false;
    }

    setComplete(tabId) {
        this.initTabInfo(tabId);
        this.playingTabStatus[tabId] = true;
    }

    initTabInfo(tabId, forced) {
        if (this.playingFrameLocations[tabId] == undefined | forced) {
            this.playingFrameLocations[tabId] = {};
            this.playingFrameLocations[tabId]["root"] = 0;
        }
    }

    setFrame(tabId, frameLocation, frameId) {
        this.playingFrameLocations[tabId][frameLocation] = frameId;
    }

    hasTab(tabId) {
        return this.playingTabIds[tabId];
    }

    setNewTab(tabId) {
        this.playingTabNames["win_ser_" + this.playingTabCount] = tabId;
        this.playingTabIds[tabId] = "win_ser_" + this.playingTabCount;
        this.initTabInfo(tabId);
        this.playingTabCount++;
    }

    async doOpen(url) {
        await browser.tabs.update(this.currentPlayingTabId, {url: url});
        return;
    }

    // TODO: "pause" command should belong to panel command set
    async doPause(ignored, milliseconds) {
        return new Promise(function(resolve) {
            setTimeout(resolve, milliseconds);
        });
    }

    async doSelectFrame(relativePosition) {
        let result = relativePosition.match(/(index|relative) *= *([\d]+|parent)/i);
        if (result && result[2]) {
            let position = result[2];
            if (position == "parent") {
                if (this.currentPlayingFrameLocation != "root")
                    this.currentPlayingFrameLocation = this.currentPlayingFrameLocation.slice(0, this.currentPlayingFrameLocation.lastIndexOf(':'));
            } else {
                this.currentPlayingFrameLocation += ":" + position;
            }
            await this.wait("No matched frame", "playingFrameLocations", this.currentPlayingTabId, this.currentPlayingFrameLocation);
            return;
        } else {
            return Promise.reject("Invalid argument");
        }
    }

    async doSelectWindow(serialNumber) {
        await this.wait("No matched window", "playingTabNames", serialNumber);
        await browser.tabs.update(this.playingTabNames[serialNumber], {active: true});
        this.currentPlayingTabId = this.playingTabNames[serialNumber];
        this.currentPlayingFrameLocation = "root";
        return;
    }

    async doClose(serialNumber) {
        let removingTabId = (serialNumber == "" || serialNumber == undefined)
            ? this.currentPlayingTabId : this.playingTabNames[serialNumber];
        delete this.playingFrameLocations[removingTabId];
        delete this.playingTabNames[this.playingTabIds[removingTabId]];
        delete this.playingTabIds[removingTabId];
        await browser.tabs.remove(removingTabId);
        return;
    }

    setWaitConfig(waitInterval, waitTimes) {
        if (waitInterval >= 0)
            this.waitInterval = waitInterval;
        if (waitTimes > 0)
            this.waitTimes = waitTimes;
    }

    wait(errorMessage, ...properties) {
        if (!properties.length)
            return Promise.reject("No arguments");
        let self = this;
        let ref = this;
        let inspecting = properties[properties.length - 1];
        for (let i = 0; i < properties.length - 1; i++) {
            if (!ref[properties[i]] | !(ref[properties[i]] instanceof Array | ref[properties[i]] instanceof Object))
                return Promise.reject("Invalid Argument");
            ref = ref[properties[i]];
        }
        return new Promise(function(resolve, reject) {
            let counter = 0;
            let interval = setInterval(function() {
                if (ref[inspecting] === undefined || ref[inspecting] === false) {
                    counter++;
                    if (counter > self.waitTimes) {
                        reject(errorMessage);
                        clearInterval(interval);
                    }
                } else {
                    resolve();
                    clearInterval(interval);
                }
            }, self.waitInterval);
        });
    }

    async updateOrCreateTab() {
        let tabs = await browser.tabs.query({windowId: this.contentWindowId, active: true});
        if (tabs.length === 0) {
            let window = await browser.windows.create({url: WindowController.DEFAULT_WEB_INIT_URL});
            this.playback.setContentWindowId(window.id);
            await this.setFirstTab(window.tabs[0]);
            recorder.addOpenedWindow(window.id);
            let backgroundWindow = await browser.runtime.getBackgroundPage();
            backgroundWindow.bind(window.id, recorder.getSelfWindowId());
        } else {
            let tab = await browser.tabs.update(tabs[0].id, {url: WindowController.DEFAULT_WEB_INIT_URL});
            await this.wait("No response", "playingTabStatus", tab.id);
            // Firefox did not update url information when tab is updated
            // We assign url manually and go to set first tab
            tab.url = WindowController.DEFAULT_WEB_INIT_URL;
            await this.setFirstTab(tab);
        }
    }

    async setFirstTab(tab) {
        if (!tab || (tab.url && this.isAddOnPage(tab.url))) {
            await this.updateOrCreateTab();
        } else {
            this.currentPlayingTabId = tab.id;
            this.currentPlayingWindowId = tab.windowId;
            this.playingTabNames["win_ser_local"] = this.currentPlayingTabId;
            this.playingTabIds[this.currentPlayingTabId] = "win_ser_local";
            this.playingFrameLocations[this.currentPlayingTabId] = {};
            this.playingFrameLocations[this.currentPlayingTabId]["root"] = 0;
            // we assume that there has an "open" command
            // select Frame directly will cause failed
            this.playingTabStatus[this.currentPlayingTabId] = true;
        }
    }

    isAddOnPage(url) {
        if (url.startsWith("https://addons.mozilla.org") ||
            url.startsWith("https://chrome.google.com/webstore")) {
            return true;
        }
        return false;
    }
}

WindowController.DEFAULT_WAIT_INTERVAL = 100;
WindowController.DEFAULT_WAIT_TIMES = 100;
WindowController.DEFAULT_WEB_INIT_URL = "https://google.com";
