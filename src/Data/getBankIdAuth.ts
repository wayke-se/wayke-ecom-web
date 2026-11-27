import { AuthMethod, bankid } from '../sdk';

export const getBankIdAuth = (method: AuthMethod) => {
  const request = bankid.newAuthRequest().withMethod(method).build();

  return bankid.auth(request);
};
