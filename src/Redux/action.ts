import { IAddress, IVehicle, PaymentType } from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import { BaseAction } from '../@types/BaseAction';
import { PartialCustomer } from '../@types/Customer';
import { StageTypes } from '../@types/Stages';
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
  lastStage: boolean;
};
export const setSocialIdAndAddress = (socialId: string, address: IAddress, lastStage: boolean) =>
  store.dispatch({ type: SET_SOCIAL_ID_AND_ADDRESS, socialId, address, lastStage });

export const SET_HOME_DELIVERY = 'SET_HOME_DELIVERY';
export type SET_HOME_DELIVERY_TYPE = BaseAction<typeof SET_HOME_DELIVERY> & {
  homeDelivery: boolean;
  lastStage: boolean;
};
export const setHomeDelivery = (homeDelivery: boolean, lastStage: boolean) =>
  store.dispatch({ type: SET_HOME_DELIVERY, homeDelivery, lastStage });

export const INIT_TRADE_IN = 'INIT_TRADE_IN';
export type INIT_TRADE_IN_TYPE = BaseAction<typeof INIT_TRADE_IN> & {
  lastStage: boolean;
};
export const initTradeIn = (lastStage: boolean) =>
  store.dispatch({ type: INIT_TRADE_IN, lastStage });

export const SET_TRADE_IN = 'SET_TRADE_IN';
export type SET_TRADE_IN_TYPE = BaseAction<typeof SET_TRADE_IN> & {
  lastStage: boolean;
  tradeIn?: TradeInCarData;
  tradeInVehicle?: IVehicle;
};
export const setTradeIn = (
  lastStage: boolean,
  tradeIn?: TradeInCarData | undefined,
  tradeInVehicle?: IVehicle
) => store.dispatch({ type: SET_TRADE_IN, lastStage, tradeIn, tradeInVehicle });

export const SET_FINANCIAL = 'SET_FINANCIAL';
export type SET_FINANCIAL_TYPE = BaseAction<typeof SET_FINANCIAL> & {
  paymentType: PaymentType;
  lastStage: boolean;
};
export const setFinancial = (paymentType: PaymentType, lastStage: boolean) =>
  store.dispatch({ type: SET_FINANCIAL, paymentType, lastStage });

export const SET_PAYMENT_LOOKUP_RESPONSE = 'SET_PAYMENT_LOOKUP_RESPONSE';
export type SET_PAYMENT_LOOKUP_RESPONSE_TYPE = BaseAction<typeof SET_PAYMENT_LOOKUP_RESPONSE> & {
  paymentLookupResponse: PaymentLookupResponse;
};
export const setPaymentLookupResponse = (paymentLookupResponse: PaymentLookupResponse) =>
  store.dispatch({ type: SET_PAYMENT_LOOKUP_RESPONSE, paymentLookupResponse });

export const SET_INSURANCE = 'SET_INSURANCE';
export type SET_INSURANCE_TYPE = BaseAction<typeof SET_INSURANCE> & {
  lastStage: boolean;
};
export const setInsurance = (lastStage: boolean) =>
  store.dispatch({ type: SET_INSURANCE, lastStage });

export const EDIT = 'EDIT';
export type EDIT_TYPE = BaseAction<typeof EDIT> & {
  index: number;
};
export const edit = (index: number) => store.dispatch({ type: EDIT, index });

export const SET_STAGES = 'SET_STAGES';
export type SET_STAGES_TYPE = BaseAction<typeof SET_STAGES> & {
  stages: StageTypes[];
};
export const setStages = (stages: StageTypes[]) => store.dispatch({ type: SET_STAGES, stages });

export type Action =
  | SET_ORDER_TYPE
  | SET_ID_TYPE
  | SET_VEHICLE_TYPE
  | PROCEED_TO_VIEW_2_STAGE_1_TYPE
  | SET_CONTACT_EMAIL_AND_PHONE_TYPE
  | SET_SOCIAL_ID_AND_ADDRESS_TYPE
  | SET_HOME_DELIVERY_TYPE
  | INIT_TRADE_IN_TYPE
  | SET_TRADE_IN_TYPE
  | SET_FINANCIAL_TYPE
  | SET_PAYMENT_LOOKUP_RESPONSE_TYPE
  | SET_INSURANCE_TYPE
  | EDIT_TYPE
  | SET_STAGES_TYPE;
