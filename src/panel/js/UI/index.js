import App from "./components/app";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>
        , document.getElementById('panel'));
};
render();
store.subscribe(render);

export default store;
import * as EntryPoint from "./entryPoint";
export { EntryPoint };
