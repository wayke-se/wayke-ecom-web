import * as fixtures from '../../test/fixtures';
import { VehicleLookupRequestBuilder } from './vehicle-lookup-request-builder';
import { VehicleCondition } from './types';

const fixture = (name: string): any => fixtures.create(name);

describe('VehicleLookupRequestBuilder', () => {
  describe('.validateRequest()', () => {
    it('fails and throws error for missing request', () => {
      expect(() => {
        VehicleLookupRequestBuilder.validateRequest(null as any);
      }).toThrowError();
    });
    it('fails and throws error for missing registration number value', () => {
      expect(() => {
        const request = fixture('IVehicleLookupRequest');
        delete request.registrationNumber;
        VehicleLookupRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('fails and throws error for missing condition value for valuation request', () => {
      expect(() => {
        const request = fixture('IVehicleLookupRequest');
        delete request.condition;
        VehicleLookupRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('fails and throws error for missing mileage value for valuation request', () => {
      expect(() => {
        const request = fixture('IVehicleLookupRequest');
        delete request.mileage;
        VehicleLookupRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('does not throw for valid requests', () => {
      expect(() => {
        const request = fixture('IVehicleLookupRequest');
        VehicleLookupRequestBuilder.validateRequest(request);
      }).not.toThrowError();
    });
  });

  describe(':withRegistrationNumber()', () => {
    it('returns the VehicleLookupRequestBuilder instance', () => {
      const builder = new VehicleLookupRequestBuilder();
      const instance = builder.withRegistrationNumber('ABC123');

      expect(instance).toBe(builder);
    });
  });

  describe(':withMileage()', () => {
    it('returns the VehicleLookupRequestBuilder instance', () => {
      const builder = new VehicleLookupRequestBuilder();
      const instance = builder.withMileage(5000);

      expect(instance).toBe(builder);
    });
  });

  describe(':withCondition()', () => {
    it('returns the VehicleLookupRequestBuilder instance', () => {
      const builder = new VehicleLookupRequestBuilder();
      const instance = builder.withCondition(VehicleCondition.VeryGood);

      expect(instance).toBe(builder);
    });
  });

  describe(':build()', () => {
    it('returns a IVehicleLookupRequest for the specified builder properties', () => {
      const expected = fixture('IVehicleLookupRequest');
      const actual = new VehicleLookupRequestBuilder()
        .withRegistrationNumber(expected.registrationNumber)
        .withCondition(expected.condition)
        .withMileage(expected.mileage)
        .build();

      expect(actual).toEqual(expected);
    });
  });
});
