import { ICreditAssessmentSignRequest, creditAssessment } from '@wayke-se/ecom';

export const creditAssessmentSignCase = (creditAssessmentCase: ICreditAssessmentSignRequest) => {
  const request = creditAssessment.signCase(creditAssessmentCase);
  return request;
};
