import { ICreditAssessmentInquiry, creditAssessment } from '@wayke-se/ecom';

export const creditAssessmentNewCase = (inquiry: ICreditAssessmentInquiry) => {
  const request = creditAssessment.newCase(inquiry);
  return request;
};
