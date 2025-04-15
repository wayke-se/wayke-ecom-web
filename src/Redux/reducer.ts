import {
  DrivingDistance,
  IAddress,
  IAvailableInsuranceOption,
  IInsuranceOption,
  IVehicle,
  PaymentType,
} from '@wayke-se/ecom';
import { IAccessory, IOrderVehicle } from '@wayke-se/ecom/dist-types/orders/types';
import { ICreditAssessmentStatus } from '../@types/CreditAssessmentStatus';
import { Customer } from '../@types/Customer';
import { Insurance } from '../@types/Insurance';
import { Navigation } from '../@types/Navigation';
import { OrderOptions, PaymentOption } from '../@types/OrderOptions';
import { PaymentLookup } from '../@types/PaymentLookup';
import { StageTypes } from '../@types/Stages';
import { TradeInCarDataPartial } from '../@types/TradeIn';
import { isSame } from '../Utils/compare';
import {
  Action,
  COMPLETE_STAGE,
  GO_TO,
  INIT_TRADE_IN,
  RESET,
  RESET_PAYMENT_LOOKUP_RESPONSE,
  SET_ADDRESS,
  SET_CONTACT_EMAIL_AND_PHONE,
  SET_CREATED_ORDER_ID,
  SET_CREDIT_ASSESSMENT_RESPONSE,
  SET_DEALER,
  SET_DRIVING_DISTANCE,
  SET_FINANCIAL,
  SET_HOME_DELIVERY,
  SET_ID,
  SET_ORDER,
  SET_OR_REMOVE_ACCESSORY,
  SET_OR_REMOVE_FREE_INSURANCE,
  SET_OR_REMOVE_INSURANCE,
  SET_OR_REMOVE_INSURANCE_ADDONS,
  SET_PAYMENT_LOOKUP_RESPONSE,
  SET_SOCIAL_ID_AND_ADDRESS,
  SET_STAGES,
  SET_STATE,
  SET_TRADE_IN,
} from './action';

let mock = {};
try {
  //mock = require('../../statemock.json');
} catch (_e) {
  mock = {};
}

export interface ReducerState {
  id: string;
  topNavigation: Navigation;
  navigation: Navigation;
  vehicle?: IOrderVehicle;
  order?: OrderOptions;
  customer: Customer;
  address?: IAddress;
  homeDelivery: boolean;
  wantTradeIn?: boolean;
  tradeIn?: TradeInCarDataPartial;
  tradeInVehicle?: IVehicle;
  paymentType?: PaymentType;
  paymentLookupResponse?: PaymentLookup;
  stages?: StageTypes[];
  accessories: IAccessory[];
  drivingDistance: DrivingDistance;
  insurance?: IInsuranceOption;
  insuranceAddOns?: Insurance;
  freeInsurance?: IAvailableInsuranceOption;
  createdOrderId?: string | null;
  creditAssessmentResponse?: ICreditAssessmentStatus;
  caseId?: string;
  dealer?: string;
  payment?: { type: string; url: string };
  stateLoadedFromSession?: boolean;
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
    email: '',
    phone: '',
    givenName: '',
    surname: '',
    socialId: '',
  },
  homeDelivery: false,
  accessories: [],
  drivingDistance: DrivingDistance.Between0And1000,
  ...mock,
};

const getNextNavigationState = (currentStage: number, lastStage: boolean): Navigation =>
  lastStage
    ? { view: 'summary', stage: 1, subStage: 1 }
    : { view: 'main', stage: currentStage + 1, subStage: 1 };

const getNextTopNavigationState = (currentTopNavigation: Navigation, nextNavigation: Navigation) =>
  nextNavigation.view === 'main'
    ? currentTopNavigation.stage < nextNavigation.stage
      ? nextNavigation
      : next.topNavigation
    : { ...currentTopNavigation, stage: currentTopNavigation.stage + 1 }; // all stages are completed

const resolveDefaultPaymentOption = (paymentOptions?: PaymentOption[]) => {
  if (!paymentOptions) return undefined;
  // If only cash payment is available, pre select
  const paymentType =
    paymentOptions?.length === 1 && paymentOptions?.[0].type === PaymentType.Cash
      ? PaymentType.Cash
      : undefined;
  return paymentType;
};

let next: ReducerState;
let index: number;
const reducer = (state = initialState, action: Action): ReducerState => {
  let navigation: Navigation;
  let topNavigation: Navigation;
  next = { ...state };

  switch (action.type) {
    case RESET:
      return { ...initialState, id: action.id };
    case SET_STAGES:
      return { ...next, stages: action.stages };
    case SET_ID:
      return { ...next, id: action.id };
    case SET_ORDER:
      return {
        ...state,
        order: action.order,
        paymentType: resolveDefaultPaymentOption(action.order?.paymentOptions),
        vehicle: { ...action.order.orderVehicle, ...(action.vehicle || {}) },
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
      clean.paymentType = resolveDefaultPaymentOption(state.order?.paymentOptions);
      delete clean.paymentLookupResponse;
      delete clean.insurance;
      delete clean.insuranceAddOns;
      delete clean.freeInsurance;
      delete clean.dealer;
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
    case SET_ADDRESS:
      navigation = getNextNavigationState(next.navigation.stage, action.lastStage);
      topNavigation = getNextTopNavigationState(next.topNavigation, navigation);

      next = {
        ...state,
        navigation,
        topNavigation,
        address: action.address,
        customer: { ...state.customer },
      };

      return next;

    case SET_DEALER:
      navigation = getNextNavigationState(state.navigation.stage, action.lastStage);
      topNavigation = { ...navigation }; // reset current stage

      next = {
        ...state,
        navigation,
        topNavigation,
        dealer: action.dealer,
      };

      delete next.wantTradeIn;
      delete next.tradeIn;
      delete next.tradeInVehicle;
      next.paymentType = resolveDefaultPaymentOption(state.order?.paymentOptions);
      delete next.paymentLookupResponse;
      delete next.insurance;
      delete next.insuranceAddOns;
      delete next.freeInsurance;
      next.accessories = [];

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

    case RESET_PAYMENT_LOOKUP_RESPONSE:
      return { ...next, paymentLookupResponse: undefined };

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

    case SET_OR_REMOVE_INSURANCE_ADDONS:
      next.insurance = action.insurance;
      next.insuranceAddOns = {
        insurance: action.insurance.name,
        addOns: action.insuranceAddons,
      };
      return next;

    case SET_OR_REMOVE_INSURANCE:
      if (!isSame(next.insurance, action.insurance)) {
        next.insurance = action.insurance;
      } else {
        next.insurance = undefined;
      }

      if (next.insuranceAddOns?.insurance) {
        next.insuranceAddOns = undefined;
      }

      return next;

    case SET_OR_REMOVE_FREE_INSURANCE:
      if (!isSame(next.freeInsurance, action.freeInsurance)) {
        next.freeInsurance = action.freeInsurance;
      } else {
        next.freeInsurance = undefined;
      }

      return next;

    case SET_OR_REMOVE_ACCESSORY:
      index = next.accessories.findIndex((accessory) => accessory.id === action.accessory.id);
      next.accessories = [...next.accessories];

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
      if (action.payment) {
        navigation = { view: 'main', stage: state.navigation.stage, subStage: 2 };
      } else {
        navigation = getNextNavigationState(state.navigation.stage, true);
      }
      topNavigation = getNextTopNavigationState(next.topNavigation, navigation);

      next = {
        ...state,
        navigation,
        topNavigation,
        createdOrderId: action.id,
        payment: action.payment,
      };

      return next;

    case SET_CREDIT_ASSESSMENT_RESPONSE:
      return {
        ...next,
        caseId: action.caseId,
        creditAssessmentResponse: action.creditAssessmentResponse,
      };

    case SET_STATE:
      return { ...action.state };
    default:
      return state;
  }
};

export type RootState = ReturnType<typeof reducer>;

export default reducer;
