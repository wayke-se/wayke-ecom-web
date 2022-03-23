interface PaymentOrderCustomerAddress {
  city: string;
  co: string | null;
  coordinate: null;
  givenName: string;
  name: string;
  postalCode: string;
  street: string;
  surname: string;
}

interface PaymentOrderCustomer {
  address: PaymentOrderCustomerAddress;
  deliveryDistance: null;
  didVerifyWithBankId: boolean;
  email: string;
  givenName: string;
  name: string;
  phone: string;
  socialId: string;
  surname: string;
}

interface PaymentOrderAdVehicle {
  enginePower: number;
  fuelType: string;
  gearbox: string;
  manufactureYear: number;
  manufacturer: string;
  mileage: number;
  modelName: string;
  modelSeries: string;
  modelYear: number;
  vehicleType: string;
  vinNumber: string;
}

interface PaymentOrderAd {
  deductibleVat: boolean;
  id: string;
  image: string | null;
  leasingPrice: number | null;
  media: null;
  oldPrice: number | null;
  price: number;
  registrationNumber: string;
  shortDescription: string;
  status: string;
  title: string;
  vehicle: PaymentOrderAdVehicle;
  vehicleIdentificationNumber: string;
}

interface PaymentOrderAdvancePayment {
  required: boolean;
  paid: boolean;
}

interface PaymentOrderDelivery {
  deliveryTime: string;
  maxQuantity: null;
  minQuantity: null;
  startupCost: number;
  type: string;
  unit: null;
  unitPrice: null;
}

interface PaymenOrderOrigin {
  topic: string;
  channel: string;
}

interface PaymentOrderPaymentOption {
  creditAssessment: null;
  downPayment: null;
  externalId: null;
  months: null;
  residualValue: null;
  type: string;
}

interface PaymentOrderPayment {
  details: null;
  options: PaymentOrderPaymentOption;
}

export interface PaymentOrderResponse {
  accessories: null;
  ad: PaymentOrderAd;
  advancePayment: PaymentOrderAdvancePayment;
  branchId: string;
  conditions: string;
  created: string;
  customer: PaymentOrderCustomer;
  delivery: PaymentOrderDelivery;
  id: string;
  insurance: null;
  orderNumber: string;
  origin: PaymenOrderOrigin;
  payment: PaymentOrderPayment;
  returnConditions: string;
  status: string;
  statusUpdateSource: null;
  statusUpdated: string;
  tradeIn: null;
}
