// this is root reducers
import { combineReducers } from "redux";
import ToolBarReducer from "./toolBar";

const rootReducer = combineReducers({
    toolBar: ToolBarReducer
});

export default rootReducer;
