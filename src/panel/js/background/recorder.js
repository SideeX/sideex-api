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

// TODO: separate UI
// TODO: check multiple-panel support

/**
 * A recorder to receive and record commands
 * @class
 */
import { browser } from "webextension-polyfill-ts";
import { PreRecorder } from './preRecorder';
import { boundMethod } from "autobind-decorator";
import * as EntryPoint from "../UI/entryPoint";

import { MessageController } from "../../../content/message-controller";

export class BackgroundRecorder {

    /**
     * Initialize recording information and rebind event handlers to itself
     * @constructor
     */
    constructor(root) {
        this.root = root;

        this.isRecord = false;
        this.isSelecting = false;
        this.currentRecordingTabId = {};
        this.currentRecordingWindowId = {};
        this.currentRecordingFrameLocation = {};
        this.currentSelectingTabId = -1;
        this.openedTabNames = {};
        this.openedTabIds = {};
        this.openedTabCount = {};

        this.openedWindowIds = {};
        this.contentWindowId = -1;
        this.selfWindowId = -1;
        this.attached = false;
        this.rebind();

        this.notificationCount = 0;

        this.preRecorder = new PreRecorder(root, this);

        // Always listening
        MessageController.addListener(this.requestHandler);
    }

    /**
     * A handler to receive any request from content script environment
     * @param {Object} message Any JSON-ifiable message
     * @param {Object} sender Details about message sender
     */
    requestHandler(message, sender) {
        if (message.attachRecorderRequest) {
            if (this.attached && this.openedWindowIds[sender.tab.windowId] !== undefined) {
                MessageController.tabSendMessage({ action: "AttachRecorder" }, sender.tab.id);
            }
            return;
        }
    }

    /**
     * A handler to detect change of active tab and record "selectWindow" command
     * @param {Object} activeInfo Information about newly active tab
     */
    tabSwitchHandler(activeInfo) {
        let caseIdText = this.root.fileController.getSelectedCases()[0];
        if (!caseIdText || !this.openedTabIds[caseIdText]) {
            return;
        }

        var self = this;
        // Because the action of capturing this event is so fast that selectWindow command
        // is added before other commands like clicking a link to browse in new tab.
        // Delay a little time to add command in order.
        setTimeout(function () {
            if (self.currentRecordingTabId[caseIdText] === activeInfo.tabId &&
                self.currentRecordingWindowId[caseIdText] === activeInfo.windowId) {
                return;
            }
            // If no commands have been recorded, do not add selectWindow command
            // until the user has selected a starting page to record the commands
            if (this.root.fileController.getRecordNum(caseIdText) === 0) {
                return;
            }
            // Ignore all unknown tabs, the activated tab may not derived from
            // other opened tabs, or it may managed by other SideeX panels
            if (self.openedTabIds[caseIdText][activeInfo.tabId] === undefined)
                return;
            // Tab information has existed, add selectWindow command
            self.currentRecordingTabId[caseIdText] = activeInfo.tabId;
            self.currentRecordingWindowId[caseIdText] = activeInfo.windowId;
            self.currentRecordingFrameLocation[caseIdText] = "root";
            this.root.fileController.insertCommand("after", "selectWindow",
                { options: [{ type: "other", value: self.openedTabIds[caseIdText][activeInfo.tabId] }] },
                { options: [{ type: "other", value: "" }] },
            );
        }, 1000);
    }

    /**
     * A handler to detect change of focused window and record "selectWindow" command
     * @param {Number} windowId
     */
    windowSwitchHandler(windowId) {
        let caseIdText = this.root.fileController.getSelectedCases()[0];
        if (!caseIdText || !this.openedTabIds[caseIdText]) {
            return;
        }

        if (windowId === browser.windows.WINDOW_ID_NONE) {
            // In some Linux window managers, WINDOW_ID_NONE will be listened before switching
            // See MDN reference :
            // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/windows/onFocusChanged
            return;
        }

        // If the activated window is the same as the last, just do nothing
        // selectWindow command will be handled by tabs.onActivated listener
        // if there also has a event of switching an active tab
        if (this.currentRecordingWindowId[caseIdText] === windowId)
            return;

        let self = this;
        browser.tabs.query({
            windowId: windowId,
            active: true
        }).then(function (tabs) {
            if (tabs.length === 0 || self.isPrivilegedPage(tabs[0].url)) {
                return;
            }

            // The activated tab is not the same as the last
            if (tabs[0].id !== self.currentRecordingTabId[caseIdText]) {
                // If no commands have been recorded, do not add selectWindow command
                // until the user has selected a starting page to record the commands
                if (this.root.fileController.getRecordNum(caseIdText) === 0) {
                    return;
                }

                // Ignore all unknown tabs, the activated tab may not derived from
                // other opened tabs, or it may managed by other SideeX panels
                if (self.openedTabIds[caseIdText][tabs[0].id] === undefined)
                    return;

                // Tab information has existed, add selectWindow command
                self.currentRecordingWindowId[caseIdText] = windowId;
                self.currentRecordingTabId[caseIdText] = tabs[0].id;
                self.currentRecordingFrameLocation[caseIdText] = "root";
                this.root.fileController.insertCommand("after", "selectWindow",
                    { options: [{ type: "other", value: self.openedTabIds[caseIdText][tabs[0].id] }] },
                    { options: [{ type: "other", value: "" }] },
                );
            }
            return;
        }).catch(function (error) {
            console.error(error);
        });
    }

    /**
     * A handler to capture information of removed tab and record "close" command
     * @param {Number} tabId
     */
    tabRemovalHandler(tabId) {
        let caseIdText = this.root.fileController.getSelectedCases()[0];
        if (!caseIdText || !this.openedTabIds[caseIdText]) {
            return;
        }

        if (this.openedTabIds[caseIdText][tabId] !== undefined) {
            if (this.currentRecordingTabId[caseIdText] !== tabId) {
                this.root.fileController.insertCommand("after", "selectWindow",
                    { options: [{ type: "other", value: this.openedTabIds[caseIdText][tabId] }] },
                    { options: [{ type: "other", value: "" }] }
                );
                this.root.fileController.insertCommand("after", "close",
                    { options: [{ type: "other", value: this.openedTabIds[caseIdText][tabId] }] },
                    { options: [{ type: "other", value: "" }] },
                );
                this.root.fileController.insertCommand("after", "selectWindow",
                    { options: [{ type: "other", value: this.openedTabIds[caseIdText][this.currentRecordingTabId[caseIdText]] }] },
                    { options: [{ type: "other", value: "" }] },
                );
            } else {
                this.root.fileController.insertCommand("after", "close",
                    { options: [{ type: "other", value: this.openedTabIds[caseIdText][tabId] }] },
                    { options: [{ type: "other", value: "" }] },
                );
            }
            delete this.openedTabNames[caseIdText][this.openedTabIds[caseIdText][tabId]];
            delete this.openedTabIds[caseIdText][tabId];
            this.currentRecordingFrameLocation[caseIdText] = "root";
        }
    }

    /**
     * A handler to notify detail of a tab which is about to be created
     * @param {Object} details Details of newly created tab
     */
    tabsCreatedHandler(details) {
        let caseIdText = this.root.fileController.getSelectedCases()[0];
        if (!caseIdText)
            return;

        if (this.openedTabIds[caseIdText][details.sourceTabId] !== undefined) {
            this.openedTabNames[caseIdText][`win_ser_${this.openedTabCount[caseIdText]}`] = details.tabId;
            this.openedTabIds[caseIdText][details.tabId] = `win_ser_${this.openedTabCount[caseIdText]}`;
            if (details.windowId != undefined) {
                this.addOpenedWindow(details.windowId);
            } else {
                // Google Chrome does not support windowId.
                // Retrieve windowId from tab information.
                let self = this;
                browser.tabs.get(details.tabId)
                    .then(function (tabInfo) {
                        self.addOpenedWindow(tabInfo.windowId);
                        return;
                    }).catch(function (error) {
                        console.error(error);
                    });
            }
            this.openedTabCount[caseIdText]++;
        }
    }

    prepareRecord() {
        if (this.root.fileController.getSelectedSuites().length === 0) {
            this.root.fileController.addTestSuite();
        }

        if (this.root.fileController.getSelectedCases().length === 0) {
            this.root.fileController.addTestCase();
        }
    }

    /**
     * A handler to receive commands from content script environment and deal with them
     * @param {Object} message Any JSON-ifiable message
     * @param {Object} sender Details about message sender
     */
    commandHandler(message, sender) {
        console.log(message, sender);
        if(this.root.api){
            message = message.data;
        }
        if (!message.command || this.openedWindowIds[sender.tab.windowId] === undefined){
            console.log("1");
            return;
        }
        console.log("2");
        let caseIdText = this.root.fileController.getSelectedCases()[0];

        if (!this.root.fileController.getNetworkSpeed()) {
            let speed = this.root.setting.get("networkSpeed");
            this.root.fileController.setNetworkSpeed(speed);
        }

        if (!this.openedTabIds[caseIdText]) {
            this.openedTabIds[caseIdText] = {};
            this.openedTabNames[caseIdText] = {};
            this.currentRecordingFrameLocation[caseIdText] = "root";
            this.currentRecordingTabId[caseIdText] = sender.tab.id;
            this.currentRecordingWindowId[caseIdText] = sender.tab.windowId;
            this.openedTabCount[caseIdText] = 1;
        }

        if (Object.keys(this.openedTabIds[caseIdText]).length === 0) {
            this.currentRecordingTabId[caseIdText] = sender.tab.id;
            this.currentRecordingWindowId[caseIdText] = sender.tab.windowId;
            this.openedTabNames[caseIdText]["win_ser_local"] = sender.tab.id;
            this.openedTabIds[caseIdText][sender.tab.id] = "win_ser_local";
        }

        if (this.root.fileController.getRecordNum(caseIdText) === 0) {
            this.root.fileController.insertCommand("after", "open",
                { options: [{ type: "other", value: sender.tab.url }]},
                { options: [{ type: "other", value: "" }]}
            );
        }

        if (this.openedTabIds[caseIdText][sender.tab.id] === undefined)
            return;

        if (message.frameLocation !== this.currentRecordingFrameLocation[caseIdText]) {
            let newFrameLevels = message.frameLocation.split(':');
            let oldFrameLevels = this.currentRecordingFrameLocation[caseIdText].split(':');
            while (oldFrameLevels.length > newFrameLevels.length) {
                this.root.fileController.insertCommand("after", "selectFrame",
                    { options: [{ type: "other", value: "relative=parent" }]},
                    { options: [{ type: "other", value: "" }]}
                );
                oldFrameLevels.pop();
            }
            while (oldFrameLevels.length !== 0 &&
                oldFrameLevels[oldFrameLevels.length - 1] != newFrameLevels[oldFrameLevels.length - 1]
            ) {
                this.root.fileController.insertCommand("after", "selectFrame",
                    { options: [{ type: "other", value: "relative=parent" }]},
                    { options: [{ type: "other", value: "" }]}
                );
                oldFrameLevels.pop();
            }
            while (oldFrameLevels.length < newFrameLevels.length) {
                this.root.fileController.insertCommand("after", "selectFrame",
                    { options: [{ type: "other", value: "index=" + newFrameLevels[oldFrameLevels.length] }]},
                    { options: [{ type: "other", value: "" }]}
                );
                oldFrameLevels.push(newFrameLevels[oldFrameLevels.length]);
            }
            this.currentRecordingFrameLocation[caseIdText] = message.frameLocation;
        }

        this.preRecorder.preProcess(message, this.selfWindowId);
        if (this.preRecorder.isReturn()) {
            return;
        }

        // handle choose ok/cancel confirm
        if (message.insertBeforeLastCommand) {
            this.root.fileController.addCommandBeforeLastCommand(message.command, message.target, message.value);
        } else {
            this.notification(message.command, message.target.options[0].value, message.value.options[0].value);
            let selectedCaseIdText = this.root.fileController.getSelectedCases()[0];
            let index = this.root.fileController.getRecordNum(selectedCaseIdText);
            // console.log(message.preWaitTime);
            if (index > 0) {
                this.root.fileController.setRecordPreWaitTime(selectedCaseIdText, index - 1, message.preWaitTime);
            }
            this.root.fileController.insertCommand("after", message.command, message.target, message.value);
        }
    }

    /**
     * A handler to receive locators from content script environment
     * @param {Object} message Any JSON-ifiable message
     * @param {Object} sender Details about message sender
     */
    targetHandler(message, sender) {
        // TODO: call UI function(or data-binding)
        if (message.selectTarget) {
            let target = {
                type: message.target[0][1],
                value: message.target[0][0]
            };

            let caseIdText = this.root.fileController.getSelectedCases()[0];
            let index = parseInt(this.root.fileController.getSelectedRecord().split("-")[1]);
            this.root.fileController.setRecordUsedTarget(caseIdText, index, target);

            EntryPoint.workArea.syncEditBlock(caseIdText, index);
            EntryPoint.workArea.syncCommands();
            return;
        }

        if (message.cancelSelectTarget) {
            this.isSelecting = false;
            MessageController.tabSendMessage({action: "SelectElement", selecting: false}, sender.tab.id);
            EntryPoint.workArea.updateEditBlockSelect();
            return;
        }
    }

    /**
     * Register target message handler
     */
    attachTargetRecorder() {
        if (browser.runtime.onMessage.hasListener(this.targetHandler)) {
            return;
        }
        MessageController.addListener(this.targetHandler);
    }

    /**
     * Deregister target message handler
     */
    detachTargetRecorder() {
        if (!browser.runtime.onMessage.hasListener(this.targetHandler)) {
            return;
        }
        browser.runtime.onMessage.removeListener(this.targetHandler);
    }

    /**
     * Check whether the URL begins with privileged scheme
     * @param {String} url A valid URL
     */
    isPrivilegedPage(url) {
        if (url.substr(0, 13) === 'moz-extension' ||
            url.substr(0, 16) === 'chrome-extension') {
            return true;
        }
        return false;
    }

    /**
     * Bind event handlers to currently instantiated instances
     */
    rebind() {
        this.tabSwitchHandler = this.tabSwitchHandler.bind(this);
        this.windowSwitchHandler = this.windowSwitchHandler.bind(this);
        this.tabRemovalHandler = this.tabRemovalHandler.bind(this);
        this.tabsCreatedHandler = this.tabsCreatedHandler.bind(this);
        this.commandHandler = this.commandHandler.bind(this);
        this.targetHandler = this.targetHandler.bind(this);
        this.requestHandler = this.requestHandler.bind(this);
        // this.contentWindowIdListener = this.contentWindowIdListener.bind(this);
    }

    /**
     * Register listeners, enable recording functionality
     */
    attach() {
        if (this.attached) {
            return;
        }
        this.attached = true;
        if(!this.root.api){
            browser.tabs.onActivated.addListener(this.tabSwitchHandler);
            browser.windows.onFocusChanged.addListener(this.windowSwitchHandler);
            browser.tabs.onRemoved.addListener(this.tabRemovalHandler);
            browser.webNavigation.onCreatedNavigationTarget.addListener(this.tabsCreatedHandler);
        }
        MessageController.addListener(this.commandHandler);
        if(!this.root.api)
            this.attachDOMRecorder();
    }

    /**
     * Deregister listeners, disable recording functionality
     */
    detach() {
        if (!this.attached) {
            return;
        }
        this.attached = false;
        if(!this.root.api){
            browser.tabs.onActivated.removeListener(this.tabSwitchHandler);
            browser.windows.onFocusChanged.removeListener(this.windowSwitchHandler);
            browser.tabs.onRemoved.removeListener(this.tabRemovalHandler);
            browser.webNavigation.onCreatedNavigationTarget.removeListener(this.tabsCreatedHandler);
            browser.runtime.onMessage.removeListener(this.commandHandler);
            window.removeEventListener("message", this.commandHandler);
            this.detachDOMRecorder();
        }
    }

    /**
     * Give a window permission to record commands through this recorder
     * @param {Number} windowId An integer which identifies a window
     */
    addOpenedWindow(windowId) {
        this.openedWindowIds[windowId] = true;
    }

    /**
     * Store window id of panel this recorder exists in
     * @param {Number} windowId An integer for identifying this panel window
     */
    setSelfWindowId(windowId) {
        this.selfWindowId = windowId;
    }

    /**
     * Get window id of panel this recorder exists in
     * @return {Number} An integer for identifying this panel window
     */
    getSelfWindowId() {
        return this.selfWindowId;
    }

    /**
     * Store window id of a content script environment this recorder binding to
     * @param {Number} windowId An integer represents a window
     */
    setContentWindowId(windowId) {
        this.contentWindowId = windowId;
    }

    /**
     * Get window id of a content script environment this recorder binding to
     * @return {Number} An integer represents binding window
     */
    getContentWindowId() {
        return this.contentWindowId;
    }

    /**
     * Send message to content scripts to enable DOM listeners
     */
    attachDOMRecorder() {
        browser.tabs.query({
            windowId: this.getContentWindowId(),
            url: "<all_urls>"
        }).then(function (tabs) {
            for (let tab of tabs) {
                MessageController.tabSendMessage({ action: "AttachRecorder" }, tab.id).catch(function () { });
            }
            return;
        }).catch(function (error) { console.error(error); });
    }

    /**
     * Send message to content scripts to disable DOM listeners
     */
    detachDOMRecorder() {
        browser.tabs.query({
            windowId: this.getContentWindowId(),
            url: "<all_urls>"
        }).then(function (tabs) {
            for (let tab of tabs) {
                MessageController.tabSendMessage({ action: "DetachRecorder" }, tab.id).catch(function () { });
            }
            return;
        }).catch(function (error) { console.error(error); });
    }

    /**
     * Send message to current active tab to start selecting target
     */
    async startSelectingTarget() {
        let tabs = await browser.tabs.query({ active: true, windowId: this.contentWindowId });
        if (tabs.length === 0) {
            return Promise.reject("reject");
        } else {
            this.currentSelectingTabId = tabs[0].id;
            this.attachTargetRecorder();
            await MessageController.tabSendMessage({
                action: "SelectElement",
                selecting: true
            }, this.currentSelectingTabId);
        }
        return;
    }

    /**
     * Send message to stop selecting target in the previous selected tab
     */
    stopSelectingTarget() {
        if(!this.root.api)
            this.detachTargetRecorder();
        return MessageController.tabSendMessage({
            action: "SelectElement",
            selecting: false
        }, this.currentSelectingTabId);
    }

    /**
     * Send the show element message to content script.
     * @param {Object} infos - a necessary information object.
     *  - key index {Int}
     *  - key tabId {Int}
     *  - key frameIds {Array}
     *  - key targetValue {String}
     */
    async sendShowElementMessage(infos) {
        try {
            let response = await MessageController.tabSendMessage({
                action: "ShowElement",
                targetValue: infos.targetValue,
                customHtml: infos.customHtml
            }, { frameId: infos.frameIds[infos.index]});
            if (response) {
                if (!response.result) {
                    this.prepareSendNextFrame(infos);
                } else {
                    let text = `Element is found in frame ${infos.index} (id).`;
                    this.root.log.pushLog("info", text);
                }
            }
        } catch (error) {
            if (error.message == "Could not establish connection. Receiving end does not exist") {
                this.prepareSendNextFrame(infos);
            } else {
                this.root.log.pushLog("error", "Unknown error");
            }
        }
        EntryPoint.console.syncLog();
    }

    prepareSendNextFrame(infos) {
        if (infos.index === infos.frameIds.length) {
            this.root.log.pushLog("error", "Element is not found");
        } else {
            infos.index++;
            this.sendShowElementMessage(infos);
        }
    }

    notification(name, target, value) {
        let tempCount = String(this.notificationCount);
        this.notificationCount++;
        // In Chrome, notification.create must have "iconUrl" key in notificationOptions
        browser.notifications.create(tempCount, {
            "type": "basic",
            "iconUrl": "/icons/logo-96.png",
            "title": "Command Recorded",
            "message": `command: ${String(name)}\ntarget: ${String(target)}\nvalue: ${String(value)}`
        });

        setTimeout(function () {
            browser.notifications.clear(tempCount);
        }, 1500);
    }

    @boundMethod
    handleFormatCommand(message) {
        if (message.storeStr) {
            this.root.variables.localVars[message.storeVar] = message.storeStr;
        } else if (message.echoStr) {
            this.root.log.pushLog("info", `echo: ${message.echoStr}`);
        }
    }
    @boundMethod
    contentWindowIdListener(message, sender, response) {
        if (message.selfWindowId != undefined && message.commWindowId != undefined) {
            console.log("sender: ", sender);
            response({check: true});
            this.selfWindowId = message.selfWindowId;
            this.contentWindowId = message.commWindowId;
            this.root.playback.setContentWindowId(this.contentWindowId);
            this.addOpenedWindow(this.contentWindowId);
            this.setSelfWindowId(this.selfWindowId);
            browser.runtime.onMessage.removeListener(this.contentWindowIdListener);
        }
    }
}
