import { creditAssessment, ICreditAssessmentInquiry } from '@wayke-se/ecom';

export const creditAssessmentNewCase = (inquiry: ICreditAssessmentInquiry) => {
  const request = creditAssessment.newCase(inquiry);
  return request;
};
