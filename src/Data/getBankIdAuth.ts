import { bankid, AuthMethod } from '@wayke-se/ecom';

export const getBankIdAuth = (method: AuthMethod) => {
  const request = bankid.newAuthRequest().withMethod(method).build();

  return bankid.auth(request);
};
