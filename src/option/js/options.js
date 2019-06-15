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
import storage from "../../common/storage";
import { browser } from "webextension-polyfill-ts";

$(document).ready(function () {
    browser.storage.sync.get()
        .then(results => setUIStatus("init", results))
        .catch((e) => { console.error(e); });
    browser.storage.onChanged.addListener(changes => setUIStatus("change", changes));

    $("#periodical").change(function (event) {
        document.querySelector(".period-select").classList.toggle("display-none");
        storage.set("periodical", event.target.checked);
    });

    $("#period-select").change(function (event) {
        storage.set("period", Number(event.target.value));
    });
});

function setUIStatus(type, results) {
    for (let key in results) {
        let value = type === "change" ? results[key].newValue : results[key];
        if (key == "periodical") {
            document.querySelector("#periodical").checked = value;
            value ?
                document.querySelector(".period-select").classList.remove("display-none") :
                document.querySelector(".period-select").classList.add("display-none");
        } else if (key == "period") {
            $('#period-select.selectpicker').selectpicker('val', value);
        }
    }
}
