import { IPaymentCosts, IPaymentFees, IPaymentInterests, IPaymentRangeSpec } from '@wayke-se/ecom';

export interface PaymentLookup {
  costs: IPaymentCosts;
  fees: IPaymentFees;
  interests: IPaymentInterests;
  durationSpec: IPaymentRangeSpec;
  downPaymentSpec: IPaymentRangeSpec;
  residualValueSpec: IPaymentRangeSpec;
  totalResidualValue: number;
  publicURL: string | undefined;
  shouldUseCreditScoring: boolean;
  financialProductCode: string | undefined;
  price: number;
  creditAmount: number;
  hasPrivacyPolicy: boolean;
  privacyPolicyUrl: string | undefined;
}
