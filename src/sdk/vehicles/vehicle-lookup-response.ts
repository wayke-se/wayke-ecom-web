import { IVehicle, IVehicleLookupResponse, IVehicleLookupResponseData } from './types';

export class VehicleLookupResponse implements IVehicleLookupResponse {
  private response: IVehicleLookupResponseData;
  private registrationNumber: string;

  public constructor(response: IVehicleLookupResponseData, registrationNumber: string) {
    if (!response) {
      throw new Error('Missing vehicle lookup response data');
    }

    this.response = response;
    this.registrationNumber = registrationNumber;
  }

  public getVehicle(): IVehicle {
    return {
      manufacturer: this.response.manufacturer,
      modelName: this.response.modelName,
      modelSeries: this.response.modelSeries,
      modelYear: this.response.modelYear,
      valuation: this.response.valuation,
    };
  }
}
