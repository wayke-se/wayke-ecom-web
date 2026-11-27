import * as fixtures from '../../test/fixtures';
import { VehicleLookupResponse } from './vehicle-lookup-response';

const fixture = (name: string, withData: any = undefined) => fixtures.create(name, withData);

describe('VehicleLookupResponse', () => {
  describe(':constructor()', () => {
    it('throws an error for missing response param', () => {
      expect(() => {
        new VehicleLookupResponse(null as any, '');
      }).toThrowError();
    });
  });

  describe(':getVehicle()', () => {
    it('returns a IVehicleLookupResponse with the specified vehicle', () => {
      const response = fixture('IVehicleLookupResponse');
      const actual = new VehicleLookupResponse(response, '').getVehicle();

      expect(actual).toEqual(response);
    });
  });
});
