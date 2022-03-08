import { createStore } from 'redux';

import reducers from './reducer';

const store = createStore(reducers);
const { dispatch } = store;

export { dispatch };

export default store;
