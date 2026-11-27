import { IAddress, IAddressLookupResponse } from './types';

export class AddressLookupResponse implements IAddressLookupResponse {
  private response: IAddress;

  public constructor(response: IAddress) {
    if (!response) {
      throw new Error('Missing address lookup response data');
    }

    this.response = response;
  }

  public getAddress(): IAddress {
    return {
      city: this.response.city,
      name: this.response.name,
      givenName: this.response.givenName,
      surname: this.response.surname,
      postalCode: this.response.postalCode,
      street: this.response.street,
      street2: this.response.street2,
      distance: this.response.distance,
    };
  }
}
