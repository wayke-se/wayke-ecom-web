export interface IPaymentLookupRequest {
  branchId: string;
  downPayment: number;
  duration: number;
  residual: number;
  financialOptionId: string | undefined;
  id: string;
}

export interface IPaymentCosts {
  monthlyCost: number;
  totalCreditCost: number;
}

export interface IPaymentFees {
  setupFee: number | undefined;
  administrationFee: number | undefined;
}

export interface IPaymentInterests {
  interest: number;
  effectiveInterest: number;
}

export interface IPaymentRangeSpec {
  min: number;
  max: number;
  step: number;
  default: number;
  current: number;
}

export interface IPaymentLookupResponse {
  getCosts(): IPaymentCosts;
  getFees(): IPaymentFees;
  getInterests(): IPaymentInterests;
  getDurationSpec(): IPaymentRangeSpec;
  getDownPaymentSpec(): IPaymentRangeSpec;
  getResidualValueSpec(): IPaymentRangeSpec;
  getTotalResidualValue(): number;
  getPublicURL(): string | undefined;
  shouldUseCreditScoring(): boolean;
  getFinancialProductCode(): string | undefined;
  getPrice(): number;
  getCreditAmount(): number;
  hasPrivacyPolicy(): boolean;
  getPrivacyPolicyUrl(): string | undefined;
  hasMoneyLaunderingInformationURL(): boolean;
  getMoneyLaunderingInformationURL(): string | undefined;
  hasFinancialOptionId(): boolean;
  getFinancialOptionId(): string | undefined;
}

export interface IPaymentLookupResponseData {
  monthlyCost: number;
  interest: number;
  effectiveInterest: number;
  setupFee?: number;
  administrationFee?: number;
  totalCreditCost: number;
  residual: IPaymentRangeSpec;
  duration: IPaymentRangeSpec;
  downPayment: IPaymentRangeSpec;
  link?: string;
  totalResidualValue: number;
  vehiclePrice: number;
  loanAmount: number;
  useCreditScoring: boolean;
  financialProductCode?: string;
  privacyPolicyUrl?: string;
  moneyLaunderingInformationUrl?: string;
  financialOptionId?: string;
}
