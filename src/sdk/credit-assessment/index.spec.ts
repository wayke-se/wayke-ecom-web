const fixtures = require('../../test/fixtures');
const fixture = (name: string): any => fixtures.create(name);

import { newCase } from './index';
import { ICreditAssessmentStatusApiResponse } from './types';

const validator = require('./validator');
const api = require('../http/apis/credit-assessment');

describe('Credit assessment functions', () => {
  describe(':newCase()', () => {
    beforeAll(() => {
      api.newCase = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            const assessmentCase = fixture('ICreditAssessmentCase');
            resolve(assessmentCase);
          })
      );
    });

    describe('Given valid inquiry', () => {
      beforeAll(() => {
        validator.validateInquiry = jest.fn();
      });

      it('Should validate inquiry', async () => {
        const inquiry = fixture('ICreditAssessmentInquiry');
        const spy = jest.spyOn(validator, 'validateInquiry');

        await newCase(inquiry);

        expect(spy).toHaveBeenCalledWith(inquiry);
      });

      afterAll(() => {
        validator.validateInquiry.mockClear();
      });
    });

    describe('Given invalid inquiry', () => {
      beforeAll(() => {
        validator.validateInquiry = jest.fn().mockImplementation(() => {
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

        api.getStatus = jest.fn().mockImplementation(
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
