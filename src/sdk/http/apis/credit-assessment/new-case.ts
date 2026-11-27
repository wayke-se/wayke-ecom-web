import * as http from '../../index';
import { ICreditAssessmentCase, ICreditAssessmentInquiry } from '../../../credit-assessment/types';
import Configuration from '../../../config/index';

export const requestNewCase = (
  inquery: ICreditAssessmentInquiry
): Promise<http.IApiResponse<ICreditAssessmentCase>> => {
  const host = Configuration.current().getApiAddress();
  const url = `${host}/credit-assessment/v2`;

  const forgeryToken = http.context().requestForgeryToken;

  const request = http
    .builder()
    .method('post')
    .accept('application/json')
    .requestForgeryToken(forgeryToken)
    .content(inquery)
    .build();

  return http.captureStateContext(http.json<ICreditAssessmentCase>(url, request));
};
