import { IConfiguration } from '../../config';
import { IAddress, IAddressLookupRequest } from '../../customers/types';
import * as http from '../index';

const buildLookupRequest = ({ requestForgeryToken }: http.IHttpStateContext): RequestInit =>
  http
    .builder()
    .method('get')
    .accept('application/json')
    .requestForgeryToken(requestForgeryToken)
    .build();

const validateResponse = (response: http.IApiResponse<IAddress>): IAddress => {
  if (!response || !response.successful || !response.response) {
    throw new Error('The request did not succeed');
  }

  return response.response;
};

export const lookupAddress = (
  lookupRequest: IAddressLookupRequest,
  config: IConfiguration
): Promise<IAddress> =>
  http
    .captureStateContext(
      http.json<IAddress>(
        `${config.getApiAddress()}/v2/address?SocialId=${lookupRequest.personalNumber}`,
        buildLookupRequest(http.context())
      )
    )
    .then(validateResponse);
