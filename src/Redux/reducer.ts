import {
  DrivingDistance,
  IAddress,
  ICreditAssessmentStatusResponse,
  IInsuranceOption,
  IVehicle,
  PaymentType,
} from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { IAccessory, IOrderVehicle } from '@wayke-se/ecom/dist-types/orders/types';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import { Customer } from '../@types/Customer';
import { Navigation } from '../@types/Navigation';
import { StageTypes } from '../@types/Stages';
import { TradeInCarDataPartial } from '../@types/TradeIn';
import {
  Action,
  SET_CONTACT_EMAIL_AND_PHONE,
  SET_ORDER,
  SET_SOCIAL_ID_AND_ADDRESS,
  SET_HOME_DELIVERY,
  SET_TRADE_IN,
  SET_FINANCIAL,
  INIT_TRADE_IN,
  SET_PAYMENT_LOOKUP_RESPONSE,
  SET_ID,
  SET_STAGES,
  GO_TO,
  SET_OR_REMOVE_ACCESSORY,
  SET_OR_REMOVE_INSURANCE,
  SET_DRIVING_DISTANCE,
  COMPLETE_STAGE,
  SET_CREATED_ORDER_ID,
  SET_CREDIT_ASSESSMENT_RESPONSE,
} from './action';
import { mockCustomer } from './customerMock';

export interface ReducerState {
  id: string;
  topNavigation: Navigation;
  navigation: Navigation;
  vehicle?: IOrderVehicle;
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
  stages?: StageTypes[];
  accessories: IAccessory[];
  drivingDistance: DrivingDistance;
  insurance?: IInsuranceOption;
  createdOrderId?: string;
  creditAssessmentResponse?: ICreditAssessmentStatusResponse;
  caseId?: string;
}

const initNavigation: Navigation = {
  view: 'preview',
  stage: 1,
  subStage: 1,
};

const initialState: ReducerState = {
  id: '',
  topNavigation: {
    ...initNavigation,
  },
  navigation: {
    ...initNavigation,
  },
  customer: {
    // email: '',
    // phone: '',
    // givenName: '',
    // surname: '',
    // socialId: '',
    ...mockCustomer,
  },
  homeDelivery: false,
  centralStorage: false,
  accessories: [],
  drivingDistance: DrivingDistance.Between0And1000,
};

const getNextNavigationState = (currentStage: number, lastStage: boolean): Navigation =>
  lastStage
    ? { view: 'summary', stage: 1, subStage: 1 }
    : { view: 'main', stage: currentStage + 1, subStage: 1 };

const getNextTopNavigationState = (currentTopNavigation: Navigation, nextNavigation: Navigation) =>
  currentTopNavigation.stage < nextNavigation.stage ? nextNavigation : next.topNavigation;

let next: ReducerState;
let index: number;
const reducer = (state = initialState, action: Action): ReducerState => {
  let navigation: Navigation;
  let topNavigation: Navigation;

  next = { ...state };
  switch (action.type) {
    case SET_STAGES:
      return { ...next, stages: action.stages };
    case SET_ID:
      return { ...next, id: action.id };
    case SET_ORDER:
      const paymentOptions = action.order?.getPaymentOptions();
      // If only cash payment is available, pre select
      const paymentType =
        !state.paymentType &&
        paymentOptions?.length === 1 &&
        paymentOptions?.[0].type === PaymentType.Cash
          ? PaymentType.Cash
          : undefined;

      return {
        ...state,
        order: action.order,
        paymentType,
        vehicle: { ...action.order.getOrderVehicle(), ...(action.vehicle || {}) },
      };
    case SET_CONTACT_EMAIL_AND_PHONE:
      const clean: ReducerState = {
        ...next,
        customer: { ...state.customer, email: action.value.email, phone: action.value.phone },
        navigation: { view: 'main', stage: state.navigation.stage, subStage: 2 },
      };

      delete clean.wantTradeIn;
      delete clean.tradeIn;
      delete clean.tradeInVehicle;
      delete clean.paymentType;
      delete clean.paymentLookupResponse;
      delete clean.insurance;
      clean.accessories = [];

      return clean;
    case SET_SOCIAL_ID_AND_ADDRESS:
      navigation = getNextNavigationState(next.navigation.stage, action.lastStage);
      topNavigation = getNextTopNavigationState(next.topNavigation, navigation);

      next = {
        ...state,
        navigation,
        topNavigation,
        address: action.address,
        customer: { ...state.customer, socialId: action.socialId },
      };

      return next;
    case SET_HOME_DELIVERY:
      navigation = getNextNavigationState(state.navigation.stage, action.lastStage);
      topNavigation = getNextTopNavigationState(next.topNavigation, navigation);

      next = {
        ...state,
        navigation,
        topNavigation,
        homeDelivery: action.homeDelivery,
      };

      return next;

    case INIT_TRADE_IN:
      navigation = { view: 'main', stage: state.navigation.stage, subStage: 1 };
      topNavigation = getNextTopNavigationState(next.topNavigation, navigation);
      next = {
        ...state,
        navigation,
        wantTradeIn: true,
        topNavigation,
        tradeIn: state.tradeIn || {
          registrationNumber: '',
          mileage: '',
          description: '',
        },
      };
      return next;

    case SET_TRADE_IN:
      navigation = getNextNavigationState(state.navigation.stage, action.lastStage);
      topNavigation = getNextTopNavigationState(next.topNavigation, navigation);

      next = {
        ...state,
        navigation,
        topNavigation,
        wantTradeIn: !!action.tradeIn,
        tradeIn: action.tradeIn,
        tradeInVehicle: action.tradeInVehicle,
      };

      return next;

    case SET_FINANCIAL:
      navigation = getNextNavigationState(state.navigation.stage, action.lastStage);
      topNavigation = getNextTopNavigationState(next.topNavigation, navigation);
      return {
        ...next,
        navigation,
        topNavigation,
        paymentType: action.paymentType,
      };

    case SET_PAYMENT_LOOKUP_RESPONSE:
      return { ...next, paymentLookupResponse: action.paymentLookupResponse };

    case SET_DRIVING_DISTANCE:
      return { ...next, drivingDistance: action.drivingDistance };

    case COMPLETE_STAGE:
      navigation = getNextNavigationState(state.navigation.stage, action.lastStage);
      topNavigation = getNextTopNavigationState(next.topNavigation, navigation);

      next = {
        ...state,
        navigation,
        topNavigation,
      };

      return next;

    case SET_OR_REMOVE_INSURANCE:
      if (next.insurance !== action.insurance) {
        next.insurance = action.insurance;
      } else {
        next.insurance = undefined;
      }

      return next;

    case SET_OR_REMOVE_ACCESSORY:
      index = next.accessories.findIndex((accessory) => accessory.id === action.accessory.id);
      if (index > -1) {
        next.accessories.splice(index, 1);
      } else {
        next.accessories.push(action.accessory);
      }

      return { ...next, accessories: [...next.accessories] };

    case GO_TO:
      return {
        ...state,
        navigation: { view: action.view, stage: action.index || 1, subStage: action.subStage || 1 },
      };

    case SET_CREATED_ORDER_ID:
      next = {
        ...state,
        createdOrderId: action.id,
      };

      return next;

    case SET_CREDIT_ASSESSMENT_RESPONSE:
      return {
        ...next,
        caseId: action.caseId,
        creditAssessmentResponse: action.creditAssessmentResponse,
      };
    default:
      return state;
  }
};

export type RootState = ReturnType<typeof reducer>;

export default reducer;
