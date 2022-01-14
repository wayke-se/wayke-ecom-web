export enum VehicleCondition {
  VeryGood = 'VeryGood',
  Good = 'Good',
  Ok = 'Ok',
}

export interface TradeInCarDataPartial {
  registrationNumber: string;
  mileage: string;
  condition?: VehicleCondition;
  description: string;
}

export interface TradeInCarData {
  registrationNumber: string;
  mileage: string;
  condition: VehicleCondition;
  description: string;
}
