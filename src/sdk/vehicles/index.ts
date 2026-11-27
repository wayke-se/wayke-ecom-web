import Configuration from '../config/index';
import * as api from '../http/apis/vehicles';

import { IVehicleLookupRequest } from './types';
import { VehicleLookupRequestBuilder } from './vehicle-lookup-request-builder';
import { VehicleLookupResponse } from './vehicle-lookup-response';
import { VehicleTradeBuilder } from './vehicle-trade-builder';

export const newLookupRequest = () => new VehicleLookupRequestBuilder();

export const newVehicleTrade = () => new VehicleTradeBuilder();

export const lookupVehicle = (request: IVehicleLookupRequest): Promise<VehicleLookupResponse> => {
  VehicleLookupRequestBuilder.validateRequest(request);

  return api
    .lookup(request, Configuration.current())
    .then((response) => new VehicleLookupResponse(response, request.registrationNumber));
};
