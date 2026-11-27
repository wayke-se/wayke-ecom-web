import { CreditAssessmentRecommendation } from './types';

const asRecommendation = (text?: string) => {
  switch (text) {
    case 'approve':
      return CreditAssessmentRecommendation.Approve;
    case 'assessManually':
      return CreditAssessmentRecommendation.AssessManually;
    case 'reject':
      return CreditAssessmentRecommendation.Reject;
    default:
      return CreditAssessmentRecommendation.Unknown;
  }
};

export default asRecommendation;
