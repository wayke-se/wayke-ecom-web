import { IAddress } from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { BaseAction } from '../@types/BaseAction';
import { PartialCustomer } from '../@types/Customer';
import { Vehicle } from '../@types/Vehicle';
import store from './store';

export const PROCEED_TO_VIEW_2_STAGE_1 = 'PROCEED_TO_VIEW_2_STAGE_1';
export type PROCEED_TO_VIEW_2_STAGE_1_TYPE = BaseAction<typeof PROCEED_TO_VIEW_2_STAGE_1> & {
  order: OrderOptionsResponse;
};

export const proceedToView2Stage1 = (order: OrderOptionsResponse) => {
  store.dispatch({ type: PROCEED_TO_VIEW_2_STAGE_1, order });
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

export const SET_SOCIAL_ID_AND_ADDRESS = 'SET_SOCIAL_ID_AND_ADDRESS';
export type SET_SOCIAL_ID_AND_ADDRESS_TYPE = BaseAction<typeof SET_SOCIAL_ID_AND_ADDRESS> & {
  socialId: string;
  address: IAddress;
};

export const setSocialIdAndAddress = (socialId: string, address: IAddress) => {
  store.dispatch({ type: SET_SOCIAL_ID_AND_ADDRESS, socialId, address });
};

export const RESTART_CONTACT = 'RESTART_CONTACT';
export type RESTART_CONTACT_TYPE = BaseAction<typeof RESTART_CONTACT>;

export const restartContact = () => {
  store.dispatch({ type: RESTART_CONTACT });
};

export type Action =
  | SET_VEHICLE_TYPE
  | PROCEED_TO_VIEW_2_STAGE_1_TYPE
  | SET_CONTACT_EMAIL_AND_PHONE_TYPE
  | SET_SOCIAL_ID_AND_ADDRESS_TYPE
  | RESTART_CONTACT_TYPE;
