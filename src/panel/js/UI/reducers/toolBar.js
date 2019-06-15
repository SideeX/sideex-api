import { toolBarState } from "../state.template";

export default function (state = { ...toolBarState }, action) {
    switch (action.type) {
        case "TB_SYNC_BUTTON_STATE": {
            state = {
                speed: {
                    isShow: false,
                    value: Panel.playback.playSpeed
                },
                isRecord: Panel.recorder.isRecord,
                isPlay: Panel.playback.isPlay,
                isPause: Panel.playback.isPause,
                isStop: Panel.playback.isStop
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
            Panel.playback.playSpeed = value;
            return state;
        }
        default:
            return state;
    }
}
