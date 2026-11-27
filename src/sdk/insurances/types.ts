export interface IInsuranceOptionsRequest {
  id: string;
  branchId: string;
  personalNumber: string;
  drivingDistance: DrivingDistance;
}

export interface IInsuranceOptionsResponse {
  getInsuranceOptions(): IInsuranceOption[];
}

export interface IInsuranceOptionsResponseData {
  insurances: IInsuranceOption[];
}

export interface IInsuranceTerms {
  url: string;
}

export interface IInsuranceConditions {
  description: string;
  url: string;
}

export interface IInsuranceAddon {
  title: string;
  name: string;
  description: string;
  monthlyPrice: number;
  exclude: string[];
}

export interface IInsuranceItem {
  name: string;
  description: string;
}

export interface IInsuranceOption {
  name: string;
  price: number;
  unit: string;
  includesFinancingInPrice: boolean;
  addOns: IInsuranceAddon[];
  description: string;
  branding: string;
  insuranceItems: IInsuranceItem[];
  legalUrl: string;
  legalDescription: string;
}

export enum DrivingDistance {
  Between0And1000 = 'Between0And1000',
  Between1000And1500 = 'Between1000And1500',
  Between1500And2000 = 'Between1500And2000',
  Between2000And2500 = 'Between2000And2500',
  Over2500 = 'Over2500',
}
