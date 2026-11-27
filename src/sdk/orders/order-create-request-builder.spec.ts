const fixtures = require('../../test/fixtures');

import { OrderCreateRequestBuilder } from './order-create-request-builder';

const fixture = (id: string, withData: any = undefined): any => fixtures.create(id, withData);

describe('OrderCreateRequestBuilder', () => {
  describe('.validateRequest()', () => {
    it('fails and throws error for missing request', () => {
      expect(() => {
        OrderCreateRequestBuilder.validateRequest(null as any);
      }).toThrowError();
    });
    it('fails and throws error for missing vehicle ID value', () => {
      expect(() => {
        const request = fixture('IOrderCreateRequest');
        delete request.id;
        OrderCreateRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('fails and throws error for missing customer value', () => {
      expect(() => {
        const request = fixture('IOrderCreateRequest');
        delete request.customer;
        OrderCreateRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('fails and throws error for missing payment value', () => {
      expect(() => {
        const request = fixture('IOrderCreateRequest');
        delete request.payment;
        OrderCreateRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('fails and throws error for missing delivery type value', () => {
      expect(() => {
        const request = fixture('IOrderCreateRequest');
        delete request.deliveryType;
        OrderCreateRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('does not throw for valid requests', () => {
      expect(() => {
        const request = fixture('IOrderCreateRequest');
        OrderCreateRequestBuilder.validateRequest(request);
      }).not.toThrowError();
    });
  });

  describe(':forVehicle()', () => {
    it('returns the OrderCreateRequestBuilder instance', () => {
      const builder = new OrderCreateRequestBuilder();
      const instance = builder.forVehicle('abcd-1234');

      expect(instance).toBe(builder);
    });
  });

  describe(':build()', () => {
    it('returns a IOrderCreateRequest for the specified builder properties', () => {
      const expected = fixture('IOrderCreateRequest');

      const actual = new OrderCreateRequestBuilder()
        .forVehicle(expected.id)
        .withCustomer(expected.customer)
        .withDeliveryType(expected.deliveryType)
        .withInsurance(expected.insurance)
        .withPayment(expected.payment)
        .withTradeIn(expected.tradein)
        .withUrls(expected.urls.redirect, expected.urls.payment)
        .build();

      expect(actual).toEqual(expected);
    });
  });
});
