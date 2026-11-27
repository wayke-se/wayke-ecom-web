import {
  IPaymentCosts,
  IPaymentFees,
  IPaymentInterests,
  IPaymentLookupResponse,
  IPaymentLookupResponseData,
  IPaymentRangeSpec,
} from './types';

export class PaymentLookupResponse implements IPaymentLookupResponse {
  private response: IPaymentLookupResponseData;

  public constructor(response: IPaymentLookupResponseData) {
    if (!response) {
      throw new Error('Missing payment lookup response data');
    }

    this.response = response;
  }

  public getCosts(): IPaymentCosts {
    return {
      monthlyCost: this.response.monthlyCost,
      totalCreditCost: this.response.totalCreditCost,
    };
  }

  public getFees(): IPaymentFees {
    return {
      setupFee: this.response.setupFee,
      administrationFee: this.response.administrationFee,
    };
  }

  public getInterests(): IPaymentInterests {
    return {
      interest: this.response.interest,
      effectiveInterest: this.response.effectiveInterest,
    };
  }

  public getDurationSpec(): IPaymentRangeSpec {
    return this.response.duration;
  }

  public getDownPaymentSpec(): IPaymentRangeSpec {
    return this.response.downPayment;
  }

  public getResidualValueSpec(): IPaymentRangeSpec {
    return this.response.residual;
  }

  public getTotalResidualValue(): number {
    return this.response.totalResidualValue;
  }

  public getPublicURL(): string | undefined {
    return this.response.link;
  }

  public shouldUseCreditScoring() {
    return this.response.useCreditScoring;
  }

  public getFinancialProductCode() {
    return this.response.financialProductCode;
  }

  public getPrice() {
    return this.response.vehiclePrice;
  }

  public getCreditAmount() {
    return this.response.loanAmount;
  }

  public hasPrivacyPolicy() {
    return !!this.response.privacyPolicyUrl;
  }

  public getPrivacyPolicyUrl() {
    return this.response.privacyPolicyUrl;
  }

  public hasMoneyLaunderingInformationURL() {
    return !!this.response.moneyLaunderingInformationUrl;
  }

  public getMoneyLaunderingInformationURL() {
    return this.response.moneyLaunderingInformationUrl;
  }

  public hasFinancialOptionId() {
    return !!this.response.financialOptionId;
  }

  public getFinancialOptionId() {
    return this.response.financialOptionId;
  }
}
