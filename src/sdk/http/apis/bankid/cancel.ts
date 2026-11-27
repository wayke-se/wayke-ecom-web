import * as http from '../../index';
import Configuration from '../../../config/index';
import { IBankIdCancelRequest } from '../../../bankid/types';
import { createRequest } from './utils';

export const getUrl = (orderRef: string) => {
  const host = Configuration.current().getApiAddress();
  const url = `${host}/bankid/cancel/${orderRef}`;
  return url;
};

export const cancel = (requestOptions: IBankIdCancelRequest): Promise<Response> => {
  const url = getUrl(requestOptions.orderRef);
  const request = createRequest();

  return http.raw(url, request);
};
