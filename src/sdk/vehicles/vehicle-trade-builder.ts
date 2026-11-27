import { IVehicleTrade, VehicleCondition } from './types';

export class VehicleTradeBuilder {
  private properties: { [key: string]: any } = {};

  public forVehicle(registrationNumber: string): VehicleTradeBuilder {
    this.properties.registrationNumber = registrationNumber;

    return this;
  }

  public withMileage(mileage: number): VehicleTradeBuilder {
    this.properties.mileage = mileage;

    return this;
  }

  public withCondition(condition: VehicleCondition): VehicleTradeBuilder {
    this.properties.condition = condition;

    return this;
  }

  public withComment(comment: string): VehicleTradeBuilder {
    this.properties.comments = comment;

    return this;
  }

  public build(): IVehicleTrade {
    return this.properties as IVehicleTrade;
  }
}
