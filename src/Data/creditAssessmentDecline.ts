import { creditAssessment } from '../sdk';

export const creditAssessmentDecline = (caseId: string) => {
  const request = creditAssessment.decline(caseId);
  return request;
};
