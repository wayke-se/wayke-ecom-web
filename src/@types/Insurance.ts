import { IInsuranceAddon } from '@wayke-se/ecom';

export interface Insurance {
  insurance: string;
  addOns: IInsuranceAddon[];
}
