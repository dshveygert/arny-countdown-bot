import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {countdownReducer} from './reducer-countdown';
import {authReducer} from "./reducer-auth";
// @ts-ignore
export const store = createStore(combineReducers({countdown: countdownReducer, auth: authReducer}), applyMiddleware(thunk));

