import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Customer } from '../@types/Customer';
import { Vehicle } from '../@types/Vehicle';
import { Action, PROCEED_TO_VIEW_2, SET_CONTACT_EMAIL_AND_PHONE, SET_VEHICLE } from './action';

interface ReducerState {
  view: number;
  stage: number;
  subStage: number;
  vehicle?: Vehicle;
  order?: OrderOptionsResponse;
  customer: Customer;
}

const initialState: ReducerState = {
  view: 1,
  stage: 1,
  subStage: 1,
  customer: {
    email: 'pete@mail.com',
    phone: '',
    givenName: '',
    surname: '',
    socialId: '',
  },
};

const reducer = (state = initialState, action: Action): ReducerState => {
  switch (action.type) {
    case SET_VEHICLE:
      return { ...state, vehicle: action.vehicle };
    case PROCEED_TO_VIEW_2:
      return { ...state, order: action.order, view: 2 };
    case SET_CONTACT_EMAIL_AND_PHONE:
      return {
        ...state,
        customer: { ...state.customer, email: action.value.email, phone: action.value.phone },
        subStage: 2,
      };
    default:
      return state;
  }
};

export type RootState = ReturnType<typeof reducer>;

export default reducer;
