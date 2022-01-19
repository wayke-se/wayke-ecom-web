import { IAddress, IVehicle } from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Customer } from '../@types/Customer';
import { TradeInCarDataPartial } from '../@types/TradeIn';
import { Vehicle } from '../@types/Vehicle';
import {
  Action,
  PROCEED_TO_VIEW_2_STAGE_1,
  SET_CONTACT_EMAIL_AND_PHONE,
  SET_ORDER,
  SET_VEHICLE,
  SET_SOCIAL_ID_AND_ADDRESS,
  EDIT_CUSTOMER,
  SET_HOME_DELIVERY,
  SET_TRADE_IN,
  EDIT_DELIVERY,
  SET_FINANCIAL,
  EDIT_FINANCIAL,
  EDIT_TRADE_IN,
  SET_INSURANCE,
  EDIT_INSURANCE,
  INIT_TRADE_IN,
} from './action';

interface Navigation {
  view: number;
  stage: number;
  subStage: number;
}

interface ReducerState {
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
  edit: {
    customer: boolean;
    delivery: boolean;
    tradeIn: boolean;
    financial: boolean;
    insurance: boolean;
  };
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
};

let next: ReducerState;
const reducer = (state = initialState, action: Action): ReducerState => {
  let navigation: Navigation;
  next = { ...state };
  switch (action.type) {
    case SET_VEHICLE:
      return { ...state, vehicle: action.vehicle };
    case SET_ORDER:
      return { ...state, order: action.order };
    case PROCEED_TO_VIEW_2_STAGE_1:
      return { ...state, navigation: { view: 2, stage: 1, subStage: 1 } };
    case SET_CONTACT_EMAIL_AND_PHONE:
      return {
        ...state,
        customer: { ...state.customer, email: action.value.email, phone: action.value.phone },
        navigation: { view: 2, stage: 1, subStage: 2 },
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
        navigation = { view: 2, stage: state.centralStorage ? 2 : 3, subStage: 1 };
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
        navigation = { view: 2, stage: 4, subStage: 1 };
        next = {
          ...state,
          navigation,
          topNavigation: navigation,
          homeDelivery: action.homeDelivery,
        };
      }
      return next;

    case INIT_TRADE_IN:
      navigation = { view: 2, stage: 4, subStage: 1 };
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
        navigation = { view: 2, stage: 5, subStage: 1 };
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
      if (next.edit.delivery) {
        next = {
          ...next,
          navigation: next.topNavigation,
          edit: {
            ...next.edit,
            financial: false,
          },
        };
      } else {
        navigation = { view: 2, stage: 6, subStage: 1 };
        next = {
          ...state,
          navigation,
          topNavigation: navigation,
        };
      }
      return next;

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

    case EDIT_CUSTOMER:
      return {
        ...state,
        navigation: { view: 2, stage: 1, subStage: 1 },
        edit: {
          ...state.edit,
          customer: true,
        },
      };

    case EDIT_DELIVERY:
      return {
        ...state,
        navigation: { view: 2, stage: 3, subStage: 1 },
        edit: {
          ...state.edit,
          delivery: true,
        },
      };

    case EDIT_TRADE_IN:
      return {
        ...state,
        wantTradeIn: undefined,
        navigation: { view: 2, stage: 4, subStage: 1 },
        edit: {
          ...state.edit,
          tradeIn: true,
        },
      };

    case EDIT_FINANCIAL:
      return {
        ...state,
        navigation: { view: 2, stage: 5, subStage: 1 },
        edit: {
          ...state.edit,
          financial: true,
        },
      };

    case EDIT_INSURANCE:
      return {
        ...state,
        navigation: { view: 2, stage: 6, subStage: 1 },
        edit: {
          ...state.edit,
          insurance: true,
        },
      };

    default:
      return state;
  }
};

export type RootState = ReturnType<typeof reducer>;

export default reducer;
