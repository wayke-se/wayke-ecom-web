import { PaymentLookupResponse } from '../payments/payment-lookup-response';
import {
  IAccessory,
  IAvailableInsuranceOption,
  IContactInformation,
  IDealerOption,
  IDeliveryOption,
  IOrderOptionsResponse,
  IOrderOptionsResponseData,
  IOrderVehicle,
  IPaymentOption,
} from './types';

export class OrderOptionsResponse implements IOrderOptionsResponse {
  private response: IOrderOptionsResponseData;

  public constructor(response: IOrderOptionsResponseData) {
    if (!response) {
      throw new Error('Missing order options response data');
    }

    this.response = response;
  }

  public getOrderVehicle(): IOrderVehicle {
    return this.response.vehicle;
  }

  public getAccessories(): IAccessory[] {
    if (!this.response.accessories || !this.response.accessories.length) {
      return [];
    }

    return this.response.accessories.map((accessory) => ({
      id: accessory.id,
      articleNumber: accessory.articleNumber,
      logoUrl: accessory.logoUrl,
      longDescription: accessory.longDescription,
      shortDescription: accessory.shortDescription,
      manufacturer: accessory.manufacturer,
      model: accessory.model,
      name: accessory.name,
      price: accessory.price,
      assemblyPrice: accessory.assemblyPrice,
      salePrice: accessory.salePrice,
      productPageLink: accessory.productPageLink,
      productPageLinkText: accessory.productPageLinkText,
      media: accessory.media
        ? accessory.media.map((m) => {
            return {
              externalId: m.externalId,
              sortOrder: m.sortOrder,
              url: m.url,
            };
          })
        : [],
    }));
  }

  public requiresDealerSelection(): boolean {
    return this.response.dealers && this.response.dealers.length > 1;
  }

  public getDealerSites(): IDealerOption[] {
    if (!this.response.dealers || !this.response.dealers.length) {
      return [];
    }

    return this.response.dealers;
  }

  public getPaymentOptions(): IPaymentOption[] {
    if (!this.response.payment || !this.response.payment.length) {
      return [];
    }

    return this.response.payment.map((payment) => ({
      loanDetails: payment.loanDetails ? new PaymentLookupResponse(payment.loanDetails) : undefined,
      logo: payment.logo,
      name: payment.name,
      price: payment.price,
      type: payment.type,
      unit: payment.unit,
      externalId: payment.externalId,
    }));
  }

  public getDeliveryOptions(): IDeliveryOption[] {
    if (!this.response.delivery || !this.response.delivery.length) {
      return [];
    }

    return this.response.delivery.map((delivery) => ({
      type: delivery.type,
      deliveryTime: delivery.deliveryTime,
      startupCost: delivery.startupCost,
      unitPrice: delivery.unitPrice,
      unit: delivery.unit,
      minQuantity: delivery.minQuantity,
      maxQuantity: delivery.maxQuantity,
    }));
  }

  public getInsuranceOption(): IAvailableInsuranceOption | undefined {
    return this.response.insurance
      ? {
          institute: this.response.insurance.institute,
          identifier: this.response.insurance.identifier,
          longDescription: this.response.insurance.longDescription,
          description: this.response.insurance.description,
          logo: this.response.insurance.logo,
          title: this.response.insurance.title,
          url: this.response.insurance.url,
          ecomInsuranceText: this.response.insurance.ecomInsuranceText,
          requiresDistance: this.response.insurance.requiresDistance,
          requiresPersonalNumber: this.response.insurance.requiresPersonalNumber,
        }
      : undefined;
  }

  public getOrderConditions(): string | undefined {
    return this.response.conditions;
  }

  public getOrderReturnConditions(): string | undefined {
    return this.response.returnConditions;
  }

  public getConditionsPdfUri(): string | null | undefined {
    return this.response.conditionsPdfUri;
  }

  public getContactInformation(): IContactInformation | undefined {
    return this.response.contactInformation;
  }

  public allowsTradeIn(): boolean {
    return this.response.tradeIn;
  }

  public isUnavailable() {
    return this.response.unavailable;
  }

  public isReserved() {
    return !!this.response.reserved;
  }

  public isPaymentRequired() {
    return this.response.paymentRequired;
  }
}
