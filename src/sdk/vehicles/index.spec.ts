jest.mock('../http/apis/vehicles');

const fixtures = require('../../test/fixtures');

import Configuration from '../config';
import * as api from '../http/apis/vehicles';
import { VehicleLookupRequestBuilder } from './vehicle-lookup-request-builder';
import { VehicleTradeBuilder } from './vehicle-trade-builder';

import * as vehicles from '.';

const fixture = (name: string, withData: any = undefined): any => fixtures.create(name, withData);

describe('Vehicle Functions', () => {
  describe('newLookupRequest()', () => {
    it('returns a VehicleLookupRequestBuilder', () => {
      const builder = vehicles.newLookupRequest();

      expect(builder).toBeInstanceOf(VehicleLookupRequestBuilder);
    });
    it('returns a new instance of VehicleLookupRequestBuilder', () => {
      const b1 = vehicles.newLookupRequest();
      const b2 = vehicles.newLookupRequest();

      expect(b1).not.toBe(b2);
    });
  });

  describe('newVehicleTrade()', () => {
    it('returns a VehicleTradeBuilder', () => {
      const builder = vehicles.newVehicleTrade();

      expect(builder).toBeInstanceOf(VehicleTradeBuilder);
    });
    it('returns a new instance of VehicleTradeBuilder', () => {
      const b1 = vehicles.newVehicleTrade();
      const b2 = vehicles.newVehicleTrade();

      expect(b1).not.toBe(b2);
    });
  });

  describe('lookupVehicle()', () => {
    it('throws error if no configuration is bound', async () => {
      const request = fixture('IVehicleLookupRequest');

      let err;
      try {
        await vehicles.lookupVehicle(request);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
    it('validates the provided request', async () => {
      const spy = jest.spyOn(VehicleLookupRequestBuilder, 'validateRequest');
      const request = fixture('IVehicleLookupRequest');

      (api.lookup as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            const response = fixture('IVehicleLookupResponse');
            resolve(response);
          })
      );

      Configuration.bind(fixture('IConfiguration'));
      await vehicles.lookupVehicle(request);

      expect(spy).toHaveBeenCalledWith(request);
    });
  });
});
