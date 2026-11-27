import * as http from '../../index';
import { IBankIdQrCodeRequest, IBankIdQrCodeApiResponse } from '../../../bankid/types';
import Configuration from '../../../config/index';
import { createRequest } from './utils';

export const getUrl = (orderRef: string) => {
  const host = Configuration.current().getApiAddress();
  const url = `${host}/bankid/auth/${orderRef}/qr-code/refresh`;
  return url;
};

export const refresh = (
  requestOptions: IBankIdQrCodeRequest
): Promise<http.IApiResponse<IBankIdQrCodeApiResponse>> => {
  const url = getUrl(requestOptions.orderRef);
  const request = createRequest();

  return http.captureStateContext(http.json<IBankIdQrCodeApiResponse>(url, request));
};
