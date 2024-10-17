import { Store, createStore as createReduxStore } from 'redux';
import { Action } from './action';

import reducers, { ReducerState } from './reducer';

export type WaykeStore = Store<ReducerState, Action>;
export const createStore = () => createReduxStore(reducers);
