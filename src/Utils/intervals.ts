const intervals: { [key: string]: number | undefined } = {};

export const registerInterval = (key: string, interval: number) => {
  intervals[key] = interval;
};

export const unregisterAllIntervals = () => {
  Object.keys(intervals).forEach((key) => {
    clearInterval(intervals[key]);
    delete intervals[key];
  });
};
