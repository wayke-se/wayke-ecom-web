import { IBankIdCollectRequest } from './types';

export class BankIdCollectRequestBuilder {
  public static validate(request: IBankIdCollectRequest) {
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

  public build(): IBankIdCollectRequest {
    return this.properties as IBankIdCollectRequest;
  }
}
