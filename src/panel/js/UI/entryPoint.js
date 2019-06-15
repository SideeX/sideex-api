import store from "../UI/index";

module.exports = {
    toolBar: {
        updateSpeed: function (value) {
            store.dispatch({
                type: "UPDATE_SPEED",
                payload: {
                    speedValue: value
                }
            });
        },
        setShowSpeedSelect: function (isShow) {
            store.dispatch({
                type: "SHOW_SPEED_SELECT",
                payload: {
                    isShow: isShow
                }
            });
        },
        syncButtonState: () => {
            store.dispatch({
                type: "TB_SYNC_BUTTON_STATE"
            });
        }
    },
    console: {
        setAutoScrollLog: (autoScroll) => {
            store.dispatch({
                type: "CS_SET_AUTOSCROLL_LOG",
                autoScroll: { ...autoScroll }
            });
        },
        syncLog: () => {
            store.dispatch({
                type: "CS_SYNC_LOG"
            });
        },
        syncVariable: () => {
            store.dispatch({
                type: "CS_SYNC_VARIABLE"
            });
        },
        syncReference: () => {
            store.dispatch({
                type: "CS_SYNC_REFERENCE"
            });
        },
        syncReport: () => {
            store.dispatch({
                type: "CS_SYNC_REPORT"
            });
        }
    },
    fileList: {
        setModal: (modal) => {
            store.dispatch({
                type: "SET_FILELIST_MODAL",
                payload: { ...modal }
            });
        },
        syncFiles: () => {
            store.dispatch({
                type: "FL_SYNC_FILES"
            });
        }
    },
    workArea: {
        setAutoScroll: (autoScroll) => {
            store.dispatch({
                type: "SET_WORKAREA_AUTOSCROLL",
                autoScroll: { ...autoScroll }
            });
        },
        setEditBlock: (editBlock) => {
            store.dispatch({
                type: "SET_EDITBLOCK",
                payload: editBlock
            });
        },
        updateEditBlockSelect: () => {
            store.dispatch({
                type: "UPDATE_EDITBLOCK_SELECT"
            });
        },
        setVideoURL: (url) => {
            store.dispatch({
                type: "SET_VIDEO_URL",
                payload: {
                    url: url
                }
            });
        },
        syncSnapshotModal: (type, url, downloadUrl, subtitle) => {
            store.dispatch({
                type: "WA_SYNC_SNAPSHOT_MODAL",
                payload: {
                    type: type,
                    url: url,
                    downloadUrl: downloadUrl,
                    title: type === "image" ? "Snapshot" : "Video",
                    subtitle: subtitle
                }
            });
        },
        syncCommands: () => {
            store.dispatch({
                type: "WA_SYNC_COMMANDS"
            });
        },
        syncCommand: () => {
            store.dispatch({
                type: "WA_SYNC_COMMAND"
            });
        },
        syncEditBlock: (caseIdText, index) => {
            store.dispatch({
                type: "WA_SYNC_EDIT_BLOCK",
                payload: {
                    caseIdText: caseIdText,
                    index: index
                }
            });
        }
    },
    footer: {
        setCondition: function(currentCase, status) {
            store.dispatch({
                type: "SET_CONDITION",
                payload:{
                    currentCase: currentCase,
                    status: status
                }
            });
        },
        setResultValue: function(attribute, value) {
            store.dispatch({
                type: "SET_RESULT_VALUE",
                payload:{
                    attribute: attribute,
                    value: value
                }
            });
        },
        increaseResultValue: function(attribute) {
            store.dispatch({
                type: "INCREASE_RESULT_VALUE",
                payload:{
                    attribute: attribute
                }
            });
        },
        setProgressAnimation: function(isAnimated) {
            store.dispatch({
                type: "SET_PROGRESS_ANIMATION",
                isAnimated: isAnimated
            });
        },
        syncStatus: () => {
            store.dispatch({
                type: "FT_SYNC_STATUS"
            });
        }
    },
    app: {
        setModal: (modal) => {
            store.dispatch({
                type: "SET_MODAL",
                payload: { ...modal }
            });
        },
        setContextMenu: (contextMenu) => {
            store.dispatch({
                type: "SET_CONTEXT_MENU",
                payload: { ...contextMenu }
            });
        },
    }
};
