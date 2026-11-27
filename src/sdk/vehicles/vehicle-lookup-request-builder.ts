import { IVehicleLookupRequest, VehicleCondition } from './types';

export class VehicleLookupRequestBuilder {
  public static validateRequest(request: IVehicleLookupRequest) {
    if (!request) {
      throw new Error('Missing vehicle lookup request');
    }

    if (!request.registrationNumber) {
      throw new Error('Missing registration number in vehicle lookup request');
    }

    if (request.mileage && !request.condition) {
      throw new Error('Missing vehicle condition for valuation in vehicle lookup request');
    }

    if (request.condition && !request.mileage) {
      throw new Error('Missing mileage for valuation in vehicle lookup request');
    }
  }

  private properties: { [key: string]: any } = {};
  public withRegistrationNumber(registrationNumber: string): VehicleLookupRequestBuilder {
    this.properties.registrationNumber = registrationNumber;

    return this;
  }

  public withMileage(mileage: number): VehicleLookupRequestBuilder {
    this.properties.mileage = mileage;

    return this;
  }

  public withCondition(condition: VehicleCondition): VehicleLookupRequestBuilder {
    this.properties.condition = condition;

    return this;
  }

  public build(): IVehicleLookupRequest {
    return this.properties as IVehicleLookupRequest;
  }
}
