import * as fixtures from '../../test/fixtures';
import { InsuranceOptionsRequestBuilder } from './insurance-options-request-builder';
import { DrivingDistance } from './types';

const fixture = (id: string, withData: any = undefined): any => fixtures.create(id, withData);

describe('InsuranceOptionsRequestBuilder', () => {
  describe('.validateRequest()', () => {
    it('fails and throws error for missing request', () => {
      expect(() => {
        InsuranceOptionsRequestBuilder.validateRequest(null as any);
      }).toThrowError();
    });
    it('fails and throws for missing vehicle ID value', () => {
      expect(() => {
        const request = fixture('IInsuranceOptionsRequest');
        delete request.id;
        InsuranceOptionsRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('fails and throws for missing personalNumber value', () => {
      expect(() => {
        const request = fixture('IInsuranceOptionsRequest');
        delete request.personalNumber;
        InsuranceOptionsRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('fails and throws for missing drivingDistance value', () => {
      expect(() => {
        const request = fixture('IInsuranceOptionsRequest');
        delete request.drivingDistance;
        InsuranceOptionsRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('does not throw for valid requests', () => {
      expect(() => {
        const request = fixture('IInsuranceOptionsRequest');
        InsuranceOptionsRequestBuilder.validateRequest(request);
      }).not.toThrowError();
    });
  });

  describe(':forCustomer()', () => {
    it('returns the InsuranceOptionsRequestBuilder instance', () => {
      const builder = new InsuranceOptionsRequestBuilder();
      const instance = builder.forCustomer('123456-1234');

      expect(instance).toBe(builder);
    });
  });

  describe(':forVehicle()', () => {
    it('returns the InsuranceOptionsRequestBuilder instance', () => {
      const builder = new InsuranceOptionsRequestBuilder();
      const instance = builder.forVehicle('abcd-1234');

      expect(instance).toBe(builder);
    });
  });

  describe(':withDrivingDistance()', () => {
    it('returns the InsuranceOptionsRequestBuilder instance', () => {
      const builder = new InsuranceOptionsRequestBuilder();
      const instance = builder.withDrivingDistance(DrivingDistance.Between1000And1500);

      expect(instance).toBe(builder);
    });
  });

  describe(':build()', () => {
    it('returns a IInsuranceOptionsRequest for the specified builder properties', () => {
      const expected = fixture('IInsuranceOptionsRequest');

      const actual = new InsuranceOptionsRequestBuilder()
        .forCustomer(expected.personalNumber)
        .forVehicle(expected.id)
        .withDrivingDistance(expected.drivingDistance)
        .build();

      expect(actual).toEqual(expected);
    });
  });
});
