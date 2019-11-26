import { fileListState } from "../state.template";
import { root } from "../../background/initial";

export default function (state = { ...fileListState }, action) {
    switch (action.type) {
        case "SET_FILELIST_MODAL": {
            state = { ...state };
            if (action.payload.type === "default") {
                state.modal = {
                    isOpen: false,
                    type: "default",
                    params: {}
                };
            } else {
                state.modal = {
                    ...state.modal,
                    ...action.payload
                };
            }
            return state;
        }
        case "FL_SYNC_FILES": {
            state = { ...state, ...root.fileController };
            return state;
        }
        default:
            return state;
    }
}
