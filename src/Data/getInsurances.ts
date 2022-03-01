import { insurances, DrivingDistance } from '@wayke-se/ecom';
import store from '../Redux/store';

export const getInsurances = (drivingDistance: DrivingDistance) => {
  const state = store.getState();
  if (!state.id) throw 'No id';

  const request = insurances
    .newInsuranceOptionsRequest()
    .forCustomer(state.customer.socialId)
    .forVehicle(state.id)
    .withDrivingDistance(drivingDistance);

  return insurances.getOptions(request.build());
};
