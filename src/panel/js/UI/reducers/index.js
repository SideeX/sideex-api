// this is root reducers
import { combineReducers } from "redux";
import ToolBarReducer from "./toolBar";
import WorkAreaReducer from "./workArea";
import FileListReducer from "./fileList";
import App from "./App";

const rootReducer = combineReducers({
    app: App,
    toolBar: ToolBarReducer,
    workArea: WorkAreaReducer,
    fileList: FileListReducer
});

export default rootReducer;
