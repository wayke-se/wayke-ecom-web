import { CreditAssessmentStatus } from './types';

const asStatus = (statusString: string) => {
  switch (statusString) {
    case 'received':
      return CreditAssessmentStatus.Received;
    case 'signingInitiated':
      return CreditAssessmentStatus.SigningInitiated;
    case 'signingFailed':
      return CreditAssessmentStatus.SigningFailed;
    case 'signed':
      return CreditAssessmentStatus.Signed;
    case 'scoringInitiated':
      return CreditAssessmentStatus.ScoringInitiated;
    case 'scored':
      return CreditAssessmentStatus.Scored;
    case 'notScored':
      return CreditAssessmentStatus.NotScored;
    case 'accepted':
      return CreditAssessmentStatus.Accepted;
    case 'declined':
      return CreditAssessmentStatus.Declined;
    default:
      return CreditAssessmentStatus.Unknown;
  }
};

export default asStatus;
