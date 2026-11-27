import { IAddressLookupRequest } from './types';

export class AddressLookupRequestBuilder {
  public static validateRequest(request: IAddressLookupRequest) {
    if (!request) {
      throw new Error('Missing address lookup request');
    }

    if (!request.personalNumber) {
      throw new Error('Missing personal number in address lookup request');
    }
  }

  private properties: { [key: string]: any } = {};
  public forCustomer(personalNumber: string): AddressLookupRequestBuilder {
    this.properties.personalNumber = personalNumber;

    return this;
  }

  public build(): IAddressLookupRequest {
    return this.properties as IAddressLookupRequest;
  }
}
