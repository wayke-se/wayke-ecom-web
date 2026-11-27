import { AuthMethod } from '../bankid/types';
import {
  ICreditAssessmentSignApiResponse,
  ICreditAssessmentSignRequest,
  ICreditAssessmentSignResponse,
} from './types';

export class CreditAssessmentSignResponse implements ICreditAssessmentSignResponse {
  private qrCodeAsBase64: string | undefined;
  private autoLaunchUrl: string | undefined;
  private method: AuthMethod;
  private caseId: string;

  public constructor(
    response: ICreditAssessmentSignApiResponse,
    request: ICreditAssessmentSignRequest
  ) {
    if (!response) {
      throw new Error('Response can not be falsy');
    }

    if (!request.method) {
      throw new Error('Method can not be falsy');
    }

    this.qrCodeAsBase64 = response.qrCodeAsBase64;
    this.autoLaunchUrl = response.autoLaunchUrl;
    this.method = request.method;
    this.caseId = request.caseId;
  }

  public getMethod() {
    return this.method;
  }

  public isQrCode() {
    return this.method === AuthMethod.QrCode;
  }

  public isSameDevice() {
    return this.method === AuthMethod.SameDevice;
  }

  public getQrCode() {
    if (!this.isQrCode()) {
      throw new Error('Not qr code response');
    }

    return this.qrCodeAsBase64;
  }

  public getAutoLaunchUrl() {
    if (!this.isSameDevice()) {
      throw new Error('Not same device response');
    }

    return this.autoLaunchUrl;
  }

  public getCaseId() {
    return this.caseId;
  }
}
