import { IAddress } from '..';
import {
  CreditAssessmentDecision,
  CreditAssessmentRecommendation,
  CreditAssessmentStatus,
  ICreditAssessmentStatusApiResponse,
  ICreditAssessmentStatusResponse,
} from './types';
import asStatus from './convert-status';
import resolveMessage from '../bankid/message-resolver';
import asDecision from './convert-decision';
import asRecommendation from './convert-recommendation';

export class CreditAssessmentStatusResponse implements ICreditAssessmentStatusResponse {
  static START_FAILED_CODE = 'startFailed';
  static USER_CANCEL_CODE = 'userCancel';

  private status: CreditAssessmentStatus;
  private hintCode: string | undefined;
  private signingMessage: string;
  private vfScoreCaseId: string | undefined;
  private recommendation: CreditAssessmentRecommendation;
  private decision: CreditAssessmentDecision;
  private qrCode: string | undefined;

  constructor(response: ICreditAssessmentStatusApiResponse) {
    this.hintCode = response.bankIdHintCode;
    this.vfScoreCaseId = response.vfScoreCaseId;

    this.signingMessage = resolveMessage(response.bankIdHintCode);

    this.status = asStatus(response.status);
    this.decision = asDecision(response.decision);
    this.recommendation = asRecommendation(response.recommendation);
    this.qrCode = response.qrCode;
  }

  getSigningMessage() {
    return this.signingMessage;
  }

  shouldRenewSigning() {
    const hasFailedSigning = this.status === CreditAssessmentStatus.SigningFailed;
    const isRenewHintCode =
      this.hintCode === CreditAssessmentStatusResponse.START_FAILED_CODE ||
      this.hintCode === CreditAssessmentStatusResponse.USER_CANCEL_CODE;
    return hasFailedSigning && isRenewHintCode;
  }

  isSigned() {
    return (
      this.status === CreditAssessmentStatus.Signed ||
      this.status === CreditAssessmentStatus.ScoringInitiated ||
      this.status === CreditAssessmentStatus.Scored ||
      this.status === CreditAssessmentStatus.NotScored ||
      this.status === CreditAssessmentStatus.Accepted
    );
  }

  getAddress(): IAddress | undefined {
    throw new Error('Method not implemented.');
  }

  getStatus() {
    return this.status;
  }

  hasPendingSigning() {
    return this.status === CreditAssessmentStatus.SigningInitiated;
  }

  getHintCode() {
    return this.hintCode;
  }

  hasPendingScoring() {
    return (
      this.status === CreditAssessmentStatus.Signed ||
      this.status === CreditAssessmentStatus.ScoringInitiated
    );
  }

  isScored() {
    return (
      this.status === CreditAssessmentStatus.Scored ||
      this.status === CreditAssessmentStatus.Accepted
    );
  }

  hasScoringError() {
    return this.status === CreditAssessmentStatus.NotScored;
  }

  getScoringId() {
    return this.vfScoreCaseId;
  }

  getRecommendation() {
    return this.recommendation;
  }

  getDecision() {
    return this.decision;
  }

  getQrCode() {
    return this.qrCode;
  }

  isAccepted() {
    return this.status === CreditAssessmentStatus.Accepted;
  }
}
