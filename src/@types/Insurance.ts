import { IInsuranceAddon } from '../sdk';

export interface Insurance {
  insurance: string;
  addOns: IInsuranceAddon[];
}
