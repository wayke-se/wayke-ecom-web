const fixtures = require('../../test/fixtures');
const fixture = (name: string, withValues: any = undefined): any =>
  fixtures.create(name, withValues);

import { CreditAssessmentStatusResponse } from './status-response';
import {
  CreditAssessmentStatus,
  ICreditAssessmentStatusApiResponse,
  ICreditAssessmentStatusResponse,
} from './types';
import * as convertStatusMock from './convert-status';
import * as messageResolverMock from '../bankid/message-resolver';

describe('Create credit assessment status response', () => {
  describe('Given any status', () => {
    let apiResponse: ICreditAssessmentStatusApiResponse;
    let response: ICreditAssessmentStatusResponse;

    beforeAll(() => {
      apiResponse = fixture('ICreditAssessmentStatusApiResponse');
      response = new CreditAssessmentStatusResponse(apiResponse);
    });

    it('Should have provided scoring id', () => {
      expect(response.getScoringId()).toBe(apiResponse.vfScoreCaseId);
    });

    it('Should have provided hint code', () => {
      expect(response.getHintCode()).toBe(apiResponse.bankIdHintCode);
    });
  });

  describe('Given received status', () => {
    let asStatusMock: any;
    let response: ICreditAssessmentStatusResponse;

    beforeAll(() => {
      asStatusMock = jest.spyOn(convertStatusMock, 'default');
      asStatusMock.mockReturnValue(CreditAssessmentStatus.Received);

      const apiResponse = fixture('ICreditAssessmentStatusApiResponse');
      response = new CreditAssessmentStatusResponse(apiResponse);
    });

    it('Should have matching status', () => {
      expect(response.getStatus()).toBe(CreditAssessmentStatus.Received);
    });

    it('Should not renew signing', () => {
      expect(response.shouldRenewSigning()).toBe(false);
    });

    it('Is not signed', () => {
      expect(response.isSigned()).toBe(false);
    });

    it('Should not have pending signing', () => {
      expect(response.hasPendingSigning()).toBe(false);
    });

    it('Should not have pending scoring', () => {
      expect(response.hasPendingScoring()).toBe(false);
    });

    it('Should not be scored', () => {
      expect(response.isScored()).toBe(false);
    });

    it('Should not have scoring error', () => {
      expect(response.hasScoringError()).toBe(false);
    });

    afterAll(() => {
      asStatusMock.mockClear();
    });
  });

  describe('Given signing initiated', () => {
    let asStatusMock: any;
    let response: ICreditAssessmentStatusResponse;

    beforeAll(() => {
      asStatusMock = jest.spyOn(convertStatusMock, 'default');
      asStatusMock.mockReturnValue(CreditAssessmentStatus.SigningInitiated);

      const apiResponse = fixture('ICreditAssessmentStatusApiResponse');
      response = new CreditAssessmentStatusResponse(apiResponse);
    });

    it('Should have matching status', () => {
      expect(response.getStatus()).toBe(CreditAssessmentStatus.SigningInitiated);
    });
    it('Should have pending signing', () => {
      expect(response.hasPendingSigning()).toBe(true);
    });

    afterAll(() => {
      asStatusMock.mockClear();
    });
  });

  describe('Given signing failed', () => {
    let asStatusMock: any;

    beforeAll(() => {
      asStatusMock = jest.spyOn(convertStatusMock, 'default');
      asStatusMock.mockReturnValue(CreditAssessmentStatus.SigningFailed);
    });

    it('Should have matching status', () => {
      const apiResponse = fixture('ICreditAssessmentStatusApiResponse');

      const response = new CreditAssessmentStatusResponse(apiResponse);

      expect(response.getStatus()).toBe(CreditAssessmentStatus.SigningFailed);
    });

    describe('Given start failed hint code', () => {
      it('Should renew signing', () => {
        const apiResponse = fixture(
          'ICreditAssessmentStatusApiResponse',
          (res: ICreditAssessmentStatusApiResponse) => {
            res.bankIdHintCode = CreditAssessmentStatusResponse.START_FAILED_CODE;
            return res;
          }
        );

        const response = new CreditAssessmentStatusResponse(apiResponse);

        expect(response.shouldRenewSigning()).toBe(true);
      });
    });

    describe('Given user cancel hint code', () => {
      it('Should renew signing', () => {
        const apiResponse = fixture(
          'ICreditAssessmentStatusApiResponse',
          (res: ICreditAssessmentStatusApiResponse) => {
            res.bankIdHintCode = CreditAssessmentStatusResponse.USER_CANCEL_CODE;
            return res;
          }
        );

        const response = new CreditAssessmentStatusResponse(apiResponse);

        expect(response.shouldRenewSigning()).toBe(true);
      });
    });

    describe('Given other hint code', () => {
      it('Should renew signing', () => {
        const apiResponse = fixture('ICreditAssessmentStatusApiResponse');

        const response = new CreditAssessmentStatusResponse(apiResponse);

        expect(response.shouldRenewSigning()).toBe(false);
      });
    });

    afterAll(() => {
      asStatusMock.mockClear();
    });
  });

  describe('Given signed status', () => {
    let asStatusMock: any;
    let response: ICreditAssessmentStatusResponse;

    beforeAll(() => {
      asStatusMock = jest.spyOn(convertStatusMock, 'default');
      asStatusMock.mockReturnValue(CreditAssessmentStatus.Signed);

      const apiResponse = fixture('ICreditAssessmentStatusApiResponse');
      response = new CreditAssessmentStatusResponse(apiResponse);
    });

    it('Should have matching status', () => {
      expect(response.getStatus()).toBe(CreditAssessmentStatus.Signed);
    });

    it('Should have pending scoring', () => {
      expect(response.hasPendingScoring()).toBe(true);
    });

    it('Should be signed', () => {
      expect(response.isSigned()).toBe(true);
    });

    afterAll(() => {
      asStatusMock.mockClear();
    });
  });

  describe('Given scoring initiated', () => {
    let asStatusMock: any;
    let response: ICreditAssessmentStatusResponse;

    beforeAll(() => {
      asStatusMock = jest.spyOn(convertStatusMock, 'default');
      asStatusMock.mockReturnValue(CreditAssessmentStatus.ScoringInitiated);

      const apiResponse = fixture('ICreditAssessmentStatusApiResponse');
      response = new CreditAssessmentStatusResponse(apiResponse);
    });

    it('Should have matching status', () => {
      expect(response.getStatus()).toBe(CreditAssessmentStatus.ScoringInitiated);
    });

    it('Should be signed', () => {
      expect(response.isSigned()).toBe(true);
    });

    it('Should have pending scoring', () => {
      expect(response.hasPendingScoring()).toBe(true);
    });

    afterAll(() => {
      asStatusMock.mockClear();
    });
  });

  describe('Given scored status', () => {
    let asStatusMock: any;
    let response: ICreditAssessmentStatusResponse;

    beforeAll(() => {
      asStatusMock = jest.spyOn(convertStatusMock, 'default');
      asStatusMock.mockReturnValue(CreditAssessmentStatus.Scored);

      const apiResponse = fixture('ICreditAssessmentStatusApiResponse');
      response = new CreditAssessmentStatusResponse(apiResponse);
    });

    it('Should have matching status', () => {
      expect(response.getStatus()).toBe(CreditAssessmentStatus.Scored);
    });

    it('Should be signed', () => {
      expect(response.isSigned()).toBe(true);
    });

    it('Should be scored', () => {
      expect(response.isScored()).toBe(true);
    });

    it('Should not be accepted', () => {
      expect(response.isAccepted()).toBe(false);
    });

    afterAll(() => {
      asStatusMock.mockClear();
    });
  });

  describe('Given accepted status', () => {
    let asStatusMock: any;
    let response: ICreditAssessmentStatusResponse;

    beforeAll(() => {
      asStatusMock = jest.spyOn(convertStatusMock, 'default');
      asStatusMock.mockReturnValue(CreditAssessmentStatus.Accepted);

      const apiResponse = fixture('ICreditAssessmentStatusApiResponse');
      response = new CreditAssessmentStatusResponse(apiResponse);
    });

    it('Should have matching status', () => {
      expect(response.getStatus()).toBe(CreditAssessmentStatus.Accepted);
    });

    it('Should be signed', () => {
      expect(response.isSigned()).toBe(true);
    });

    it('Should be scored', () => {
      expect(response.isScored()).toBe(true);
    });

    afterAll(() => {
      asStatusMock.mockClear();
    });
  });

  describe('Given not scored status', () => {
    let asStatusMock: any;
    let response: ICreditAssessmentStatusResponse;

    beforeAll(() => {
      asStatusMock = jest.spyOn(convertStatusMock, 'default');
      asStatusMock.mockReturnValue(CreditAssessmentStatus.NotScored);

      const apiResponse = fixture('ICreditAssessmentStatusApiResponse');
      response = new CreditAssessmentStatusResponse(apiResponse);
    });

    it('Should have matching status', () => {
      expect(response.getStatus()).toBe(CreditAssessmentStatus.NotScored);
    });

    it('Should be signed', () => {
      expect(response.isSigned()).toBe(true);
    });

    it('Should have scoring error', () => {
      expect(response.hasScoringError()).toBe(true);
    });

    afterAll(() => {
      asStatusMock.mockClear();
    });
  });

  describe('Given message from resolver', () => {
    let resolveMessageMock: any;
    const expectedMessage = 'Lorem ipsum...';

    beforeAll(() => {
      resolveMessageMock = jest.spyOn(messageResolverMock, 'default');
      resolveMessageMock.mockReturnValue(expectedMessage);
    });

    it('Should have resolved message', () => {
      const apiResponse = fixture('ICreditAssessmentStatusApiResponse');

      const response = new CreditAssessmentStatusResponse(apiResponse);

      expect(response.getSigningMessage()).toBe(expectedMessage);
    });

    afterAll(() => {
      resolveMessageMock.mockClear();
    });
  });
});
