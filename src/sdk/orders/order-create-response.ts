import { IOrderCreateResponse, IOrderCreateResponseData, IPaymentResponse } from './types';

export class OrderCreateResponse implements IOrderCreateResponse {
  private response: IOrderCreateResponseData;

  public constructor(response: IOrderCreateResponseData) {
    if (!response) {
      throw new Error('Missing order create response data');
    }

    this.response = response;
  }

  public getId(): string {
    return this.response.id;
  }

  public getPayment(): IPaymentResponse {
    return this.response.payment;
  }

  public getOrderNumber(): string | null | undefined {
    return this.response.orderNumber;
  }
}
