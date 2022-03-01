import { creditAssessment } from '@wayke-se/ecom';

export const creditAssessmentDecline = (caseId: string) => {
  const request = creditAssessment.decline(caseId);
  return request;
};
