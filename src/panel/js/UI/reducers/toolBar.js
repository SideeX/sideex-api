import { toolBarState } from "../state.template";
import { root } from "../../background/initial";

export default function (state = { ...toolBarState }, action) {
    switch (action.type) {
        case "TB_SYNC_BUTTON_STATE": {
            state = {
                speed: {
                    isShow: false,
                    value: root.playback.playSpeed
                },
                isRecord: root.recorder.isRecord,
                isPlay: root.playback.isPlay,
                isPause: root.playback.isPause,
                isStop: root.playback.isStop
            };
            return state;
        }
        case "SHOW_SPEED_SELECT": {
            state = { ...state };
            state.speed.isShow = action.payload.isShow;
            return state;
        }
        case "UPDATE_SPEED": {
            state = { ...state };
            let value = action.payload.speedValue;
            state.speed.value = value;
            root.playback.playSpeed = value;
            return state;
        }
        default:
            return state;
    }
}
