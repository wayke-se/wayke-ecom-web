import { IAddress } from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Customer } from '../@types/Customer';
import { Vehicle } from '../@types/Vehicle';
import {
  Action,
  PROCEED_TO_VIEW_2_STAGE_1,
  SET_CONTACT_EMAIL_AND_PHONE,
  SET_VEHICLE,
  SET_SOCIAL_ID_AND_ADDRESS,
  RESTART_CONTACT,
} from './action';

interface ReducerState {
  view: number;
  stage: number;
  subStage: number;
  vehicle?: Vehicle;
  order?: OrderOptionsResponse;
  customer: Customer;
  address?: IAddress;
  homeDelivery: boolean;
}

const initialState: ReducerState = {
  view: 1,
  stage: 1,
  subStage: 1,
  customer: {
    email: '',
    phone: '',
    givenName: '',
    surname: '',
    socialId: '',
  },
  homeDelivery: false,
};

const reducer = (state = initialState, action: Action): ReducerState => {
  switch (action.type) {
    case SET_VEHICLE:
      return { ...state, vehicle: action.vehicle };
    case PROCEED_TO_VIEW_2_STAGE_1:
      return { ...state, order: action.order, view: 2 };
    case SET_CONTACT_EMAIL_AND_PHONE:
      return {
        ...state,
        customer: { ...state.customer, email: action.value.email, phone: action.value.phone },
        subStage: 2,
      };
    case SET_SOCIAL_ID_AND_ADDRESS:
      return {
        ...state,
        customer: { ...state.customer, socialId: action.socialId },
        address: action.address,
        view: 2,
        stage: 2,
        subStage: 1,
      };

    case RESTART_CONTACT:
      return {
        ...state,
        view: 2,
        stage: 1,
        subStage: 1,
      };
    default:
      return state;
  }
};

export type RootState = ReturnType<typeof reducer>;

export default reducer;
