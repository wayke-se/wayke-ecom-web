import { orders } from '@wayke-se/ecom';

export const getOrder = (id: string, dealer?: string) => {
  const request = dealer
    ? orders.newOptionsRequest().forVehicle(id).forDealer(dealer)
    : orders.newOptionsRequest().forVehicle(id);
  return orders.getOptions(request.build());
};
