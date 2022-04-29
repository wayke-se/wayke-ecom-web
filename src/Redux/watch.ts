import { get as getValue } from 'object-path';
import { ReducerState } from './reducer';

import { WaykeStore } from './store';

const defaultCompare = (a: any, b: any) => {
  return a === b;
};

const reduxWatch = <T>(
  getState: () => ReducerState,
  objectPath: FieldPath,
  compare?: (a: any, b: any) => boolean
) => {
  const selectedCompare = compare || defaultCompare;
  let currentValue = getValue(getState(), objectPath);

  return (fn: (newValue: T, oldValue: T, pathToField: FieldPath) => void) => {
    return () => {
      const newValue = getValue(getState(), objectPath);
      if (!selectedCompare(currentValue, newValue)) {
        const oldValue = currentValue;
        currentValue = newValue;
        fn(newValue, oldValue, objectPath);
      }
    };
  };
};

const subscriptions: (() => void)[] = [];

const registerSubsription = (s: () => void) => {
  subscriptions.push(s);
  return s;
};

export const unregisterAllSubscriptions = () => subscriptions.forEach((s) => s());

type FieldPath = string | number | Array<string | number>;

const watch = <T>(
  store: WaykeStore,
  path: FieldPath,
  callback: (newValue: T, oldValue: T, pathToField: FieldPath) => void,
  doNotRegister?: boolean
) => {
  const w = reduxWatch<T>(store.getState, path);
  if (doNotRegister) {
    store.subscribe(w(callback));
  } else {
    return registerSubsription(store.subscribe(w(callback)));
  }
};

export default watch;
