import { creditAssessment } from '../sdk';

export const creditAssessmentCancelSigning = (caseId: string) => {
  const request = creditAssessment.cancelSigning(caseId);
  return request;
};
