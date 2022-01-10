import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { BaseAction } from '../@types/BaseAction';
import { PartialCustomer } from '../@types/Customer';
import { Vehicle } from '../@types/Vehicle';
import store from './store';

export const PROCEED_TO_VIEW_2 = 'PROCEED_TO_VIEW_2';
export type PROCEED_TO_VIEW_2_TYPE = BaseAction<typeof PROCEED_TO_VIEW_2> & {
  order: OrderOptionsResponse;
};

export const proceedToView2 = (order: OrderOptionsResponse) => {
  store.dispatch({ type: PROCEED_TO_VIEW_2, order });
};

export const SET_VEHICLE = 'SET_VEHICLE';
export type SET_VEHICLE_TYPE = BaseAction<typeof SET_VEHICLE> & {
  vehicle: Vehicle;
};

export const setVehicle = (vehicle: Vehicle) => {
  store.dispatch({ type: SET_VEHICLE, vehicle });
};

export const SET_CONTACT_EMAIL_AND_PHONE = 'SET_CONTACT_EMAIL_AND_PHONE';
export type SET_CONTACT_EMAIL_AND_PHONE_TYPE = BaseAction<typeof SET_CONTACT_EMAIL_AND_PHONE> & {
  value: PartialCustomer;
};

export const setContactAndPhone = (value: PartialCustomer) => {
  store.dispatch({ type: SET_CONTACT_EMAIL_AND_PHONE, value });
};

export type Action = SET_VEHICLE_TYPE | PROCEED_TO_VIEW_2_TYPE | SET_CONTACT_EMAIL_AND_PHONE_TYPE;
