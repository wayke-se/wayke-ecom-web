import { vehicles } from '@wayke-se/ecom';
import { TradeInCarData } from '../@types/TradeIn';

export const getTradeInVehicle = (data: TradeInCarData) => {
  const request = vehicles
    .newLookupRequest()
    .withRegistrationNumber(data.registrationNumber)
    .withMileage(parseInt(data.mileage, 10))
    .withCondition(data.condition);

  return vehicles.lookupVehicle(request.build());
};
