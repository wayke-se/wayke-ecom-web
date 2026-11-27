const fixtures = require('../../test/fixtures');

import { OrderCreateResponse } from './order-create-response';

const fixture = (name: string, withData: any = undefined): any => fixtures.create(name, withData);

describe('OrderCreateResponse', () => {
  describe(':constructor()', () => {
    it('throws error for missing response param', () => {
      expect(() => {
        new OrderCreateResponse(null as any);
      }).toThrowError();
    });
  });

  describe(':getId()', () => {
    it('returns the ID from the response object', () => {
      const response = fixture('IOrderCreateResponse');
      const actual = new OrderCreateResponse(response);

      expect(actual.getId()).toEqual(response.id);
    });
  });

  describe(':getPayment()', () => {
    it('returns the payment from the response object', () => {
      const response = fixture('IOrderCreateResponse');
      const actual = new OrderCreateResponse(response);

      expect(actual.getPayment()).toEqual(response.payment);
    });
  });

  describe(':getOrderNumber()', () => {
    it('returns the order number from the response object', () => {
      const response = fixture('IOrderCreateResponse');
      const actual = new OrderCreateResponse(response);

      expect(actual.getOrderNumber()).toEqual(response.orderNumber);
    });
  });
});
