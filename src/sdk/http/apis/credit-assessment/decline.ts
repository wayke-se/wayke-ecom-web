import * as http from '../../index';
import Configuration from '../../../config/index';

export const requestDeclineCase = (caseId: string): Promise<Response> => {
  const host = Configuration.current().getApiAddress();
  const url = `${host}/credit-assessment/${caseId}`;

  const forgeryToken = http.context().requestForgeryToken;

  const request = http.builder().method('delete').requestForgeryToken(forgeryToken).build();

  return http.raw(url, request);
};
