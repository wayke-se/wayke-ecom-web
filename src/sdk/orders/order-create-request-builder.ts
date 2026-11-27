import { ICustomer } from '../customers/types';
import { IVehicleTrade } from '../vehicles/types';
import {
  DeliveryType,
  IAccessory,
  IOrderCreateRequest,
  IOrderInsuranceRequest,
  IOrderPaymentRequest,
} from './types';

export class OrderCreateRequestBuilder {
  public static validateRequest(request: IOrderCreateRequest) {
    if (!request) {
      throw new Error('Missing order creation request');
    }

    if (!request.id) {
      throw new Error('Missing vehicle ID in order creation request');
    }

    if (!request.customer) {
      throw new Error('Missing customer in order creation request');
    }

    if (!request.payment) {
      throw new Error('Missing payment in order creation request');
    }

    if (!request.deliveryType) {
      throw new Error('Missing delivery type in order creation request');
    }
  }

  private properties: { [key: string]: any } = {};
  public forVehicle(id: string): OrderCreateRequestBuilder {
    this.properties.id = id;

    return this;
  }

  public withAccessories(accessories: IAccessory[]): OrderCreateRequestBuilder {
    this.properties.accessories = accessories.map((a) => {
      return { id: a.id };
    });

    return this;
  }

  public withCustomer(customer: ICustomer): OrderCreateRequestBuilder {
    this.properties.customer = customer;

    return this;
  }

  public withPayment(payment: IOrderPaymentRequest): OrderCreateRequestBuilder {
    this.properties.payment = payment;

    return this;
  }

  public withDeliveryType(deliveryType: DeliveryType): OrderCreateRequestBuilder {
    this.properties.deliveryType = deliveryType;

    return this;
  }

  public withInsurance(insurance: IOrderInsuranceRequest): OrderCreateRequestBuilder {
    this.properties.insurance = insurance;

    return this;
  }

  public withTradeIn(tradein: IVehicleTrade): OrderCreateRequestBuilder {
    this.properties.tradein = tradein;

    return this;
  }

  public withUrls(redirect: string, payment: string): OrderCreateRequestBuilder {
    this.properties.urls = { redirect, payment };

    return this;
  }

  public build(): IOrderCreateRequest {
    return this.properties as IOrderCreateRequest;
  }
}
