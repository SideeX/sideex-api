import store from "../UI/index";

export const toolBar = {
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
};
export const console = {
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
};
export const fileList = {
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
};
export const workArea = {
    setAutoScroll: (autoScroll) => {
        store.dispatch({
            type: "SET_WORKAREA_AUTOSCROLL",
            autoScroll: { ...autoScroll }
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
};
export const footer = {
    setCondition: function (currentCase, status) {
        store.dispatch({
            type: "SET_CONDITION",
            payload: {
                currentCase: currentCase,
                status: status
            }
        });
    },
    setResultValue: function (attribute, value) {
        store.dispatch({
            type: "SET_RESULT_VALUE",
            payload: {
                attribute: attribute,
                value: value
            }
        });
    },
    increaseResultValue: function (attribute) {
        store.dispatch({
            type: "INCREASE_RESULT_VALUE",
            payload: {
                attribute: attribute
            }
        });
    },
    setProgressAnimation: function (isAnimated) {
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
};
export const app = {
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
    }
};

