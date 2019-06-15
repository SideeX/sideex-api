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
export class Log {
    constructor() {
        this.logs = [];
        this.logTypeMap = {
            debug: [],
            info: [],
            error: [],
            warn: []
        };
    }

    pushLog(type, str) {
        this.logTypeMap[type].push(this.logs.length);
        this.logs.push({
            type: type,
            message: str
        });
        EntryPoint.console.setAutoScrollLog({ isUsed: true });
    }

    clearLog() {
        this.logs = [];
        this.logTypeMap = {
            debug: [],
            info: [],
            error: [],
            warn: []
        };
    }
}
