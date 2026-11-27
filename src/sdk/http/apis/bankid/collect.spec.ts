import * as fixtures from '../../../../test/fixtures';
import * as http from '../../';
const fixture = (name: string): any => fixtures.create(name);

import { getUrl } from './collect';
import Configuration from '../../../config';

describe('BankId Collect', () => {
  let host: string;

  beforeAll(() => {
    const fake = fixture('IConfiguration');
    const config = Configuration.bind(fake);
    host = config.getApiAddress();
  });

  describe(':getUrl()', () => {
    it('Should be collect url', () => {
      const orderRef = fixture('IBankIdCollectRequest').orderRef;

      var url = getUrl(orderRef);

      expect(url).toEqual(`${host}/bankid/collect/${orderRef}`);
    });
  });
});
