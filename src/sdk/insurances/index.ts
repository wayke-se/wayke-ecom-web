import Configuration from '../config/index';
import * as api from '../http/apis/insurances';

import { InsuranceOptionsRequestBuilder } from './insurance-options-request-builder';
import { InsuranceOptionsResponse } from './insurance-options-response';
import { IInsuranceOptionsRequest, IInsuranceOptionsResponse } from './types';

export const newInsuranceOptionsRequest = () => new InsuranceOptionsRequestBuilder();

export const getOptions = (
  request: IInsuranceOptionsRequest
): Promise<IInsuranceOptionsResponse> => {
  InsuranceOptionsRequestBuilder.validateRequest(request);

  return api
    .find(request, Configuration.current())
    .then((response) => new InsuranceOptionsResponse(response));
};
