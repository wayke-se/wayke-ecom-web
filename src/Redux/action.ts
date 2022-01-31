import { IAddress, IVehicle, PaymentType } from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import { BaseAction } from '../@types/BaseAction';
import { PartialCustomer } from '../@types/Customer';
import { TradeInCarData } from '../@types/TradeIn';
import { Vehicle } from '../@types/Vehicle';
import store from './store';

export const SET_ORDER = 'SET_ORDER';
export type SET_ORDER_TYPE = BaseAction<typeof SET_ORDER> & {
  order: OrderOptionsResponse;
};
export const setOrder = (order: OrderOptionsResponse) => store.dispatch({ type: SET_ORDER, order });

export const PROCEED_TO_VIEW_2_STAGE_1 = 'PROCEED_TO_VIEW_2_STAGE_1';
export type PROCEED_TO_VIEW_2_STAGE_1_TYPE = BaseAction<typeof PROCEED_TO_VIEW_2_STAGE_1>;
export const proceedToView2Stage1 = () => store.dispatch({ type: PROCEED_TO_VIEW_2_STAGE_1 });

export const SET_ID = 'SET_ID';
export type SET_ID_TYPE = BaseAction<typeof SET_ID> & {
  id: string;
};
export const setId = (id: string) => store.dispatch({ type: SET_ID, id });

export const SET_VEHICLE = 'SET_VEHICLE';
export type SET_VEHICLE_TYPE = BaseAction<typeof SET_VEHICLE> & {
  vehicle: Vehicle;
};
export const setVehicle = (vehicle: Vehicle) => store.dispatch({ type: SET_VEHICLE, vehicle });

export const SET_CONTACT_EMAIL_AND_PHONE = 'SET_CONTACT_EMAIL_AND_PHONE';
export type SET_CONTACT_EMAIL_AND_PHONE_TYPE = BaseAction<typeof SET_CONTACT_EMAIL_AND_PHONE> & {
  value: PartialCustomer;
};
export const setContactAndPhone = (value: PartialCustomer) =>
  store.dispatch({ type: SET_CONTACT_EMAIL_AND_PHONE, value });

export const SET_SOCIAL_ID_AND_ADDRESS = 'SET_SOCIAL_ID_AND_ADDRESS';
export type SET_SOCIAL_ID_AND_ADDRESS_TYPE = BaseAction<typeof SET_SOCIAL_ID_AND_ADDRESS> & {
  socialId: string;
  address: IAddress;
};
export const setSocialIdAndAddress = (socialId: string, address: IAddress) =>
  store.dispatch({ type: SET_SOCIAL_ID_AND_ADDRESS, socialId, address });

export const EDIT_CUSTOMER = 'EDIT_CUSTOMER';
export type EDIT_CUSTOMER_TYPE = BaseAction<typeof EDIT_CUSTOMER>;
export const editCustomer = () => store.dispatch({ type: EDIT_CUSTOMER });

export const SET_HOME_DELIVERY = 'SET_HOME_DELIVERY';
export type SET_HOME_DELIVERY_TYPE = BaseAction<typeof SET_HOME_DELIVERY> & {
  homeDelivery: boolean;
};
export const setHomeDelivery = (homeDelivery: boolean) =>
  store.dispatch({ type: SET_HOME_DELIVERY, homeDelivery });

export const EDIT_DELIVERY = 'EDIT_DELIVERY';
export type EDIT_DELIVERY_TYPE = BaseAction<typeof EDIT_DELIVERY>;
export const editDelivery = () => store.dispatch({ type: EDIT_DELIVERY });

export const INIT_TRADE_IN = 'INIT_TRADE_IN';
export type INIT_TRADE_IN_TYPE = BaseAction<typeof INIT_TRADE_IN>;
export const initTradeIn = () => store.dispatch({ type: INIT_TRADE_IN });

export const SET_TRADE_IN = 'SET_TRADE_IN';
export type SET_TRADE_IN_TYPE = BaseAction<typeof SET_TRADE_IN> & {
  tradeIn?: TradeInCarData;
  tradeInVehicle?: IVehicle;
};
export const setTradeIn = (tradeIn?: TradeInCarData | undefined, tradeInVehicle?: IVehicle) =>
  store.dispatch({ type: SET_TRADE_IN, tradeIn, tradeInVehicle });

export const EDIT_TRADE_IN = 'EDIT_TRADE_IN';
export type EDIT_TRADE_IN_TYPE = BaseAction<typeof EDIT_TRADE_IN>;
export const editTradeIn = () => store.dispatch({ type: EDIT_TRADE_IN });

export const SET_FINANCIAL = 'SET_FINANCIAL';
export type SET_FINANCIAL_TYPE = BaseAction<typeof SET_FINANCIAL> & {
  paymentType: PaymentType;
};
export const setFinancial = (paymentType: PaymentType) =>
  store.dispatch({ type: SET_FINANCIAL, paymentType });

export const SET_PAYMENT_LOOKUP_RESPONSE = 'SET_PAYMENT_LOOKUP_RESPONSE';
export type SET_PAYMENT_LOOKUP_RESPONSE_TYPE = BaseAction<typeof SET_PAYMENT_LOOKUP_RESPONSE> & {
  paymentLookupResponse: PaymentLookupResponse;
};
export const setPaymentLookupResponse = (paymentLookupResponse: PaymentLookupResponse) =>
  store.dispatch({ type: SET_PAYMENT_LOOKUP_RESPONSE, paymentLookupResponse });

export const EDIT_FINANCIAL = 'EDIT_FINANCIAL';
export type EDIT_FINANCIAL_TYPE = BaseAction<typeof EDIT_FINANCIAL>;
export const editFinancial = () => store.dispatch({ type: EDIT_FINANCIAL });

export const SET_INSURANCE = 'SET_INSURANCE';
export type SET_INSURANCE_TYPE = BaseAction<typeof SET_INSURANCE>;
export const setInsurance = () => store.dispatch({ type: SET_INSURANCE });

export const EDIT_INSURANCE = 'EDIT_INSURANCE';
export type EDIT_INSURANCE_TYPE = BaseAction<typeof EDIT_INSURANCE>;
export const editInsurance = () => store.dispatch({ type: EDIT_INSURANCE });

export type Action =
  | SET_ORDER_TYPE
  | SET_ID_TYPE
  | SET_VEHICLE_TYPE
  | PROCEED_TO_VIEW_2_STAGE_1_TYPE
  | SET_CONTACT_EMAIL_AND_PHONE_TYPE
  | SET_SOCIAL_ID_AND_ADDRESS_TYPE
  | SET_HOME_DELIVERY_TYPE
  | EDIT_CUSTOMER_TYPE
  | EDIT_DELIVERY_TYPE
  | INIT_TRADE_IN_TYPE
  | SET_TRADE_IN_TYPE
  | EDIT_TRADE_IN_TYPE
  | SET_FINANCIAL_TYPE
  | SET_PAYMENT_LOOKUP_RESPONSE_TYPE
  | EDIT_FINANCIAL_TYPE
  | SET_INSURANCE_TYPE
  | EDIT_INSURANCE_TYPE;
