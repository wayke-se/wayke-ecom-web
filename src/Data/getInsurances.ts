import { WaykeStore } from '../Redux/store';
import { DrivingDistance, insurances } from '../sdk';

export const getInsurances = (store: WaykeStore, drivingDistance: DrivingDistance) => {
  const state = store.getState();
  if (!state.id) throw 'No id';

  const request = insurances
    .newInsuranceOptionsRequest()
    .forCustomer(state.customer.socialId)
    .forVehicle(state.id)
    .withDrivingDistance(drivingDistance);

  return insurances.getOptions(request.build());
};
