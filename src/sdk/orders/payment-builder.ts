import { IOrderCreditAssessment, IOrderPaymentRequest, PaymentType } from './types';

export class PaymentBuilder {
  private properties: { [key: string]: any } = {};

  public withType(paymentType: PaymentType): PaymentBuilder {
    this.properties.type = paymentType;

    return this;
  }

  public withDuration(duration: number): PaymentBuilder {
    this.properties.months = duration;

    return this;
  }

  public withDownPayment(downPayment: number): PaymentBuilder {
    this.properties.downPayment = downPayment;

    return this;
  }

  public withResidualValue(residualValue: number): PaymentBuilder {
    this.properties.residualValue = residualValue;

    return this;
  }

  public withExternalId(externalId: string): PaymentBuilder {
    this.properties.externalId = externalId;

    return this;
  }

  public withCreditAssessment(creditAssessment: IOrderCreditAssessment): PaymentBuilder {
    this.properties.creditAssessment = creditAssessment;

    return this;
  }

  public build(): IOrderPaymentRequest {
    return this.properties as IOrderPaymentRequest;
  }
}
