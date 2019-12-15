import { app } from "../state.template";

export default function (state = { ...app }, action) {
    switch (action.type) {
        case "SET_MODAL": {
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
        case "SET_CONTEXT_MENU": {
            state = { ...state };
            state.contextMenu = {
                ...state.contextMenu,
                ...action.payload
            };
            return state;
        }
        case "REFRESH_UI": {
            return { ...state };
        }
        default:
            return state;
    }
}
