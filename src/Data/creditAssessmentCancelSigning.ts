import { creditAssessment } from '@wayke-se/ecom';

export const creditAssessmentCancelSigning = (caseId: string) => {
  const request = creditAssessment.cancelSigning(caseId);
  return request;
};
