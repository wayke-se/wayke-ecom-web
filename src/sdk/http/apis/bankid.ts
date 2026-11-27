import {
  IBankIdAuthRequest,
  IBankIdAuthApiResponse,
  IBankIdCollectRequest,
  IBankIdCollectApiResponse,
  IBankIdCancelRequest,
  IBankIdQrCodeRequest,
  IBankIdQrCodeApiResponse,
} from '../../bankid/types';
import * as http from '../index';

import { auth as doAuthRequest } from './bankid/auth';
import { collect as doCollectRequest } from './bankid/collect';
import { cancel as doCancelRequest } from './bankid/cancel';
import { refresh as doQrCodeRefreshRequest } from './bankid/qrcode';

const validate = <T>(response: http.IApiResponse<T>): T => {
  if (!response || !response.successful || !response.response) {
    throw new Error('The request did not succeed');
  }

  return response.response;
};

export const auth = (requestOptions: IBankIdAuthRequest): Promise<IBankIdAuthApiResponse> =>
  doAuthRequest(requestOptions).then(validate);

export const collect = (
  requestOptions: IBankIdCollectRequest
): Promise<IBankIdCollectApiResponse> => doCollectRequest(requestOptions).then(validate);

export const cancel = (requestOptions: IBankIdCancelRequest): Promise<boolean> =>
  doCancelRequest(requestOptions).then(() => true);

export const qrcode = (requestOptions: IBankIdQrCodeRequest): Promise<IBankIdQrCodeApiResponse> =>
  doQrCodeRefreshRequest(requestOptions).then(validate);
