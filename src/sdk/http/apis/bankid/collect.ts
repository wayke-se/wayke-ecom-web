import * as http from '../../index';
import { IBankIdCollectRequest, IBankIdCollectApiResponse } from '../../../bankid/types';
import Configuration from '../../../config/index';
import { createRequest } from './utils';

export const getUrl = (orderRef: string) => {
  const host = Configuration.current().getApiAddress();
  const url = `${host}/bankid/collect/${orderRef}`;
  return url;
};

export const collect = (
  requestOptions: IBankIdCollectRequest
): Promise<http.IApiResponse<IBankIdCollectApiResponse>> => {
  const url = getUrl(requestOptions.orderRef);
  const request = createRequest();

  return http.captureStateContext(http.json<IBankIdCollectApiResponse>(url, request));
};
