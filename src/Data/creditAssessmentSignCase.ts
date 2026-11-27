import { creditAssessment, ICreditAssessmentSignRequest } from '../sdk';

export const creditAssessmentSignCase = (creditAssessmentCase: ICreditAssessmentSignRequest) => {
  const request = creditAssessment.signCase(creditAssessmentCase);
  return request;
};
