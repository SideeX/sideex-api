import events from "../../events";

export default {
    "default": [],
    "suite default": [
        // {
        //     title: "Add suite",
        //     shortCut: "",
        //     onClick: events.fileList.clickAddTestSuite
        // },
        {
            title: "Open suite",
            shortCut: "ctrl+o",
            onClick: events.fileList.clickOpenTestSuite
        },
        {
            title: "Close all suites",
            shortCut: "",
            onClick: events.fileList.clickCloseAllTestSuites
        }
    ],
    "record default": [
        {
            title: "Add cmd",
            shortCut: "ctrl+i",
            onClick: events.workArea.clickAddCommand
        }
    ],
    "suite": [
        // {
        //     title: "Add suite",
        //     shortCut: "",
        //     onClick: events.fileList.clickAddTestSuite
        // },
        // {
        //     title: "Open suite",
        //     shortCut: "ctrl+o",
        //     onClick: events.fileList.clickOpenTestSuite
        // },
        {
            title: "Close suite",
            shortCut: "",
            onClick: events.fileList.clickCloseTestSuite
        },
        {
            title: "Add case",
            shortCut: "",
            onClick: events.fileList.clickAddTestCase
        },
        {
            title: "Rename suite",
            shortCut: "",
            onClick: events.fileList.clickRenameTestSuite
        },
        {
            title: "Save suite",
            shortCut: "ctrl+s",
            onClick: events.fileList.clickSaveTestSuite
        }
    ],
    "case": [
        {
            title: "Add case",
            shortCut: "",
            onClick: events.fileList.clickAddTestCase
        },
        {
            title: "Delete case",
            shortCut: "",
            onClick: events.fileList.clickRemoveTestCase
        },
        {
            title: "Rename case",
            shortCut: "",
            onClick: events.fileList.clickRenameTestCase
        }
    ],
    "record": [
        {
            title: "Add cmd",
            shortCut: "ctrl+i",
            onClick: events.workArea.clickAddCommand
        },
        {
            title: "Delete cmd",
            shortCut: "del",
            onClick: events.workArea.clickDeleteCommand
        },
        {
            title: "Convert to animation cmd",
            shortCut: "",
            onClick: events.workArea.clickConvertCommand
        },
        {
            title: "Delete all cmds",
            shortCut: "",
            onClick: events.workArea.clickDeleteAllCommand
        },
        {
            title: "Copy cmds",
            shortCut: "ctrl+c",
            onClick: events.workArea.clickCopyCommands
        },
        {
            title: "Cut cmds",
            shortCut: "ctrl+x",
            onClick: events.workArea.clickCutCommands
        },
        {
            title: "Paste cmds",
            shortCut: "ctrl+v",
            onClick: events.workArea.clickPasteCommands
        },
        {
            title: "Play from here",
            shortCut: "",
            onClick: events.workArea.clickPlayFromHere
        },
        {
            title: "Clear status of cmds",
            shortCut: "",
            onClick: events.workArea.clickClearRecordsStatus
        }
    ]
};
