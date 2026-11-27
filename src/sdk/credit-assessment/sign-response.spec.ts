import * as fixtures from '../../test/fixtures';
const fixture = (name: string, withValues: any = undefined): any =>
  fixtures.create(name, withValues);

import { AuthMethod } from '../bankid/types';
import { CreditAssessmentSignResponse } from './sign-response';
import { ICreditAssessmentSignRequest } from './types';

describe('Create credit assessment sign response', () => {
  describe('Given same device method', () => {
    it('Should be same device response', () => {
      const request = fixture(
        'ICreditAssessmentSignRequest',
        (req: ICreditAssessmentSignRequest) => {
          req.method = AuthMethod.SameDevice;
          return req;
        }
      );
      const apiResponse = fixture('ICreditAssessmentSignApiResponse');

      const response = new CreditAssessmentSignResponse(apiResponse, request);

      expect(response.isSameDevice()).toBe(true);
      expect(response.isQrCode()).toBe(false);
    });
  });

  describe('Given qr code method', () => {
    it('Should be qr code response', () => {
      const request = fixture(
        'ICreditAssessmentSignRequest',
        (req: ICreditAssessmentSignRequest) => {
          req.method = AuthMethod.QrCode;
          return req;
        }
      );
      const apiResponse = fixture('ICreditAssessmentSignApiResponse');

      const response = new CreditAssessmentSignResponse(apiResponse, request);

      expect(response.isQrCode()).toBe(true);
      expect(response.isSameDevice()).toBe(false);
    });
  });

  it('Should have case id', () => {
    const request = fixture('ICreditAssessmentSignRequest');
    const apiResponse = fixture('ICreditAssessmentSignApiResponse');

    const response = new CreditAssessmentSignResponse(apiResponse, request);

    expect(response.getCaseId()).toBe(request.caseId);
  });
});
