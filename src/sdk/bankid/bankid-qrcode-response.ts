import { IBankIdQrCodeResponse, IBankIdQrCodeApiResponse } from './types';

export class BankIdQrCodeResponse implements IBankIdQrCodeResponse {
  private orderRef: string;
  private qrCodeAsBase64: string;

  public constructor(response: IBankIdQrCodeApiResponse) {
    if (!response) {
      throw new Error('Response can not be falsy');
    }

    if (!response.orderRef) {
      throw new Error('Response is missing an orderRef');
    }

    if (!response.qrCodeAsBase64) {
      throw new Error('Response is missing a QR code');
    }

    this.orderRef = response.orderRef;
    this.qrCodeAsBase64 = response.qrCodeAsBase64;
  }

  public getOrderRef() {
    return this.orderRef;
  }

  public getQrCode() {
    return this.qrCodeAsBase64;
  }
}
