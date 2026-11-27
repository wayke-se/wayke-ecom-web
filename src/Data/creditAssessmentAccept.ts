import { creditAssessment } from '../sdk';

export const creditAssessmentAccept = (caseId: string) => {
  const request = creditAssessment.accept(caseId);
  return request;
};
