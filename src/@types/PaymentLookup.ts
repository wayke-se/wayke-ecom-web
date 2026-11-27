import { IPaymentCosts, IPaymentFees, IPaymentInterests, IPaymentRangeSpec } from '@wayke-se/ecom';

/**
 * A range the customer may adjust. `fixed` is set by commerce when the dealer's financing
 * packaging locks the value; the SDK passes it through untyped.
 */
export interface PaymentRangeSpec extends IPaymentRangeSpec {
  fixed?: boolean;
}

export interface PaymentLookup {
  costs: IPaymentCosts;
  fees: IPaymentFees;
  interests: IPaymentInterests;
  durationSpec: PaymentRangeSpec;
  downPaymentSpec: PaymentRangeSpec;
  residualValueSpec: PaymentRangeSpec;
  totalResidualValue: number;
  publicURL: string | undefined;
  shouldUseCreditScoring: boolean;
  financialProductCode: string | undefined;
  price: number;
  creditAmount: number;
  hasPrivacyPolicy: boolean;
  privacyPolicyUrl: string | undefined;
  moneyLaunderingInformationURL: string | undefined;
  financialOptionId: string | undefined;
}
