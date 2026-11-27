import {
  ICreditAssessmentCase,
  ICreditAssessmentInquiry,
  ICreditAssessmentSignApiResponse,
  ICreditAssessmentSignRequest,
  ICreditAssessmentStatusApiResponse,
} from '../../credit-assessment/types';
import * as http from '../index';
import { requestCaseStatus } from './credit-assessment/get-status';
import { requestNewCase } from './credit-assessment/new-case';
import { requestSignCase } from './credit-assessment/sign';
import { requestCancelSignCase } from './credit-assessment/cancel-sign';
import { requestDeclineCase } from './credit-assessment/decline';
import { requestAcceptCase } from './credit-assessment/accept';

const validate = <T>(response: http.IApiResponse<T>): T => {
  if (!response || !response.successful || !response.response) {
    throw new Error('The request did not succeed');
  }

  return response.response;
};

export const newCase = (inquiry: ICreditAssessmentInquiry): Promise<ICreditAssessmentCase> =>
  requestNewCase(inquiry).then(validate);

export const getStatus = (caseId: string): Promise<ICreditAssessmentStatusApiResponse> =>
  requestCaseStatus(caseId).then(validate);

export const signCase = (
  request: ICreditAssessmentSignRequest
): Promise<ICreditAssessmentSignApiResponse> => requestSignCase(request).then(validate);

export const cancelSigning = (caseId: string): Promise<boolean> =>
  requestCancelSignCase(caseId).then(() => true);

export const decline = (caseId: string): Promise<boolean> =>
  requestDeclineCase(caseId).then(() => true);

export const accept = (caseId: string): Promise<boolean> =>
  requestAcceptCase(caseId).then(() => true);
