export enum VehicleCondition {
  VeryGood = 'VeryGood',
  Good = 'Good',
  Ok = 'Ok',
}

export interface IVehicleLookupRequest {
  registrationNumber: string;
  mileage: number;
  condition: VehicleCondition;
}

export interface IVehicleLookupResponse {
  getVehicle(): IVehicle;
}

export interface IVehicleLookupResponseData {
  manufacturer: string;
  modelName: string;
  modelSeries: string;
  modelYear: number;
  valuation: number;
}

export interface IVehicle {
  manufacturer: string;
  modelName: string;
  modelSeries: string;
  modelYear: number;
  valuation: number;
}

export interface IVehicleTrade {
  registrationNumber: string;
  mileage: number;
  condition: VehicleCondition;
  comments: string;
}
