import { AuthMethod } from '../../../bankid/types';
import * as http from '../../index';
import Configuration from '../../../config/index';
import {
  ICreditAssessmentSignApiResponse,
  ICreditAssessmentSignRequest,
} from '../../../credit-assessment/types';

const getRoute = (method: AuthMethod) => {
  switch (method) {
    case AuthMethod.QrCode:
      return '/qr-code';
    case AuthMethod.SameDevice:
      return '/same-device';
    default:
      throw new Error('BankId auth method not supported');
  }
};

export const getUrl = (requestOptions: ICreditAssessmentSignRequest) => {
  const route = getRoute(requestOptions.method);
  const host = Configuration.current().getApiAddress();
  const url = `${host}/credit-assessment/sign/${requestOptions.caseId}${route}`;
  return url;
};

export const requestSignCase = (
  requestOptions: ICreditAssessmentSignRequest
): Promise<http.IApiResponse<ICreditAssessmentSignApiResponse>> => {
  const url = getUrl(requestOptions);
  const forgeryToken = http.context().requestForgeryToken;

  const request = http
    .builder()
    .method('post')
    .accept('application/json')
    .requestForgeryToken(forgeryToken)
    .build();

  return http.captureStateContext(http.json<ICreditAssessmentSignApiResponse>(url, request));
};
