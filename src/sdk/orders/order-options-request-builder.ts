import { IOrderOptionsRequest } from './types';

export class OrderOptionsRequestBuilder {
  public static validateRequest(request: IOrderOptionsRequest) {
    if (!request) {
      throw new Error('Missing order setup request');
    }

    if (!request.id) {
      throw new Error('Missing vehicle ID in order setup request');
    }
  }

  private properties: { [key: string]: any } = {};
  public forVehicle(id: string): OrderOptionsRequestBuilder {
    this.properties.id = id;

    return this;
  }

  public forDealer(id: string): OrderOptionsRequestBuilder {
    this.properties.branchId = id;

    return this;
  }

  public build(): IOrderOptionsRequest {
    return this.properties as IOrderOptionsRequest;
  }
}
