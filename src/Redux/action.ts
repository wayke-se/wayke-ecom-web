import {
  DrivingDistance,
  IAddress,
  ICreditAssessmentStatusResponse,
  IInsuranceOption,
  IAvailableInsuranceOption,
  IVehicle,
  PaymentType,
} from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import { BaseAction } from '../@types/BaseAction';
import { PartialCustomer } from '../@types/Customer';
import { ViewTypes } from '../@types/Navigation';
import { StageTypes } from '../@types/Stages';
import { TradeInCarData } from '../@types/TradeIn';
import { Vehicle } from '../@types/Vehicle';
import { dispatch } from './store';

export const RESET = 'RESET';
export type RESET_TYPE = BaseAction<typeof RESET> & {
  id: string;
};
export const reset = (id: string) => dispatch({ type: RESET, id });

export const SET_ORDER = 'SET_ORDER';
export type SET_ORDER_TYPE = BaseAction<typeof SET_ORDER> & {
  order: OrderOptionsResponse;
  vehicle?: Vehicle;
};
export const setOrder = (order: OrderOptionsResponse, vehicle?: Vehicle) =>
  dispatch({ type: SET_ORDER, order, vehicle });

export const SET_ID = 'SET_ID';
export type SET_ID_TYPE = BaseAction<typeof SET_ID> & {
  id: string;
};
export const setId = (id: string) => dispatch({ type: SET_ID, id });

export const SET_CONTACT_EMAIL_AND_PHONE = 'SET_CONTACT_EMAIL_AND_PHONE';
export type SET_CONTACT_EMAIL_AND_PHONE_TYPE = BaseAction<typeof SET_CONTACT_EMAIL_AND_PHONE> & {
  value: PartialCustomer;
};
export const setContactAndPhone = (value: PartialCustomer) =>
  dispatch({ type: SET_CONTACT_EMAIL_AND_PHONE, value });

export const SET_SOCIAL_ID_AND_ADDRESS = 'SET_SOCIAL_ID_AND_ADDRESS';
export type SET_SOCIAL_ID_AND_ADDRESS_TYPE = BaseAction<typeof SET_SOCIAL_ID_AND_ADDRESS> & {
  socialId: string;
  address: IAddress;
  lastStage: boolean;
};
export const setSocialIdAndAddress = (socialId: string, address: IAddress, lastStage: boolean) =>
  dispatch({ type: SET_SOCIAL_ID_AND_ADDRESS, socialId, address, lastStage });

export const SET_HOME_DELIVERY = 'SET_HOME_DELIVERY';
export type SET_HOME_DELIVERY_TYPE = BaseAction<typeof SET_HOME_DELIVERY> & {
  homeDelivery: boolean;
  lastStage: boolean;
};
export const setHomeDelivery = (homeDelivery: boolean, lastStage: boolean) =>
  dispatch({ type: SET_HOME_DELIVERY, homeDelivery, lastStage });

export const INIT_TRADE_IN = 'INIT_TRADE_IN';
export type INIT_TRADE_IN_TYPE = BaseAction<typeof INIT_TRADE_IN> & {
  lastStage: boolean;
};
export const initTradeIn = (lastStage: boolean) => dispatch({ type: INIT_TRADE_IN, lastStage });

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
) => dispatch({ type: SET_TRADE_IN, lastStage, tradeIn, tradeInVehicle });

export const SET_FINANCIAL = 'SET_FINANCIAL';
export type SET_FINANCIAL_TYPE = BaseAction<typeof SET_FINANCIAL> & {
  paymentType: PaymentType;
  lastStage: boolean;
};
export const setFinancial = (paymentType: PaymentType, lastStage: boolean) =>
  dispatch({ type: SET_FINANCIAL, paymentType, lastStage });

export const SET_PAYMENT_LOOKUP_RESPONSE = 'SET_PAYMENT_LOOKUP_RESPONSE';
export type SET_PAYMENT_LOOKUP_RESPONSE_TYPE = BaseAction<typeof SET_PAYMENT_LOOKUP_RESPONSE> & {
  paymentLookupResponse: PaymentLookupResponse;
};
export const setPaymentLookupResponse = (paymentLookupResponse: PaymentLookupResponse) =>
  dispatch({ type: SET_PAYMENT_LOOKUP_RESPONSE, paymentLookupResponse });

export const SET_DRIVING_DISTANCE = 'SET_DRIVING_DISTANCE';
export type SET_DRIVING_DISTANCE_TYPE = BaseAction<typeof SET_DRIVING_DISTANCE> & {
  drivingDistance: DrivingDistance;
};

export const setDrivingDistance = (drivingDistance: DrivingDistance) =>
  dispatch({ type: SET_DRIVING_DISTANCE, drivingDistance });

export const COMPLETE_STAGE = 'COMPLETE_STAGE';
export type COMPLETE_STAGE_TYPE = BaseAction<typeof COMPLETE_STAGE> & {
  lastStage: boolean;
};
export const completeStage = (lastStage: boolean) => dispatch({ type: COMPLETE_STAGE, lastStage });

export const SET_OR_REMOVE_INSURANCE = 'SET_OR_REMOVE_INSURANCE';
export type SET_OR_REMOVE_INSURANCE_TYPE = BaseAction<typeof SET_OR_REMOVE_INSURANCE> & {
  insurance?: IInsuranceOption;
};
export const addOrRemoveInsurance = (insurance: IInsuranceOption) =>
  dispatch({ type: SET_OR_REMOVE_INSURANCE, insurance });

export const SET_OR_REMOVE_FREE_INSURANCE = 'SET_OR_REMOVE_FREE_INSURANCE';
export type SET_OR_REMOVE_FREE_INSURANCE_TYPE = BaseAction<typeof SET_OR_REMOVE_FREE_INSURANCE> & {
  freeInsurance?: IAvailableInsuranceOption;
};
export const addOrRemoveFreeInsurance = (freeInsurance: IAvailableInsuranceOption) =>
  dispatch({ type: SET_OR_REMOVE_FREE_INSURANCE, freeInsurance });

export const SET_OR_REMOVE_ACCESSORY = 'SET_OR_REMOVE_ACCESSORY';
export type SET_OR_REMOVE_ACCESSORY_TYPE = BaseAction<typeof SET_OR_REMOVE_ACCESSORY> & {
  accessory: IAccessory;
};
export const addOrRemoveAccessory = (accessory: IAccessory) =>
  dispatch({ type: SET_OR_REMOVE_ACCESSORY, accessory });

export const GO_TO = 'GO_TO';
export type GO_TO_TYPE = BaseAction<typeof GO_TO> & {
  view: ViewTypes;
  index?: number;
  subStage?: number;
};
export const goTo = (view: ViewTypes, index?: number, subStage?: number) =>
  dispatch({ type: GO_TO, view, index, subStage });

export const SET_STAGES = 'SET_STAGES';
export type SET_STAGES_TYPE = BaseAction<typeof SET_STAGES> & {
  stages: StageTypes[];
};
export const setStages = (stages: StageTypes[]) => dispatch({ type: SET_STAGES, stages });

export const SET_CREATED_ORDER_ID = 'SET_CREATED_ORDER_ID';
export type SET_CREATED_ORDER_ID_TYPE = BaseAction<typeof SET_CREATED_ORDER_ID> & {
  id: string;
};
export const setCreatedOrderId = (id: string) => dispatch({ type: SET_CREATED_ORDER_ID, id });

export const SET_CREDIT_ASSESSMENT_RESPONSE = 'SET_CREDIT_ASSESSMENT_RESPONSE';
export type SET_CREDIT_ASSESSMENT_RESPONSE_TYPE = BaseAction<
  typeof SET_CREDIT_ASSESSMENT_RESPONSE
> & {
  caseId: string;
  creditAssessmentResponse?: ICreditAssessmentStatusResponse;
};
export const setCreditAssessmentResponse = (
  caseId: string,
  creditAssessmentResponse: ICreditAssessmentStatusResponse
) => dispatch({ type: SET_CREDIT_ASSESSMENT_RESPONSE, caseId, creditAssessmentResponse });

export type Action =
  | RESET_TYPE
  | SET_ORDER_TYPE
  | SET_ID_TYPE
  | SET_CONTACT_EMAIL_AND_PHONE_TYPE
  | SET_SOCIAL_ID_AND_ADDRESS_TYPE
  | SET_HOME_DELIVERY_TYPE
  | INIT_TRADE_IN_TYPE
  | SET_TRADE_IN_TYPE
  | SET_FINANCIAL_TYPE
  | SET_PAYMENT_LOOKUP_RESPONSE_TYPE
  | SET_DRIVING_DISTANCE_TYPE
  | SET_OR_REMOVE_INSURANCE_TYPE
  | SET_OR_REMOVE_FREE_INSURANCE_TYPE
  | SET_OR_REMOVE_ACCESSORY_TYPE
  | GO_TO_TYPE
  | SET_STAGES_TYPE
  | COMPLETE_STAGE_TYPE
  | SET_CREATED_ORDER_ID_TYPE
  | SET_CREDIT_ASSESSMENT_RESPONSE_TYPE;
