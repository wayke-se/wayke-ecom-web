import { IBankIdCancelRequest } from './types';

export class BankIdCancelRequestBuilder {
  public static validate(request: IBankIdCancelRequest) {
    if (!request) {
      throw new Error('Request can not be falsy');
    }

    if (!request.orderRef) {
      throw new Error('Missing order ref');
    }
  }

  private properties: {
    [key: string]: any;
  } = {};

  public withOrderRef(orderRef: string) {
    this.properties.orderRef = orderRef;

    return this;
  }

  public build(): IBankIdCancelRequest {
    return this.properties as IBankIdCancelRequest;
  }
}
