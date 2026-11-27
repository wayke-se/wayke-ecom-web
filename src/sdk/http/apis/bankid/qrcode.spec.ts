import * as fixtures from '../../../../test/fixtures';
const fixture = (name: string): any => fixtures.create(name);

import { getUrl } from './qrcode';
import Configuration from '../../../config';

describe('BankId QrCode Refresh', () => {
  let host: string;

  beforeAll(() => {
    const fake = fixture('IConfiguration');
    const config = Configuration.bind(fake);
    host = config.getApiAddress();
  });

  describe(':getUrl()', () => {
    it('Should be same orderRef route, given same orderRef', () => {
      const request = fixtures.create('IBankIdQrCodeRequest');

      var url = getUrl(request.orderRef);

      expect(url).toEqual(`${host}/bankid/auth/${request.orderRef}/qr-code/refresh`);
    });
  });
});
