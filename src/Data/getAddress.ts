import { customers } from '@wayke-se/ecom';

export const getAddressBySsn = (ssn: string) => {
  const request = customers.newAddressLookupRequest().forCustomer(ssn).build();

  return customers.lookupAddress(request);
};
