const fixtures = require('../../../../test/fixtures');
const fixture = (name: string): any => fixtures.create(name);

import { getUrl } from './auth';
import Configuration from '../../../config';
import { IBankIdAuthRequest, AuthMethod } from '../../../bankid/types';

describe('BankId Auth', () => {
  let host: string;

  beforeAll(() => {
    const fake = fixture('IConfiguration');
    const config = Configuration.bind(fake);
    host = config.getApiAddress();
  });

  describe(':getUrl()', () => {
    it('Should be same device route, given same device method', () => {
      const request = fixtures.create('IBankIdAuthRequest', (r: IBankIdAuthRequest) => {
        r.method = AuthMethod.SameDevice;
        return r;
      });

      var url = getUrl(request);

      expect(url).toEqual(`${host}/bankid/auth/same-device`);
    });

    it('Should be qr code route, given qr code method', () => {
      const request = fixtures.create('IBankIdAuthRequest', (r: IBankIdAuthRequest) => {
        r.method = AuthMethod.QrCode;
        return r;
      });

      var url = getUrl(request);

      expect(url).toEqual(`${host}/bankid/auth/qr-code`);
    });
  });
});
