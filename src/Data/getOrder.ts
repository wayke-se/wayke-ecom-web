import { orders } from '@wayke-se/ecom';

export const getOrder = (id: string) => {
  const request = orders.newOptionsRequest().forVehicle(id);
  return orders.getOptions(request.build());
};
