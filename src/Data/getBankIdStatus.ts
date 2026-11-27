import { bankid } from '../sdk';

export const getBankIdStatus = (reference: string) => {
  const request = bankid.newCollectRequest().withOrderRef(reference).build();

  return bankid.collect(request);
};
