import * as fixtures from '../../test/fixtures';
const fixture = (name: string): any => fixtures.create(name);

import {
  IBankIdCollectApiResponse,
  IBankIdCollectResponse,
  IBankIdCollectRequest,
  AuthStatus,
} from './types';
import { BankIdCollectResponse } from './bankid-collect-response';

describe('BankId Collect Response', () => {
  describe('Given any request', () => {
    let request: IBankIdCollectRequest;
    let apiResponse: IBankIdCollectApiResponse;
    let response: IBankIdCollectResponse;

    beforeAll(() => {
      request = fixture('IBankIdCollectRequest');
      apiResponse = fixture('IBankIdCollectApiResponse');
      response = new BankIdCollectResponse(apiResponse);
    });

    it('Should have order ref', () => {
      expect(response.getOrderRef()).toEqual(apiResponse.orderRef);
    });

    it('Should have status', () => {
      expect(response.getStatus()).toEqual(apiResponse.status);
    });

    it('Should have hint code', () => {
      expect(response.getHintCode()).toEqual(apiResponse.hintCode);
    });

    it('Should renew if failed start', () => {
      const apiResponse = fixtures.create(
        'IBankIdCollectApiResponse',
        (res: IBankIdCollectApiResponse) => {
          res.hintCode = BankIdCollectResponse.START_FAILED_CODE;
          return res;
        }
      );
      const response = new BankIdCollectResponse(apiResponse);

      expect(response.shouldRenew()).toBeTruthy();
    });
  });

  describe('Given complete response', () => {
    let request: IBankIdCollectRequest;
    let apiResponse: IBankIdCollectApiResponse;
    let response: IBankIdCollectResponse;

    beforeAll(() => {
      request = fixture('IBankIdCollectRequest');
      apiResponse = fixtures.create(
        'IBankIdCollectApiResponse',
        (res: IBankIdCollectApiResponse) => {
          res.status = 'complete';
          return res;
        }
      );
      response = new BankIdCollectResponse(apiResponse);
    });

    it('Should be completed', () => {
      expect(response.isCompleted()).toBeTruthy();
    });

    it('Should have personal number', () => {
      var apiPersonalNumber =
        apiResponse.completionData && apiResponse.completionData.personalNumber;
      expect(response.getPersonalNumber()).toEqual(apiPersonalNumber);
    });

    it('Should have address', () => {
      const apiAddress = apiResponse.completionData && apiResponse.completionData.address;
      expect(response.getAddress()).toEqual(apiAddress);
    });
  });

  describe('Given user cancel hint code', () => {
    let response: IBankIdCollectResponse;

    beforeAll(() => {
      const apiResponse = fixtures.create(
        'IBankIdCollectApiResponse',
        (res: IBankIdCollectApiResponse) => {
          res.hintCode = BankIdCollectResponse.USER_CANCEL_CODE;
          return res;
        }
      );
      response = new BankIdCollectResponse(apiResponse);
    });

    it('should have true has message flag', () => {
      expect(response.hasMessage()).toBeTruthy();
    });

    it('should have message', () => {
      expect(response.getMessage()).toBeTruthy();
    });

    it('Should renew', () => {
      expect(response.shouldRenew()).toBeTruthy();
    });
  });

  describe('Given pending status', () => {
    it('should be pending', () => {
      const apiResponse = fixtures.create(
        'IBankIdCollectApiResponse',
        (res: IBankIdCollectApiResponse) => {
          res.status = AuthStatus.Pending;
          return res;
        }
      );

      const response = new BankIdCollectResponse(apiResponse);

      expect(response.isPending()).toBe(true);
    });
  });

  describe('Given falsy response', () => {
    it('should throw', () => {
      expect(() => {
        new BankIdCollectResponse(null as any);
      }).toThrowError();
    });
  });
});
