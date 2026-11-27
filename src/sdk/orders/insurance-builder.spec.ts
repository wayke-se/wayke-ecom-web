const fixtures = require('../../test/fixtures');

import { InsuranceBuilder } from './insurance-builder';

const fixture = (id: string, withData: any = undefined): any => fixtures.create(id, withData);

describe('InsuranceBuilder', () => {
  describe(':build()', () => {
    it('returns a IOrderInsuranceRequest for the specified builder properties', () => {
      const expected = fixture('IOrderInsuranceRequest');

      const actual = new InsuranceBuilder()
        .forPersonalNumber(expected.personalNumber)
        .withDrivingDistance(expected.drivingDistance)
        .withAddOns(expected.addons)
        .build();

      expect(actual).toEqual(expected);
    });
  });
});
