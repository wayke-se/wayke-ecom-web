import { createStore as createReduxStore, Store } from 'redux';
import { Action } from './action';

import reducers, { ReducerState } from './reducer';

export type WaykeStore = Store<ReducerState, Action>;
export const createStore = () => createReduxStore(reducers);
