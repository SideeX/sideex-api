export class Preprocessor {
    constructor(root) {
        this.root = root;

        this.conditionStack = [];
        this.result = {
            isPassed: false,
            message: ""
        };
    }

    preprocess(playMode, testSuite) {
        let isPreprocessPassed = true;
        for (let suiteIdText of testSuite.order) {
            let suiteTitle = this.root.fileController.getSuiteTitle(suiteIdText);
            this.root.log.pushLog("info", `Checking test suite ${suiteTitle}`);

            for (let caseIdText of testSuite.suites[suiteIdText].cases) {
                let caseTitle = this.root.fileController.getCaseTitle(caseIdText);
                this.root.log.pushLog("info", `Checking test case ${caseTitle}`);

                let result = this.checkSyntax(caseIdText);
                if (!result.isPassed) {
                    isPreprocessPassed = false;
                    this.root.log.pushLog("error", `${
                        result.message} in (suite) ${suiteTitle} - (case) ${caseTitle}`);
                }
            }
        }
        this.root.log.pushLog("info", "Preprocessing Done");

        let suiteResult = this.preparePlaySuites(testSuite);

        return { isPassed: isPreprocessPassed, ...suiteResult };
    }

    preparePlaySuites(testSuite) {
        let playSuites = [];
        let caseNum = 0;
        for (let suiteIdText of testSuite.order) {
            let suiteTitle = this.root.fileController.getSuiteTitle(suiteIdText);

            let suite = { idText: suiteIdText, title: suiteTitle, cases: [] };
            playSuites.push(suite);

            for (let caseIdText of testSuite.suites[suiteIdText].cases) {
                let caseTitle = this.root.fileController.getCaseTitle(caseIdText);
                suite.cases.push({ idText: caseIdText, title: caseTitle,
                    records: this.preparePlayRecords(
                        this.root.fileController.getRecords(caseIdText)
                    )
                });
                caseNum++;
            }
        }
        return { caseNum: caseNum, playSuites: playSuites };
    }

    preparePlayRecords(records) {
        let parent = undefined;
        let current = [];
        for (let record of records) {
            let name = record.name;
            if (name === "WHILE" || name === "IF") {
                let target = record.target.options[record.target.usedIndex].value,
                    value = record.value.options[record.value.usedIndex].value;
                let temp = Object.assign(record, {
                    expression: target,
                    limitTimes: name === "IF" ? 1 :
                        parseInt(value) > 0 ? parseInt(value) : Infinity,
                    parent: parent,
                    children: [[], []]
                });
                current.push(temp);
                parent = current;
                current = temp.children[0];
            } else if (name === "ELSE") {
                current = parent[parent.length - 1].children[1];
                current.push(record);
            } else if (name === "END") {
                current = parent;
                parent = current[current.length - 1].parent;
                record.parent = parent;
                current.push(record);
            } else if (name === "INCLUDE") {
                let temp = Object.assign(record, {
                    include: record.target.options[record.target.usedIndex].value,
                    children: [this.preparePlayRecords(record.children[0])],
                    parent: parent
                });
                current.push(temp);
            } else {
                record.parent = parent;
                current.push(record);
            }
        }
        return current;
    }

    checkSyntax(caseIdText) {
        let stack = [];
        for (let record of this.root.fileController.getRecords(caseIdText)) {
            let command = record.name;
            if (command === "INCLUDE") {
                let caseIdText = this.preprocessIncludeRecords(record);
                let result = this.checkSyntax(caseIdText);
                if (!result.isPassed) {
                    return { ...result, message: `${result.message} on INCLUDE command` };
                }
            } else if (command === "WHILE" || command === "IF") {
                this.pushStack(stack, command);
            } else if (command === "ELSE") {
                this.pushStack(stack, command);
            } else if (command === "END") {
                if (stack.length === 0) {
                    return { isPassed: false, message: "Missing IF/WHILE" };
                }
                this.popStack(stack);
            }
        }

        if (stack.length !== 0) {
            return { isPassed: false, message: "Missing END" };
        } else {
            return { isPassed: true, message: "Syntax Checked" };
        }
    }

    preprocessIncludeRecords(record) {
        let caseIdText = this.root.fileController.getIncludeCaseIdText(
            record.target.options[record.target.usedIndex].value
        );
        record.caseIdText = caseIdText;
        record.children = [this.root.fileController.getRecords(caseIdText)];
        return caseIdText;
    }

    pushStack(stack, command) {
        stack.push({ name: command });
    }

    popStack(stack) {
        let lastIndex = stack.length - 1;
        let popCondition = stack[lastIndex];
        stack.splice(lastIndex, 1);

        if (popCondition.name == "ELSE") {
            if (stack[lastIndex - 1] != null && stack[lastIndex - 1].name == "IF") {
                this.popStack(stack);
            } else {
                return { isPassed: false, message: "Missing IF" };
            }
        }
    }
}
