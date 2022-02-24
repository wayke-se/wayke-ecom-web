import { insurances, DrivingDistance, PaymentType } from '@wayke-se/ecom';
import store from '../Redux/store';

export const getInsurance = (paymentType: PaymentType, drivingDistance: DrivingDistance) => {
  const state = store.getState();
  if (!state.vehicle?.id) throw 'No id';

  const request = insurances
    .newInsuranceOptionsRequest()
    .forCustomer(state.customer.socialId)
    .forVehicle(state.vehicle.id)
    .withPaymentType(paymentType)
    .withDrivingDistance(drivingDistance);

  return insurances.getOptions(request.build());
};
