import { IConfiguration } from '../../config';
import * as http from '../index';

import { IPaymentLookupRequest, IPaymentLookupResponseData } from '../../payments/types';

const buildLookupRequest = (lookupRequest: IPaymentLookupRequest): RequestInit => {
  const content = {
    branchId: lookupRequest.branchId,
    duration: lookupRequest.duration,
    downPayment: lookupRequest.downPayment,
    residual: lookupRequest.residual,
    financialOptionId: lookupRequest.financialOptionId,
  };

  return http.builder().method('post').accept('application/json').content(content).build();
};

const validateResponse = (
  response: http.IApiResponse<IPaymentLookupResponseData>
): IPaymentLookupResponseData => {
  if (!response || !response.successful || !response.response) {
    throw new Error('The request did not succeed');
  }

  return response.response;
};

export const lookup = (
  lookupRequest: IPaymentLookupRequest,
  config: IConfiguration
): Promise<IPaymentLookupResponseData> =>
  http
    .json<IPaymentLookupResponseData>(
      `${config.getApiAddress()}/payment/${lookupRequest.id}`,
      buildLookupRequest(lookupRequest)
    )
    .then(validateResponse);
