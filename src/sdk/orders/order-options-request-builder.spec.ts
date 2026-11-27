import * as fixtures from '../../test/fixtures';
import { OrderOptionsRequestBuilder } from './order-options-request-builder';

const fixture = (id: string, withData: any = undefined): any => fixtures.create(id, withData);

describe('OrderOptionsRequestBuilder', () => {
  describe('.validateRequest()', () => {
    it('fails and throws error for missing request', () => {
      expect(() => {
        OrderOptionsRequestBuilder.validateRequest(null as any);
      }).toThrowError();
    });
    it('fails and throws for missing vehicle ID value', () => {
      expect(() => {
        const request = fixture('IOrderOptionsRequest');
        delete request.id;
        OrderOptionsRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('does not throw for valid requests', () => {
      expect(() => {
        const request = fixture('IOrderOptionsRequest');
        OrderOptionsRequestBuilder.validateRequest(request);
      }).not.toThrowError();
    });
  });

  describe(':forVehicle()', () => {
    it('returns the OrderOptionsRequestBuilder instance', () => {
      const builder = new OrderOptionsRequestBuilder();
      const instance = builder.forVehicle('abcd-1234');

      expect(instance).toBe(builder);
    });
  });

  describe(':forDealer()', () => {
    it('returns the OrderOptionsRequestBuilder instance', () => {
      const builder = new OrderOptionsRequestBuilder();
      const instance = builder.forDealer('dealer-id');

      expect(instance).toBe(builder);
    });
  });

  describe(':build()', () => {
    it('returns a IOrderOptionsRequest for the specified builder properties', () => {
      const expected = fixture('IOrderOptionsRequest');

      const actual = new OrderOptionsRequestBuilder()
        .forVehicle(expected.id)
        .forDealer(expected.branchId)
        .build();

      expect(actual).toEqual(expected);
    });
  });
});
