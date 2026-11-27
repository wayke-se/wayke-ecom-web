interface IFetchGlobal extends NodeJS.Global {
  fetch: any;
}

export const mockResponse = (useBody?: string, useStatusCode?: number, useOK?: boolean) => {
  const g: IFetchGlobal = global as IFetchGlobal;
  g.fetch = jest.fn().mockImplementationOnce(
    () =>
      new Promise((resolve) =>
        resolve({
          ok: typeof useOK === 'boolean' ? useOK : true,
          status: typeof useStatusCode === 'number' ? useStatusCode : 200,
          json: () => (typeof useBody === 'string' ? JSON.parse(useBody) : {}),
          text: () => (typeof useBody === 'string' ? useBody : null),
        })
      )
  );
};
