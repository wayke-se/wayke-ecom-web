import { IAddress, ICustomer } from '../customers/types';
import { DrivingDistance } from '../insurances/types';
import { PaymentLookupResponse } from '../payments/payment-lookup-response';
import { IPaymentLookupResponseData } from '../payments/types';
import { IVehicleTrade } from '../vehicles/types';

export interface IOrderCreateRequest {
  id: string;
  tradein: IVehicleTrade | undefined;
  insurance: IOrderInsuranceRequest | undefined;
  payment: IOrderPaymentRequest;
  deliveryType: DeliveryType;
  customer: ICustomer;
  accessories: IAccessoryRequest[] | undefined;
  urls: IOrderUrls | undefined;
}

export interface IOrderCreateResponse {
  getId(): string;
  getPayment(): IPaymentResponse;
  getOrderNumber(): string | null | undefined;
}

export interface IOrderCreateResponseData {
  id: string;
  payment: IPaymentResponse;
  orderNumber?: string | null;
}

export interface IOrderOptionsRequest {
  id: string;
  branchId?: string;
}

export interface IOrderOptionsResponse {
  requiresDealerSelection(): boolean;
  getOrderVehicle(): IOrderVehicle;
  getAccessories(): IAccessory[];
  getDealerSites(): IDealerOption[];
  getPaymentOptions(): IPaymentOption[];
  getDeliveryOptions(): IDeliveryOption[];
  getInsuranceOption(): IAvailableInsuranceOption | undefined;
  getOrderConditions(): string | undefined;
  getOrderReturnConditions(): string | undefined;
  getConditionsPdfUri(): string | null | undefined;
  getContactInformation(): IContactInformation | undefined;
  allowsTradeIn(): boolean;
  isUnavailable(): boolean;
  isReserved(): boolean;
}

export interface IOrderInsuranceRequest {
  personalNumber?: string;
  drivingDistance: DrivingDistance;
  addons: string[] | undefined;
}

export interface IOrderCreditAssessment {
  scoreId: string;
  financialProductCode: string;
  recommendation: string;
  decision: string;
}

export interface IOrderPaymentRequest {
  type: PaymentType;
  months: number;
  downPayment: number;
  residualValue: number | undefined;
  externalId?: string;
  creditAssessment?: IOrderCreditAssessment;
}

export interface IOrderOptionsResponseData {
  accessories: IAccessory[];
  vehicle: IOrderVehicle;
  dealers: IDealerOption[];
  conditions: string | undefined;
  returnConditions: string | undefined;
  conditionsPdfUri: string | null | undefined;
  contactInformation: IContactInformation | undefined;
  delivery: IDeliveryOption[];
  insurance: IAvailableInsuranceOption | undefined;
  payment: IPaymentOptionResponseData[];
  tradeIn: boolean;
  unavailable: boolean;
  reserved?: boolean;
  paymentRequired: boolean;
}

export interface IOrderVehicle {
  title: string;
  shortDescription: string;
  price: number;
  imageUrls: string[];
  mileage: number;
  modelYear: number;
  fuelType: string;
  gearbox: string;
}

export interface IAccessory {
  id: string;
  articleNumber: string;
  logoUrl: string;
  longDescription: string;
  shortDescription: string;
  manufacturer: string;
  model: string;
  name: string;
  price: number;
  assemblyPrice: number | undefined;
  salePrice: number | undefined;
  productPageLink: string | undefined;
  productPageLinkText: string | undefined;
  media: IAccessoryMedia[];
}

export interface IOrderUrls {
  redirect: string;
  payment: string;
}

export interface IAccessoryMedia {
  externalId: string;
  sortOrder: number;
  url: string;
}

export interface IAccessoryRequest {
  id: string;
}

export interface IDealerOption {
  id: string;
  name: string;
  location: ILocation | undefined;
}

export interface ILocation {
  address: string | undefined;
  city: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
}

export interface IOrderCustomer {
  personalNumber: string;
  email: string;
  phoneNumber: string;
  name: string;
  address: IAddress;
}

export enum DeliveryType {
  None = 'None',
  Pickup = 'Pickup',
  Delivery = 'Delivery',
}
export interface IDeliveryOption {
  type: DeliveryType;
  deliveryTime: string;
  startupCost: number;
  unitPrice?: number;
  unit?: string;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface IAvailableInsuranceOption {
  institute: string;
  identifier: string | undefined;
  description: string | undefined;
  longDescription: string | undefined;
  logo: string | undefined;
  title: string;
  url: string | undefined;
  ecomInsuranceText: string | undefined;
  requiresPersonalNumber: boolean;
  requiresDistance: boolean;
}

export enum PaymentType {
  Cash = 'Cash',
  Lease = 'Lease',
  Loan = 'Loan',
}

export interface IPaymentOptionResponseData {
  loanDetails: IPaymentLookupResponseData | undefined;
  logo: string | undefined;
  name: string | undefined;
  price: number | undefined;
  type: PaymentType;
  unit: string | undefined;
  externalId: string | undefined;
}

export interface IPaymentOption {
  loanDetails: PaymentLookupResponse | undefined;
  logo: string | undefined;
  name: string | undefined;
  price: number | undefined;
  type: PaymentType;
  unit: string | undefined;
  externalId: string | undefined;
}

export interface IContactInformation {
  address: string | undefined;
  city: string | undefined;
  email: string | undefined;
  homePage: string | undefined;
  name: string | undefined;
  phone: string | undefined;
  zip: string | undefined;
}

export interface IPaymentResponse {
  type: string;
  url: string;
}
