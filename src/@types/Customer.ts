export interface Customer {
  givenName: string;
  surname: string;
  email: string;
  phone: string;
  socialId: string;
}

export interface PartialCustomer {
  email: string;
  phone: string;
}

export interface CustomerSocialId {
  socialId: string;
}

export interface PartialCustomerAddress {
  givenName: string;
  address: string;
  postalCode: string;
  city: string;
}
