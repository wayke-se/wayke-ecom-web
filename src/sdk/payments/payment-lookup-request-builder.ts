import { IPaymentLookupRequest } from './types';

export class PaymentLookupRequestBuilder {
  public static validateRequest(request: IPaymentLookupRequest) {
    if (!request) {
      throw new Error('Missing payment lookup request');
    }

    if (!request.id) {
      throw new Error('Missing vehicle ID in payment lookup request');
    }

    if (!request.duration || request.duration < 1) {
      throw new Error('Missing month duration in payment lookup request');
    }

    if (!request.downPayment || request.downPayment < 1) {
      throw new Error('Missing cash deposit in payment lookup request');
    }
  }

  private properties: { [key: string]: any } = {};
  public forVehicle(id: string): PaymentLookupRequestBuilder {
    this.properties.id = id;

    return this;
  }

  public forDealer(id: string): PaymentLookupRequestBuilder {
    this.properties.branchId = id;

    return this;
  }

  public withDuration(duration: number): PaymentLookupRequestBuilder {
    this.properties.duration = duration;

    return this;
  }

  public withDownPayment(downPayment: number): PaymentLookupRequestBuilder {
    this.properties.downPayment = downPayment;

    return this;
  }

  public withResidualValue(residual: number): PaymentLookupRequestBuilder {
    this.properties.residual = residual;

    return this;
  }

  public withFinancialOptionId(financialOptionId: string): PaymentLookupRequestBuilder {
    this.properties.financialOptionId = financialOptionId;

    return this;
  }

  public build(): IPaymentLookupRequest {
    return this.properties as IPaymentLookupRequest;
  }
}
