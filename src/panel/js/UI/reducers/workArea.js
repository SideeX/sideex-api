import { workAreaState } from "../state.template";
import { root } from "../../background/initial";

export default function (state = { ...workAreaState }, action) {
    switch (action.type) {
        case "TOGGLE_SNAPSHOT_MODAL": {
            state = { ...state };
            // state.snapshotModal.isOpen = !state.snapshotModal.isOpen;
            state.snapshotModal.isOpen = false;
            return state;
        }
        case "SET_WORKAREA_AUTOSCROLL": {
            state = { ...state };
            state.autoScroll = {
                ...state.autoScroll,
                ...action.autoScroll
            };
            return state;
        }
        // case "SET_EDITBLOCK": {
        //     state = { ...state };
        //     state.editBlock = {
        //         ...state.editBlock,
        //         ...action.payload
        //     };
        //     return state;
        // }
        // case "UPDATE_EDITBLOCK_SELECT": {
        //     state = { ...state };
        //     state.editBlock.isSelect = root.recorder.isSelecting;
        //     return state;
        // }
        case "SET_VIDEO_URL": {
            state = { ...state };
            state.snapshotModal.url = action.payload.url;
            return state;
        }
        case "WA_SYNC_SNAPSHOT_MODAL": {
            state = { ...state };
            state.snapshotModal = {
                isOpen: true,
                ...action.payload
            };
            return state;
        }
        case "WA_SYNC_COMMANDS": {
            state = { ...state, ...root.fileController };
            return state;
        }
        case "WA_SYNC_COMMAND": {
            state = { ...state, ...root.fileController };
            return state;
        }
        // case "WA_SYNC_EDIT_BLOCK": {
        //     state = { ...state };
        //     let record = root.fileController.getRecord(action.payload.caseIdText, action.payload.index);
        //     state.editBlock.value = {
        //         name: record.name,
        //         targets: record.target.options,
        //         values: record.value.options
        //     };
        //     state.editBlock.usedIndex = {
        //         target: record.target.usedIndex,
        //         value: record.value.usedIndex
        //     };
        //     return state;
        // }
        default: {
            try {
                state = { ...state, ...root.fileController };
            } catch (e) {
                state = { ...state };
            }
            return state;
        }
    }
}

