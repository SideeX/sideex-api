import $ from "jquery";

export class FileTransformer {
    constructor(root, parent) {
        this.root = root;
        this.parent = parent;
        this.fileController = parent.parent;

        this.olderTestCaseFiles = undefined;
        this.seleniumBase = undefined;
        if (root.isDOMBased) {
            // this.addTransformFileEvent();
        }
    }

    // for load in testCase
    transformVersion(input) {
        this.getSeleniumBase(input);
        let component = this.splitTbody(input);
        component[1] = this.addDatalistTag(component[1]);
        component[0] = this.addMeta(component[0]);
        return component[0] + component[1] + component[2];
    }

    checkIsTestSuite(input) {
        if (input.search("suiteTable") >= 0) {
            return true;
        }
        return false;
    }

    // for load in testSuite
    transformTestSuiteVersion(str) {
        let component = this.splitTbody(str);
        caseResult = this.loadCaseIntoSuite(component[1]);
        return caseResult;
    }

    loadCaseIntoSuite(str) {
        let href = [];
        // find what testCase link is in the testSuite
        // let anchor = str.match(/<a href=\"([a-z]|[A-Z]|[0-9])*.html\">/g);
        let anchor = str.match(/<a href="[^"]*">/g);
        for (let i = 0; i < anchor.length; i++) {
            let temp = anchor[i];
            href[i] = temp.substring(temp.indexOf("\"") + 1, temp.lastIndexOf("\""));
        }

        let testCaseName = "";
        testCaseName += ("\"" + href[0] + "\"");
        for (let i = 1; i < href.length; i++) {
            testCaseName += (", \"" + href[i] + "\"");
        }

        // ask user to load testCase
        this.openOldFileDialog("The is test suite of early version of Selenium IDE. Please load " + testCaseName)
            .then(function (answer) {
                if (answer == "true") {
                    document.getElementById("load-older-testSuite").click();
                }
                return;
            }).catch(function () {

            });
        return;
    }

    addTransformFileEvent() {
        var self = this;
        document.getElementById("load-older-testSuite").addEventListener("change", event => {
            event.stopPropagation();
            this.olderTestCaseFiles = event.target.files;
            self.readOlderTestCase(event.target.files[0], 0, event.target.files.length);
        }, false);
    }

    readOlderTestCase(file, index, filesLength) {
        var reader = new FileReader();
        reader.onload = (event) => {

            // NOTE: Because append testCase need one by one ,
            // there write a recursive loop for doing this
            this.parent.olderTestSuiteResult = this.appendOlderTestCase(event.target.result);
            if (index == filesLength - 1) {
                this.appendTestSuite(this.parent.olderTestSuiteFile, this.parent.olderTestSuiteResult);
            } else {
                index += 1;
                this.readOlderTestCase(this.olderTestCaseFiles[index], index, filesLength);
            }
        };
        reader.onerror = function (e) {
            console.log("Error", e);
        };
        reader.readAsText(file);
    }

    appendOlderTestCase(str) {
        this.getSeleniumBase(str);
        let postindex = this.parent.olderTestSuiteResult.indexOf("</body>");
        let fore = this.parent.olderTestSuiteResult.substring(0, postindex);
        let back = this.parent.olderTestSuiteResult.substring(postindex);
        fore += this.addDatalistTag(this.splitTag(str, "table"));

        return fore + back;
    }

    // for early version Selenium IDE test case
    // because of open command of early version of Selenium IDE test case,
    // we need to get its base
    getSeleniumBase(str) {
        let bases = str.match(/<link rel="selenium\.base" href="[^"]*"/g);
        // NOTE: 6 is "href=\"".length
        this.seleniumBase = bases[0].substring(bases[0].indexOf("href=\"") + 6, bases[0].lastIndexOf("\""));
        // getting rid of the /
        if (this.seleniumBase.charAt(this.seleniumBase.length - 1) == "/") {
            this.seleniumBase = this.seleniumBase.substring(0, this.seleniumBase.length - 1);
        }
    }

    appendOpenCommandTarget(str) {
        return "<td>" + this.seleniumBase + str.substring(4, str.length - 5) + "</td>";
    }

    appendTestSuite(suiteFile, suiteResult) {
        let suiteFileName =
            suiteFile.name.lastIndexOf(".") >= 0 ?
                suiteFile.name.substring(0, suiteFile.name.lastIndexOf(".")) :
                suiteFileName = suiteFile.name;

        let idText = this.fileController.addTestSuite({ title: suiteFileName });
        let testCases = suiteResult.match(/<table[\s\S]*?<\/table>/gi);
        if (testCases) {
            for (var i = 0; i < testCases.length; ++i) {
                this.parent.readCases(testCases[i]);
            }
        }

        this.fileController.setSelectedSuites([idText]);
    }

    splitTbody(str) {
        let preindex = str.indexOf("<tbody>");
        let postindex = str.indexOf("</tbody>");

        let component = [];
        component[0] = str.substring(0, preindex);
        // NOTE: 8 is "</tbody>".length
        component[1] = str.substring(0, postindex + 8).substring(preindex);
        component[2] = str.substring(postindex + 8);

        return component;
    }

    splitForeAndBack(str, tag) {
        let postindex = str.indexOf(tag);
        return [str.substring(0, postindex), str.substring(postindex)];
    }

    splitTag(str, tag) {
        let preindex = str.indexOf("<" + tag);
        let postindex = str.indexOf("</" + tag + ">");
        // NOTE: 3 is "</>".length
        return str.substring(preindex, postindex + 3 + tag.length);
    }

    addDatalistTag(str) {
        // for some input with table tag
        var tempFore = "";
        if (str.search("<table") >= 0) {
            var tbodyIndex = str.indexOf("<tbody>");
            tempFore = str.substring(0, tbodyIndex);
            str = str.substring(tbodyIndex);
        }

        let preindex = str.indexOf("<td>");
        let postindex = str.indexOf("</td>");
        let count = 0;
        let isOpenCommand = false;
        while (preindex >= 0 && postindex >= 0) {
            // check if the command is open, for appending URL base
            if (count == 0) {
                if (str.substring(preindex, postindex).search("open") >= 0) {
                    isOpenCommand = true;
                }
            }

            // NOTE: Because we add datalist tag in second td in every tbody's tr
            // we do tjis in evey count equals to 1
            if (count == 1) {
                // we append Selenium base for open command
                if (isOpenCommand) {
                    let originBase = str.substring(preindex, postindex + 5);
                    let insertBase = this.appendOpenCommandTarget(originBase);
                    // NOTE: 5 is "</td>".length
                    str = str.substring(0, preindex) + insertBase + str.substring(postindex + 5);
                    postindex += (insertBase.length - originBase.length);
                    isOpenCommand = false;
                }

                let insert = "<datalist>" + this.addOption(str.substring(preindex, postindex)) + "</datalist>";
                str = str.substring(0, postindex) + insert + str.substring(postindex);
                postindex += insert.length;
            }

            preindex = str.indexOf("<td>", preindex + 1);
            postindex = str.indexOf("</td>", postindex + 1);
            count = (count + 1) % 3;
        }
        return tempFore + str;
    }

    addOption(str) {
        return "<option>" + str.substring(4) + "</option>";
    }

    addMeta(str) {
        let part = this.splitForeAndBack(str, "</head>");
        return part[0] + "<meta name=\"description\" content=\"SideeX2\">" + part[1];
    }

    openOldFileDialog(question) {
        var defer = $.Deferred();
        $('<div></div>')
            .html(question)
            .dialog({
                dialogClass: "no-close",
                title: "Open Test Cases",
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "browse...": function () {
                        defer.resolve("true");
                        $(this).dialog("close");
                    },
                    Cancel: function () {
                        $(this).dialog("close");
                    }
                },
                close: function () {
                    $(this).remove();
                }
            });
        return defer.promise();
    }
}
