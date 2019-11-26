const testFilesData = {
    selectedSuiteIdTexts: ["suite-0"],
    selectedCaseIdTexts: ["case-0"],
    selectedRecordIdTexts: ["records-0"],
    testSuite: {
        count: 0,
        untitledCount: 0,
        nameMap: {
            "Untitled Test Suite": "suite-0"
        },
        suites: {
            "suite-0": {
                title: "Untitled Test Suite",
                fileName: "Untitled Test Suite.html",
                modified: true,
                cases: ["case-0", "case-1"]
            }
        }
    },
    testCase: {
        count: 0,
        untitledCount: 0,
        cases: {
            "case-0": {
                title: "ertyuio",
                modified: true,
                records: [
                    {
                        id: "records-0",
                        name: "open",
                        target: {
                            usedIndex: 0,
                            options: [
                                { type: "other", value: "http://sideex.org/" },
                                { type: "other", value: "ertyuio" }
                            ],
                            tac: ""
                        },
                        value: {
                            usedIndex: 0,
                            options: [
                                { type: "other", value: "4567" },
                                { type: "other", value: "8888udo" }
                            ],
                            tac: ""
                        },
                        preWaitTime: {
                            beforeunload: 0,
                            ajax: 0,
                            resource: 0,
                            DOM: 0
                        },
                        screenshot: "fdsfd",
                        breakpoint: false,
                        status: "default"
                    },
                    {
                        id: "records-1",
                        name: "INCLUDE",
                        target: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "Untitled Test Suite.test" }],
                            tac: ""
                        },
                        value: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "4567" }],
                            tac: ""
                        },
                        preWaitTime: {
                            beforeunload: 0,
                            ajax: 0,
                            resource: 0,
                            DOM: 0
                        },
                        screenshot: "fdsfd",
                        breakpoint: false,
                        status: "default",
                        children: [[
                            {
                                id: "records-9",
                                name: "open",
                                target: {
                                    usedIndex: 0,
                                    options: [{ type: "other", value: "http://sideex.org/" }],
                                    tac: ""
                                },
                                value: {
                                    usedIndex: 0,
                                    options: [{ type: "other", value: "4567" }],
                                    tac: ""
                                },
                                preWaitTime: {
                                    beforeunload: 0,
                                    ajax: 0,
                                    resource: 0,
                                    DOM: 0
                                },
                                screenshot: "fdsfd",
                                breakpoint: false,
                                status: "default"
                            },
                            {
                                id: "records-10",
                                name: "click",
                                target: {
                                    usedIndex: 0,
                                    options: [{ type: "other", value: "http://sideex.org/" }],
                                    tac: ""
                                },
                                value: {
                                    usedIndex: 0,
                                    options: [{ type: "other", value: "4567" }],
                                    tac: ""
                                },
                                preWaitTime: {
                                    beforeunload: 0,
                                    ajax: 0,
                                    resource: 0,
                                    DOM: 0
                                },
                                screenshot: "fdsfd",
                                breakpoint: false,
                                status: "default"
                            },
                        ]]
                    },
                    {
                        id: "records-2",
                        name: "clickAt",
                        target: {
                            usedIndex: 1,
                            options: [
                                { type: "other", value: "http://sideex.org/" },
                                { type: "tac", value: "auto-located-by-tac" }
                            ],
                            tac: "dfghjk"
                        },
                        value: {
                            usedIndex: 1,
                            options: [
                                { type: "other", value: "http://sideex.org/" },
                                { type: "tac", value: "auto-located-by-tac" }
                            ],
                            tac: "dfghjk"
                        },
                        preWaitTime: {
                            beforeunload: 0,
                            ajax: 0,
                            resource: 0,
                            DOM: 0
                        },
                        screenshot: "fdsfd",
                        breakpoint: false,
                        status: "default"
                    },
                    {
                        id: "records-3",
                        name: "WHILE",
                        target: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "http://sideex.org/" }],
                            tac: ""
                        },
                        value: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "4567" }],
                            tac: ""
                        },
                        preWaitTime: {
                            beforeunload: 0,
                            ajax: 0,
                            resource: 0,
                            DOM: 0
                        },
                        screenshot: "fdsfd",
                        breakpoint: false,
                        status: "default"
                    },
                    {
                        id: "records-4",
                        name: "END",
                        target: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "http://sideex.org/" }],
                            tac: ""
                        },
                        value: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "4567" }],
                            tac: ""
                        },
                        preWaitTime: {
                            beforeunload: 0,
                            ajax: 0,
                            resource: 0,
                            DOM: 0
                        },
                        screenshot: "fdsfd",
                        breakpoint: false,
                        status: "default"
                    },
                ]
            },
            "case-1": {
                title: "test",
                modified: true,
                records: [
                    {
                        id: "records-0",
                        name: "open",
                        target: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "http://sideex.org/" }],
                            tac: ""
                        },
                        value: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "4567" }],
                            tac: ""
                        },
                        preWaitTime: {
                            beforeunload: 0,
                            ajax: 0,
                            resource: 0,
                            DOM: 0
                        },
                        screenshot: "fdsfd",
                        breakpoint: false,
                        status: "default"
                    },
                    {
                        id: "records-1",
                        name: "click",
                        target: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "http://sideex.org/" }],
                            tac: ""
                        },
                        value: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "4567" }],
                            tac: ""
                        },
                        preWaitTime: {
                            beforeunload: 0,
                            ajax: 0,
                            resource: 0,
                            DOM: 0
                        },
                        screenshot: "fdsfd",
                        breakpoint: false,
                        status: "default"
                    },
                    {
                        id: "records-2",
                        name: "clickAt",
                        target: {
                            usedIndex: 0,
                            options: [{ type: "tac", value: "auto-located-by-tac" }],
                            tac: "dfghjk"
                        },
                        value: {
                            usedIndex: 0,
                            options: [{ type: "tac", value: "auto-located-by-tac" }],
                            tac: "dfghjk"
                        },
                        preWaitTime: {
                            beforeunload: 0,
                            ajax: 0,
                            resource: 0,
                            DOM: 0
                        },
                        screenshot: "fdsfd",
                        breakpoint: false,
                        status: "default"
                    },
                    {
                        id: "records-3",
                        name: "WHILE",
                        target: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "http://sideex.org/" }],
                            tac: ""
                        },
                        value: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "4567" }],
                            tac: ""
                        },
                        preWaitTime: {
                            beforeunload: 0,
                            ajax: 0,
                            resource: 0,
                            DOM: 0
                        },
                        screenshot: "fdsfd",
                        breakpoint: false,
                        status: "default",
                        expression: "http://sideex.org/",
                        parent: this,
                        children: [
                            [{
                                id: "records-3-0",
                                name: "clickAt",
                                target: {
                                    usedIndex: 0,
                                    options: [{ type: "other", value: "http://sideex.org/" }],
                                    tac: ""
                                },
                                value: {
                                    usedIndex: 0,
                                    options: [{ type: "other", value: "4567" }],
                                    tac: ""
                                },
                                preWaitTime: {
                                    beforeunload: 0,
                                    ajax: 0,
                                    resource: 0,
                                    DOM: 0
                                },
                                screenshot: "fdsfd",
                                breakpoint: false,
                                status: "default"
                            },
                            {
                                id: "records-3-1",
                                name: "clickAt",
                                target: {
                                    usedIndex: 0,
                                    options: [{ type: "other", value: "http://sideex.org/" }],
                                    tac: ""
                                },
                                value: {
                                    usedIndex: 0,
                                    options: [{ type: "other", value: "4567" }],
                                    tac: ""
                                },
                                preWaitTime: {
                                    beforeunload: 0,
                                    ajax: 0,
                                    resource: 0,
                                    DOM: 0
                                },
                                screenshot: "fdsfd",
                                breakpoint: false,
                                status: "default"
                            },]
                        ],
                    },
                    {
                        id: "records-4",
                        name: "END",
                        target: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "http://sideex.org/" }],
                            tac: ""
                        },
                        value: {
                            usedIndex: 0,
                            options: [{ type: "other", value: "4567" }],
                            tac: ""
                        },
                        preWaitTime: {
                            beforeunload: 0,
                            ajax: 0,
                            resource: 0,
                            DOM: 0
                        },
                        screenshot: "fdsfd",
                        breakpoint: false,
                        status: "default"
                    },
                ]
            }
        }
    }
};

const files = {
    selectedSuiteIdTexts: [],
    selectedCaseIdTexts: [],
    selectedRecordIdTexts: [],
    testSuite: {
        count: 0,
        untitledCount: 0,
        suites: {}
    },
    testCase: {
        count: 0,
        untitledCount: 0,
        cases: {}
    },
    ...testFilesData
};

export const toolBarState = {
    speed: {
        isShow: false,
        value: 5
    },
    isRecord: false,
    isPlay: false,
    isPause: false,
    isStop: false
};

export const fileListState = {
    ...files,
    contextMenu: {
        type: "default",
        isOpen: false,
        clientX: 0,
        clientY: 0
    },
    modal: {
        isOpen: false,
        type: "default",
        params: {}
    }
};
export const workAreaState = {
    ...files,
    autoScroll: {
        isUsed: false,
        idText: ""
    },
    snapshotModal: {
        isOpen: false,
        type: "",
        url: "",
        title: "",
        subtitle: ""
    },
    selectedVideos: [""],
    editBlock: {
        index: 0,
        isOpen: false,
        isSelect: false,
        usedIndex: {
            target: 0,
            value: 0
        },
        value: {
            name: "",
            targets: [],
            values: []
        }
    }
};
