import * as http from '../../index';
import Configuration from '../../../config/index';

export const requestAcceptCase = (caseId: string): Promise<Response> => {
  const host = Configuration.current().getApiAddress();
  const url = `${host}/credit-assessment/${caseId}/accept`;

  const forgeryToken = http.context().requestForgeryToken;

  const request = http.builder().method('put').requestForgeryToken(forgeryToken).build();

  return http.raw(url, request);
};
