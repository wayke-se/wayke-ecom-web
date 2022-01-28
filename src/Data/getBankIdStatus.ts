import { bankid } from '@wayke-se/ecom';

export const getBankIdStatus = (reference: string) => {
  const request = bankid.newCollectRequest().withOrderRef(reference).build();

  return bankid.collect(request);
};
