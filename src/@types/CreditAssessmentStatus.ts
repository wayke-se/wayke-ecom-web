import {
  CreditAssessmentDecision,
  CreditAssessmentRecommendation,
  CreditAssessmentStatus,
  IAddress,
} from '@wayke-se/ecom';

export interface ICreditAssessmentStatus {
  status: CreditAssessmentStatus;
  hasPendingSigning: boolean;
  hintCode: string | undefined;
  signingMessage: string;
  shouldRenewSigning: boolean;
  isSigned: boolean;
  address: IAddress | undefined;
  pendingScoring: boolean;
  isScored: boolean;
  hasScoringError: boolean;
  scoringId: string | undefined;
  recommendation: CreditAssessmentRecommendation;
  decision: CreditAssessmentDecision;
  isAccepted: boolean;
}
