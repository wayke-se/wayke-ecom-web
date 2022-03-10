export const isSame = (a: any, b: any) =>
  a !== undefined && b !== undefined
    ? JSON.stringify(a).localeCompare(JSON.stringify(b)) === 0
    : a === b;
