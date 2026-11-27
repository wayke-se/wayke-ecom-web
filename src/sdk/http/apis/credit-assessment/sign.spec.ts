import * as fixtures from '../../../../test/fixtures';
const fixture = (name: string): any => fixtures.create(name);

import { getUrl } from './sign';
import Configuration from '../../../config';
import { AuthMethod } from '../../../bankid/types';
import { ICreditAssessmentSignRequest } from '../../../credit-assessment/types';

describe('BankId Auth', () => {
  let host: string;

  beforeAll(() => {
    const fake = fixture('IConfiguration');
    const config = Configuration.bind(fake);
    host = config.getApiAddress();
  });

  describe(':getUrl()', () => {
    describe('Given same device method', () => {
      it('Should be same device route', () => {
        const request = fixtures.create(
          'ICreditAssessmentSignRequest',
          (r: ICreditAssessmentSignRequest) => {
            r.method = AuthMethod.SameDevice;
            return r;
          }
        );

        var url = getUrl(request);

        expect(url).toBe(`${host}/credit-assessment/sign/${request.caseId}/same-device`);
      });
    });

    describe('Given qr code method', () => {
      it('Should be qr code route', () => {
        const request = fixtures.create(
          'ICreditAssessmentSignRequest',
          (r: ICreditAssessmentSignRequest) => {
            r.method = AuthMethod.QrCode;
            return r;
          }
        );

        var url = getUrl(request);

        expect(url).toEqual(`${host}/credit-assessment/sign/${request.caseId}/qr-code`);
      });
    });
  });
});
