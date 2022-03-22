import {
  IAccessory,
  IContactInformation,
  IDealerOption,
  IOrderVehicle,
  IDeliveryOption,
  IAvailableInsuranceOption,
  PaymentType,
} from '@wayke-se/ecom/dist-types/orders/types';
import { PaymentLookup } from './PaymentLookup';

export interface PaymentOption {
  loanDetails: PaymentLookup | undefined;
  logo: string | undefined;
  name: string | undefined;
  price: number | undefined;
  type: PaymentType;
  unit: string | undefined;
  externalId: string | undefined;
}

export interface OrderOptions {
  orderVehicle: IOrderVehicle;
  accessories: IAccessory[];
  requiresDealerSelection: boolean;
  dealerSites: IDealerOption[];
  paymentOptions: PaymentOption[];
  deliveryOptions: IDeliveryOption[];
  insuranceOption: IAvailableInsuranceOption | undefined;
  orderConditions: string | undefined;
  orderReturnConditions: string | undefined;
  conditionsPdfUri: string | null | undefined;
  contactInformation: IContactInformation | undefined;
  allowsTradeIn: boolean;
  isUnavailable: boolean;
  isPaymentRequired: boolean;
}
