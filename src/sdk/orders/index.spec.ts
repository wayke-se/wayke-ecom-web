jest.mock('../http/apis/orders');

const fixtures = require('../../test/fixtures');

import Configuration from '../config';
import * as api from '../http/apis/orders';
import { OrderCreateRequestBuilder } from './order-create-request-builder';
import { OrderOptionsRequestBuilder } from './order-options-request-builder';

import * as orders from '.';
import { PaymentBuilder } from './payment-builder';
import { OrderCreditAssessmentBuilder } from './order-credit-assessment-builder';
import { InsuranceBuilder } from './insurance-builder';

const fixture = (name: string, withData: any = undefined) => fixtures.create(name, withData);

describe('Order Functions', () => {
  describe('newCreateRequest()', () => {
    it('returns a OrderCreateRequestBuilder', () => {
      const builder = orders.newCreateRequest();

      expect(builder).toBeInstanceOf(OrderCreateRequestBuilder);
    });
    it('returns a new instance of OrderCreateRequestBuilder', () => {
      const b1 = orders.newCreateRequest();
      const b2 = orders.newCreateRequest();

      expect(b1).not.toBe(b2);
    });
  });

  describe('newOptionsRequest()', () => {
    it('returns a OrderOptionsRequestBuilder', () => {
      const builder = orders.newOptionsRequest();

      expect(builder).toBeInstanceOf(OrderOptionsRequestBuilder);
    });
    it('returns a new instance of OrderOptionsRequestBuilder', () => {
      const b1 = orders.newOptionsRequest();
      const b2 = orders.newOptionsRequest();

      expect(b1).not.toBe(b2);
    });
  });

  describe('newInsurance()', () => {
    it('returns a InsuranceBuilder', () => {
      const builder = orders.newInsurance();

      expect(builder).toBeInstanceOf(InsuranceBuilder);
    });
    it('returns a new instance of InsuranceBuilder', () => {
      const b1 = orders.newInsurance();
      const b2 = orders.newInsurance();

      expect(b1).not.toBe(b2);
    });
  });

  describe('newPayment()', () => {
    it('returns a PaymentBuilder', () => {
      const builder = orders.newPayment();

      expect(builder).toBeInstanceOf(PaymentBuilder);
    });
    it('returns a new instance of PaymentBuilder', () => {
      const b1 = orders.newPayment();
      const b2 = orders.newPayment();

      expect(b1).not.toBe(b2);
    });
  });

  describe('newCreditAssessment()', () => {
    it('returns a OrderCreditAssessmentBuilder', () => {
      const builder = orders.newCreditAssessment();

      expect(builder).toBeInstanceOf(OrderCreditAssessmentBuilder);
    });
    it('returns a new instance of OrderCreditAssessmentBuilder', () => {
      const b1 = orders.newCreditAssessment();
      const b2 = orders.newCreditAssessment();

      expect(b1).not.toBe(b2);
    });
  });

  describe('create()', () => {
    it('throws error if no configuration is bound', async () => {
      const request = fixture('IOrderCreateRequest');

      let err;
      try {
        await orders.create(request);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
    it('validates the provided request', async () => {
      const spy = jest.spyOn(OrderCreateRequestBuilder, 'validateRequest');
      const request = fixture('IOrderCreateRequest');

      (api.create as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            const response = fixture('IOrderCreateResponse');
            resolve(response);
          })
      );

      Configuration.bind({
        api: {
          address: 'https://www.example.com',
        },
        origin: {
          topic: 'example.com',
          channel: 'channel',
        },
      });

      await orders.create(request);

      expect(spy).toHaveBeenCalledWith(request);
    });
  });

  describe('getOptions()', () => {
    it('throws error if no configuration is bound', async () => {
      const request = fixture('IOrderOptionsRequest');

      let err;
      try {
        await orders.getOptions(request);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
    it('validates the provided request', async () => {
      const spy = jest.spyOn(OrderOptionsRequestBuilder, 'validateRequest');
      const request = fixture('IOrderOptionsRequest');

      (api.init as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            const response = fixture('IOrderOptionsResponse');
            resolve(response);
          })
      );

      Configuration.bind(fixture('IConfiguration'));
      await orders.getOptions(request);

      expect(spy).toHaveBeenCalledWith(request);
    });
  });
});
