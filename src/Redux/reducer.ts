import { IAddress, IVehicle, PaymentType } from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import { Customer } from '../@types/Customer';
import { Navigation } from '../@types/Navigation';
import { StageTypes } from '../@types/Stages';
import { TradeInCarDataPartial } from '../@types/TradeIn';
import { Vehicle } from '../@types/Vehicle';
import {
  Action,
  PROCEED_TO_VIEW_2_STAGE_1,
  SET_CONTACT_EMAIL_AND_PHONE,
  SET_ORDER,
  SET_VEHICLE,
  SET_SOCIAL_ID_AND_ADDRESS,
  SET_HOME_DELIVERY,
  SET_TRADE_IN,
  SET_FINANCIAL,
  SET_INSURANCE,
  INIT_TRADE_IN,
  EDIT,
  SET_PAYMENT_LOOKUP_RESPONSE,
  SET_ID,
  SET_STAGES,
} from './action';

export interface ReducerState {
  id?: string;
  topNavigation: Navigation;
  navigation: Navigation;
  vehicle?: Vehicle;
  order?: OrderOptionsResponse;
  customer: Customer;
  address?: IAddress;
  homeDelivery: boolean;
  wantTradeIn?: boolean;
  tradeIn?: TradeInCarDataPartial;
  tradeInVehicle?: IVehicle;
  centralStorage: boolean;
  paymentType?: PaymentType;
  paymentLookupResponse?: PaymentLookupResponse;
  edit: {
    customer: boolean;
    delivery: boolean;
    tradeIn: boolean;
    financial: boolean;
    insurance: boolean;
  };
  stages?: StageTypes[];
}

const initialState: ReducerState = {
  topNavigation: {
    view: 'preview',
    stage: 1,
    subStage: 1,
  },
  navigation: {
    view: 'preview',
    stage: 1,
    subStage: 1,
  },
  customer: {
    email: '',
    phone: '',
    givenName: '',
    surname: '',
    socialId: '',
  },
  edit: {
    customer: false,
    delivery: false,
    tradeIn: false,
    financial: false,
    insurance: false,
  },
  homeDelivery: false,
  centralStorage: false,
};

//// view 1 = preview
// view 2 = stage

const getNextNavigationState = (currentStage: number, lastStage: boolean): Navigation =>
  lastStage
    ? { view: 'summary', stage: 1, subStage: 1 }
    : { view: 'main', stage: currentStage + 1, subStage: 1 };

let next: ReducerState;
const reducer = (state = initialState, action: Action): ReducerState => {
  let navigation: Navigation;

  next = { ...state };
  switch (action.type) {
    case SET_STAGES:
      return { ...next, stages: action.stages };
    case SET_ID:
      return { ...next, id: action.id };
    case SET_VEHICLE:
      return { ...state, vehicle: action.vehicle };
    case SET_ORDER:
      const paymentOptions = action.order?.getPaymentOptions();
      // If only cash payment is available, pre select
      const paymentType =
        !state.paymentType &&
        paymentOptions?.length === 1 &&
        paymentOptions?.[0].type === PaymentType.Cash
          ? PaymentType.Cash
          : undefined;

      return { ...state, order: action.order, paymentType };
    case PROCEED_TO_VIEW_2_STAGE_1:
      return {
        ...state,
        navigation: { view: 'main', stage: 1, subStage: 1 },
      };
    case SET_CONTACT_EMAIL_AND_PHONE:
      return {
        ...state,
        customer: { ...state.customer, email: action.value.email, phone: action.value.phone },
        navigation: { view: 'main', stage: state.navigation.stage, subStage: 2 },
      };
    case SET_SOCIAL_ID_AND_ADDRESS:
      navigation = getNextNavigationState(state.navigation.stage, action.lastStage);

      next = {
        ...state,
        navigation,
        topNavigation:
          next.topNavigation.stage < navigation.stage ? navigation : state.topNavigation,
        address: action.address,
        customer: { ...state.customer, socialId: action.socialId },
      };

      return next;
    case SET_HOME_DELIVERY:
      navigation = getNextNavigationState(state.navigation.stage, action.lastStage);

      next = {
        ...state,
        navigation,
        topNavigation:
          next.topNavigation.stage < navigation.stage ? navigation : state.topNavigation,
        homeDelivery: action.homeDelivery,
      };

      return next;

    case INIT_TRADE_IN:
      navigation = { view: 'main', stage: state.navigation.stage, subStage: 1 };
      next = {
        ...state,
        navigation,
        wantTradeIn: true,
        topNavigation:
          next.topNavigation.stage < navigation.stage ? navigation : state.topNavigation,
        tradeIn: state.tradeIn || {
          registrationNumber: '',
          mileage: '',
          description: '',
        },
      };
      return next;

    case SET_TRADE_IN:
      navigation = getNextNavigationState(state.navigation.stage, action.lastStage);

      next = {
        ...state,
        navigation,
        topNavigation:
          next.topNavigation.stage < navigation.stage ? navigation : state.topNavigation,
        wantTradeIn: !!action.tradeIn,
        tradeIn: action.tradeIn,
        tradeInVehicle: action.tradeInVehicle,
      };

      return next;

    case SET_FINANCIAL:
      navigation = getNextNavigationState(state.navigation.stage, action.lastStage);

      return {
        ...next,
        navigation,
        topNavigation:
          next.topNavigation.stage < navigation.stage ? navigation : state.topNavigation,
        paymentType: action.paymentType,
      };

    case SET_PAYMENT_LOOKUP_RESPONSE:
      return { ...next, paymentLookupResponse: action.paymentLookupResponse };

    case SET_INSURANCE:
      navigation = getNextNavigationState(state.navigation.stage, action.lastStage);

      next = {
        ...state,
        navigation,
        topNavigation:
          next.topNavigation.stage < navigation.stage ? navigation : state.topNavigation,
      };

      return next;

    case EDIT:
      return {
        ...state,
        navigation: { view: 'main', stage: action.index, subStage: 1 },
      };

    default:
      return state;
  }
};

export type RootState = ReturnType<typeof reducer>;

export default reducer;
