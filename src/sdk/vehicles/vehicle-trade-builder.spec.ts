const fixtures = require('../../test/fixtures');

import { VehicleTradeBuilder } from './vehicle-trade-builder';

const fixture = (id: string, withData: any = undefined): any => fixtures.create(id, withData);

describe('VehicleTradeBuilder', () => {
  describe(':build()', () => {
    it('returns a IVehicleTrade for the specified builder properties', () => {
      const expected = fixture('IVehicleTrade');

      const actual = new VehicleTradeBuilder()
        .forVehicle(expected.registrationNumber)
        .withMileage(expected.mileage)
        .withCondition(expected.condition)
        .withComment(expected.comments)
        .build();

      expect(actual).toEqual(expected);
    });
  });
});
