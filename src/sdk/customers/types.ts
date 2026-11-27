export interface IAddressLookupRequest {
  personalNumber: string;
}

export interface IAddressLookupResponseData extends IAddress {
  personalNumber: string;
}

export interface IAddressLookupResponse {
  getAddress(): IAddress;
}

export interface IDistance {
  value: number;
  unit: string;
}

export interface IAddress {
  city: string;
  name?: string;
  givenName: string;
  surname: string;
  postalCode: string;
  street: string;
  street2: string;
  distance?: IDistance | null;
}

export interface ICustomer {
  name?: string;
  personalNumber: string;
  givenName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: IAddress;
}
