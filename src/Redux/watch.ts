import reduxWatch from 'redux-watch';
import { WaykeStore } from './store';

const subscriptions: (() => void)[] = [];

const registerSubsription = (s: () => void) => subscriptions.push(s);

export const unregisterAllSubscriptions = () => subscriptions.forEach((s) => s());

type FieldPath = string | number | Array<string | number>;

const watch = <T>(
  store: WaykeStore,
  path: FieldPath,
  callback: (newValue: T, oldValue: T, pathToField: FieldPath) => void,
  doNotRegister?: boolean
) => {
  const w = reduxWatch(store.getState, path);
  if (doNotRegister) {
    store.subscribe(w(callback));
  } else {
    registerSubsription(store.subscribe(w(callback)));
  }
};

export default watch;
