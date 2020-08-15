import { createStore } from 'redux';
import { countdown } from './reducer';
// @ts-ignore
export const store = createStore(countdown);

