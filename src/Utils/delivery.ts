import { IDeliveryOption, IDistance } from '@wayke-se/ecom';

export const getDeliveryDistance = (
  distance: IDistance | null | undefined,
  deliveryOption: IDeliveryOption
) => {
  if (!distance) return undefined;

  if (distance.unit === 'm' && deliveryOption.unit === 'km')
    return Math.round(distance.value / 1000);

  if (distance.unit === 'km' && deliveryOption.unit === 'm') return distance.value * 1000;

  return distance.value;
};

export const getTotalDeliveryCost = (
  distance: IDistance | null | undefined,
  deliveryOption: IDeliveryOption
) => {
  const deliveryDistance = getDeliveryDistance(distance, deliveryOption);
  if (!deliveryDistance) return undefined;

  if (!deliveryOption.unitPrice) return undefined;

  return deliveryOption.startupCost + deliveryOption.unitPrice * deliveryDistance;
};
