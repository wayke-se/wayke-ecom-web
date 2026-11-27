import { IBankIdQrCodeRequest } from './types';

export class BankIdQrCodeRequestBuilder {
  public static validate(request: IBankIdQrCodeRequest) {
    if (!request) {
      throw new Error('Request can not be falsy');
    }

    if (!request.orderRef) {
      throw new Error('Missing orderRef');
    }
  }

  private properties: {
    [key: string]: any;
  } = {};

  public withOrderRef(orderRef: string): BankIdQrCodeRequestBuilder {
    this.properties.orderRef = orderRef;

    return this;
  }

  public build(): IBankIdQrCodeRequest {
    return this.properties as IBankIdQrCodeRequest;
  }
}
