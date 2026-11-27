import { creditAssessment } from '../sdk';

export const creditAssessmentGetStatus = (caseId: string) => {
  const request = creditAssessment.getStatus(caseId);
  return request;
};
