import Configuration from '../config/index';
import * as api from '../http/apis/customers';

import { AddressLookupRequestBuilder } from './address-lookup-request-builder';
import { AddressLookupResponse } from './address-lookup-response';
import { CustomerBuilder } from './customer-builder';
import { IAddressLookupRequest } from './types';

export const newAddressLookupRequest = () => new AddressLookupRequestBuilder();

export const newCustomer = () => new CustomerBuilder();

export const lookupAddress = (request: IAddressLookupRequest): Promise<AddressLookupResponse> => {
  AddressLookupRequestBuilder.validateRequest(request);

  return api
    .lookupAddress(request, Configuration.current())
    .then((response) => new AddressLookupResponse(response));
};
