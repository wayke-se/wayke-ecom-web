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
