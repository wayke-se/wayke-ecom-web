import { creditAssessment, ICreditAssessmentInquiry } from '../sdk';

export const creditAssessmentNewCase = (inquiry: ICreditAssessmentInquiry) => {
  const request = creditAssessment.newCase(inquiry);
  return request;
};
