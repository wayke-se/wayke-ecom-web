import { IConfiguration } from '../../config';
import { IVehicleLookupRequest, IVehicleLookupResponseData } from '../../vehicles/types';
import * as http from '../index';

const buildLookupRequest = ({ requestForgeryToken }: http.IHttpStateContext): RequestInit =>
  http
    .builder()
    .method('get')
    .accept('application/json')
    .requestForgeryToken(requestForgeryToken)
    .build();

const validateResponse = (
  response: http.IApiResponse<IVehicleLookupResponseData>
): IVehicleLookupResponseData => {
  if (!response || !response.successful || !response.response) {
    throw new Error('The request did not succeed');
  }

  return response.response;
};

export const lookup = (
  request: IVehicleLookupRequest,
  config: IConfiguration
): Promise<IVehicleLookupResponseData> =>
  http
    .captureStateContext(
      http.json<IVehicleLookupResponseData>(
        `${config.getApiAddress()}/v2/tradein/${
          request.registrationNumber
        }?mileage=${request.mileage}&condition=${request.condition}`,
        buildLookupRequest(http.context())
      )
    )
    .then(validateResponse);
