import Configuration from '../config/index';
import * as api from '../http/apis/payments';

import { PaymentLookupRequestBuilder } from './payment-lookup-request-builder';
import { PaymentLookupResponse } from './payment-lookup-response';
import { IPaymentLookupRequest } from './types';

export const newLookupRequest = () => new PaymentLookupRequestBuilder();

export const lookupPayment = (request: IPaymentLookupRequest): Promise<PaymentLookupResponse> => {
  PaymentLookupRequestBuilder.validateRequest(request);

  return api
    .lookup(request, Configuration.current())
    .then((response) => new PaymentLookupResponse(response));
};
