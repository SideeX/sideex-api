// this is root reducers
import { combineReducers } from "redux";
import ToolBarReducer from "./toolBar";
import WorkAreaReducer from "./workArea";
import FileListReducer from "./fileList";

const rootReducer = combineReducers({
    toolBar: ToolBarReducer,
    workArea: WorkAreaReducer,
    fileList: FileListReducer
});

export default rootReducer;
