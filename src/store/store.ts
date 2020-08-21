import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { countdown } from './reducer';
// @ts-ignore
export const store = createStore(countdown, applyMiddleware(thunk));

