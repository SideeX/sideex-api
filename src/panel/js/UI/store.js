import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import reducers from './reducers/index';
import { composeWithDevTools } from 'redux-devtools-extension';

// export default createStore(reducers, composeWithDevTools(
//     applyMiddleware(logger)
//     // other store enhancers if any
// ));
export default createStore(reducers);
