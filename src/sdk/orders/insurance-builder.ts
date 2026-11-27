import { DrivingDistance } from '../insurances/types';
import { IOrderInsuranceRequest } from './types';

export class InsuranceBuilder {
  private properties: { [key: string]: any } = {};

  public forPersonalNumber(personalNumber: string): InsuranceBuilder {
    this.properties.personalNumber = personalNumber;

    return this;
  }

  public withDrivingDistance(drivingDistance: DrivingDistance): InsuranceBuilder {
    this.properties.drivingDistance = drivingDistance;

    return this;
  }

  public withAddOns(addons: string[]): InsuranceBuilder {
    this.properties.addons = addons;

    return this;
  }

  public build(): IOrderInsuranceRequest {
    return this.properties as IOrderInsuranceRequest;
  }
}
