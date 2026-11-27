import { IConfiguration } from '../../config';
import { IInsuranceOptionsRequest, IInsuranceOptionsResponseData } from '../../insurances/types';
import * as http from '../index';

const buildInsuranceRequest = (
  request: IInsuranceOptionsRequest,
  { requestForgeryToken }: http.IHttpStateContext
): RequestInit => {
  const content = {
    drivingDistance: request.drivingDistance,
    socialId: request.personalNumber,
    vehicleId: request.id,
    branchId: request.branchId,
  };

  return http
    .builder()
    .method('post')
    .accept('application/json')
    .requestForgeryToken(requestForgeryToken)
    .content(content)
    .build();
};

const validateResponse = (
  response: http.IApiResponse<IInsuranceOptionsResponseData>
): IInsuranceOptionsResponseData => {
  if (!response || !response.successful || !response.response) {
    throw new Error('The request did not succeed');
  }

  return response.response;
};

export const find = (
  request: IInsuranceOptionsRequest,
  config: IConfiguration
): Promise<IInsuranceOptionsResponseData> =>
  http
    .captureStateContext(
      http.json<IInsuranceOptionsResponseData>(
        `${config.getApiAddress()}/v3/insurance`,
        buildInsuranceRequest(request, http.context())
      )
    )
    .then(validateResponse);
