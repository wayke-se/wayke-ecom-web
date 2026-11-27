import { IBankIdAuthRequest, AuthMethod, IBankIdAuthApiResponse } from '../../../bankid/types';
import * as http from '../../index';
import Configuration from '../../../config/index';
import { createRequest } from './utils';

const getRoute = (method: AuthMethod) => {
  switch (method) {
    case AuthMethod.QrCode:
      return '/qr-code';
    case AuthMethod.SameDevice:
      return '/same-device';
    default:
      throw new Error('BankId auth method not supported');
  }
};

export const getUrl = (requestOptions: IBankIdAuthRequest) => {
  const route = getRoute(requestOptions.method);
  const host = Configuration.current().getApiAddress();
  const url = `${host}/bankid/auth${route}`;
  return url;
};

export const auth = (
  requestOptions: IBankIdAuthRequest
): Promise<http.IApiResponse<IBankIdAuthApiResponse>> => {
  const url = getUrl(requestOptions);
  const request = createRequest();

  return http.captureStateContext(http.json<IBankIdAuthApiResponse>(url, request));
};
