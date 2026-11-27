import * as fixtures from '../../../test/fixtures';
import * as http from '..';
import { mockExport } from '../../../test/mock-export';
const fixture = (name: string, withValues: any = undefined): any =>
  fixtures.create(name, withValues);

import { accept, cancelSigning, decline, getStatus, newCase, signCase } from './credit-assessment';

describe('API: Credit Assessment', () => {
  describe('Given unsuccessful request', () => {
    beforeAll(() => {
      mockExport(
        http,
        'json',
        () =>
          new Promise((resolve) => {
            const response = fixture('IApiResponse', {
              successful: false,
            });
            resolve(response);
          })
      );
      mockExport(http, 'raw', () => {
        throw new Error();
      });
    });

    describe('newCase()', () => {
      it('Throws error', async () => {
        const inquiry = fixture('ICreditAssessmentInquiry');

        let err: any;
        try {
          await newCase(inquiry);
        } catch (e) {
          err = e;
        }

        expect(err).toBeInstanceOf(Error);
      });
    });

    describe('getStatus()', () => {
      it('Throws error', async () => {
        let err: any;
        try {
          await getStatus('test-case-id');
        } catch (e) {
          err = e;
        }

        expect(err).toBeInstanceOf(Error);
      });
    });

    describe('signCase()', () => {
      it('Throws error', async () => {
        const request = fixture('ICreditAssessmentSignRequest');

        let err: any;
        try {
          await signCase(request);
        } catch (e) {
          err = e;
        }

        expect(err).toBeInstanceOf(Error);
      });
    });

    describe('cancelSigning()', () => {
      it('Throws error', async () => {
        let err: any;
        try {
          await cancelSigning('test-case-id');
        } catch (e) {
          err = e;
        }

        expect(err).toBeInstanceOf(Error);
      });
    });

    describe('decline()', () => {
      it('Throws error', async () => {
        let err: any;
        try {
          await decline('test-case-id');
        } catch (e) {
          err = e;
        }

        expect(err).toBeInstanceOf(Error);
      });
    });

    describe('accept()', () => {
      it('Throws error', async () => {
        let err: any;
        try {
          await accept('test-case-id');
        } catch (e) {
          err = e;
        }

        expect(err).toBeInstanceOf(Error);
      });
    });

    afterAll(() => {
      http.json.mockRestore();
      http.raw.mockRestore();
    });
  });
});
