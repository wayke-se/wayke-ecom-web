import { CreditAssessmentDecision } from './types';

const asDecision = (text?: string) => {
  switch (text) {
    case 'approved':
      return CreditAssessmentDecision.Approved;
    case 'rejected':
      return CreditAssessmentDecision.Rejected;
    default:
      return CreditAssessmentDecision.Unknown;
  }
};

export default asDecision;
