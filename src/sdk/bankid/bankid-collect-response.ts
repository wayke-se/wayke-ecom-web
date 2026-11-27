import { IBankIdCollectResponse, AuthStatus, IBankIdCollectApiResponse } from './types';

import resolveMessage from './message-resolver';
import { IAddress } from '../customers/types';

export class BankIdCollectResponse implements IBankIdCollectResponse {
  static START_FAILED_CODE = 'startFailed';
  static USER_CANCEL_CODE = 'userCancel';

  private orderRef: string;
  private status: AuthStatus;
  private hintCode?: string;
  private message: string;
  private personalNumber?: string;
  private address?: IAddress;

  public constructor(response: IBankIdCollectApiResponse) {
    if (!response) {
      throw new Error('Response can not be falsy');
    }

    this.orderRef = response.orderRef;
    this.status = this.parseStatus(response.status);
    this.hintCode = response.hintCode;
    this.message = resolveMessage(response.hintCode);

    if (this.isCompleted() && !!response.completionData) {
      this.personalNumber = response.completionData.personalNumber;
      this.address = response.completionData.address;
    }
  }

  private parseStatus(status: string) {
    switch (status) {
      case 'pending':
        return AuthStatus.Pending;
      case 'complete':
        return AuthStatus.Complete;
      case 'failed':
        return AuthStatus.Failed;
      default:
        return AuthStatus.Unknown;
    }
  }

  getOrderRef() {
    return this.orderRef;
  }

  getStatus() {
    return this.status;
  }

  isPending() {
    return this.status === AuthStatus.Pending;
  }

  getHintCode() {
    return this.hintCode;
  }

  hasMessage() {
    return !!this.message;
  }

  getMessage() {
    return this.message;
  }

  shouldRenew() {
    return (
      this.hintCode === BankIdCollectResponse.START_FAILED_CODE ||
      this.hintCode === BankIdCollectResponse.USER_CANCEL_CODE
    );
  }

  isCompleted() {
    return this.status === AuthStatus.Complete;
  }

  getPersonalNumber() {
    return this.personalNumber;
  }

  getAddress() {
    return this.address;
  }
}
