import { vi } from 'vitest';
import * as fixtures from '../../test/fixtures';
import * as validator from './validator';
import * as api from '../http/apis/credit-assessment';
import { mockExport } from '../../test/mock-export';
const fixture = (name: string): any => fixtures.create(name);

import { newCase } from './index';
import { ICreditAssessmentStatusApiResponse } from './types';

describe('Credit assessment functions', () => {
  describe(':newCase()', () => {
    beforeAll(() => {
      mockExport(api, 'newCase').mockImplementation(
        () =>
          new Promise((resolve) => {
            const assessmentCase = fixture('ICreditAssessmentCase');
            resolve(assessmentCase);
          })
      );
    });

    describe('Given valid inquiry', () => {
      beforeAll(() => {
        mockExport(validator, 'validateInquiry');
      });

      it('Should validate inquiry', async () => {
        const inquiry = fixture('ICreditAssessmentInquiry');
        const spy = vi.spyOn(validator, 'validateInquiry');

        await newCase(inquiry);

        expect(spy).toHaveBeenCalledWith(inquiry);
      });

      afterAll(() => {
        validator.validateInquiry.mockClear();
      });
    });

    describe('Given invalid inquiry', () => {
      beforeAll(() => {
        mockExport(validator, 'validateInquiry').mockImplementation(() => {
          throw new TypeError('Invalid inquiry');
        });
      });

      it('Should throw', async () => {
        expect.assertions(1);

        const inquiry = fixture('ICreditAssessmentInquiry');

        try {
          await newCase(inquiry);
        } catch (e) {
          expect(e).toBeTruthy();
        }
      });

      afterAll(() => {
        validator.validateInquiry.mockClear();
      });
    });

    afterAll(() => {
      api.newCase.mockClear();
    });
  });

  describe('Get status', () => {
    describe('Given status from api', () => {
      let expectedStatus: ICreditAssessmentStatusApiResponse;

      beforeAll(() => {
        expectedStatus = fixture('ICreditAssessmentStatusApiResponse');

        mockExport(api, 'getStatus').mockImplementation(
          () =>
            new Promise((resolve) => {
              resolve(expectedStatus);
            })
        );
      });

      it('Should return status', async () => {
        const status = await api.getStatus('caseId');
        expect(status).toBe(expectedStatus);
      });

      afterAll(() => {
        api.newCase.mockClear();
      });
    });
  });
});
