import { creditAssessment } from '@wayke-se/ecom';

export const creditAssessmentAccept = (caseId: string) => {
  const request = creditAssessment.accept(caseId);
  return request;
};
