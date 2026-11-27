import { DrivingDistance, IInsuranceOptionsRequest } from './types';

export class InsuranceOptionsRequestBuilder {
  public static validateRequest(request: IInsuranceOptionsRequest) {
    if (!request) {
      throw new Error('Missing insurance options request');
    }

    if (!request.id) {
      throw new Error('Missing vehicle ID for insurance options request');
    }

    if (!request.personalNumber) {
      throw new Error('Missing personal number for insurance options request');
    }

    if (!request.drivingDistance) {
      throw new Error('Missing driving distance for insurance options request');
    }
  }

  private properties: { [key: string]: any } = {};
  public forVehicle(id: string): InsuranceOptionsRequestBuilder {
    this.properties.id = id;

    return this;
  }

  public forDealer(id: string): InsuranceOptionsRequestBuilder {
    this.properties.branchId = id;

    return this;
  }

  public forCustomer(personalNumber: string): InsuranceOptionsRequestBuilder {
    this.properties.personalNumber = personalNumber;

    return this;
  }

  public withDrivingDistance(drivingDistance: DrivingDistance): InsuranceOptionsRequestBuilder {
    this.properties.drivingDistance = drivingDistance;

    return this;
  }

  public build(): IInsuranceOptionsRequest {
    return this.properties as IInsuranceOptionsRequest;
  }
}
