import { IApiErrorResponse } from '..';
import { ResponseError } from '../../errors/request-error';
import { VehicleUnavailableError } from '../../errors/vehicle-unavailable-error';

const throwErrorByType = (errorBody: IApiErrorResponse) => {
  switch (errorBody.errorCode) {
    case 1:
      throw new VehicleUnavailableError();
    default:
      throw new Error(errorBody.message);
  }
};

const handleResponseError = (error: ResponseError): Promise<void> => {
  const response = error.getResponse();
  return response.json().then(throwErrorByType);
};

export default handleResponseError;
