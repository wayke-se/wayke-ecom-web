import { IAddress, IVehicle, PaymentType } from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import { Customer } from '../@types/Customer';
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

const stateMock: any = {};
/*
try {
  stateMock = require('../../statemock.json');
} catch (e) {
  stateMock = {};
}
*/

interface Navigation {
  view: number;
  stage: number;
  subStage: number;
}

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
  date: Date;
  stages?: StageTypes[];
}

const initialState: ReducerState = {
  topNavigation: {
    view: 1,
    stage: 1,
    subStage: 1,
  },
  navigation: {
    view: 1,
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
  date: new Date(),
};

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
      return { ...state, order: action.order };
    case PROCEED_TO_VIEW_2_STAGE_1:
      return {
        ...state,
        navigation: { view: 2, stage: 1, subStage: 1 },
        ...stateMock,
        order: state.order,
      };
    case SET_CONTACT_EMAIL_AND_PHONE:
      return {
        ...state,
        customer: { ...state.customer, email: action.value.email, phone: action.value.phone },
        navigation: { view: 2, stage: state.navigation.stage, subStage: 2 },
      };
    case SET_SOCIAL_ID_AND_ADDRESS:
      if (next.edit.customer) {
        next = {
          ...next,
          navigation: next.topNavigation,
          address: action.address,
          customer: { ...state.customer, socialId: action.socialId },
          edit: {
            ...next.edit,
            customer: false,
          },
        };
      } else {
        if (action.lastStage) {
          navigation = { view: 3, stage: 1, subStage: 1 };
        } else {
          navigation = { view: 2, stage: state.navigation.stage + 1, subStage: 1 };
        }

        next = {
          ...state,
          navigation,
          topNavigation: navigation,
          address: action.address,
          customer: { ...state.customer, socialId: action.socialId },
        };
      }
      return next;
    case SET_HOME_DELIVERY:
      if (next.edit.delivery) {
        next = {
          ...next,
          navigation: next.topNavigation,
          homeDelivery: action.homeDelivery,
          edit: {
            ...next.edit,
            delivery: false,
          },
        };
      } else {
        navigation = { view: 2, stage: state.navigation.stage + 1, subStage: 1 };
        next = {
          ...state,
          navigation,
          topNavigation: navigation,
          homeDelivery: action.homeDelivery,
        };
      }
      return next;

    case INIT_TRADE_IN:
      navigation = { view: 2, stage: state.navigation.stage, subStage: 1 };
      next = {
        ...state,
        navigation,
        wantTradeIn: true,
        topNavigation: navigation,
        tradeIn: state.tradeIn || {
          registrationNumber: '',
          mileage: '',
          description: '',
        },
      };
      return next;

    case SET_TRADE_IN:
      if (next.edit.delivery) {
        next = {
          ...next,
          navigation: next.topNavigation,
          edit: {
            ...next.edit,
            tradeIn: false,
          },
          tradeIn: action.tradeIn,
        };
      } else {
        navigation = { view: 2, stage: state.navigation.stage + 1, subStage: 1 };
        next = {
          ...state,
          navigation,
          topNavigation: navigation,
          wantTradeIn: !!action.tradeIn,
          tradeIn: action.tradeIn,
          tradeInVehicle: action.tradeInVehicle,
        };
      }

      return next;

    case SET_FINANCIAL:
      if (action.lastStage) {
        navigation = { view: 3, stage: 1, subStage: 1 };
      } else if (next.edit.delivery) {
        next = {
          ...next,
          navigation: next.topNavigation,
          paymentType: action.paymentType,
          edit: {
            ...next.edit,
            financial: false,
          },
        };
      } else {
        navigation = { view: 2, stage: state.navigation.stage + 1, subStage: 1 };
        next = {
          ...state,
          navigation,
          topNavigation: navigation,
        };
      }
      return next;

    case SET_PAYMENT_LOOKUP_RESPONSE:
      return { ...next, paymentLookupResponse: action.paymentLookupResponse };

    case SET_INSURANCE:
      if (next.edit.delivery) {
        next = {
          ...next,
          navigation: next.topNavigation,
          edit: {
            ...next.edit,
            insurance: false,
          },
        };
      } else {
        navigation = { view: 3, stage: 1, subStage: 1 };
        next = {
          ...state,
          navigation,
          topNavigation: navigation,
        };
      }
      return next;

    case EDIT:
      return {
        ...state,
        navigation: { view: 2, stage: action.index, subStage: 1 },
      };

    default:
      return state;
  }
};

export type RootState = ReturnType<typeof reducer>;

export default reducer;
