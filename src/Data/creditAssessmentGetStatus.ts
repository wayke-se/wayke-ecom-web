import { creditAssessment } from '@wayke-se/ecom';

export const creditAssessmentGetStatus = (caseId: string) => {
  const request = creditAssessment.getStatus(caseId);
  return request;
};
