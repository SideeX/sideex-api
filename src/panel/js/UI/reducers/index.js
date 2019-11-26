// this is root reducers
import { combineReducers } from "redux";
import ToolBarReducer from "./toolBar";
import WorkAreaReducer from "./workArea";

const rootReducer = combineReducers({
    toolBar: ToolBarReducer,
    workArea: WorkAreaReducer
});

export default rootReducer;
