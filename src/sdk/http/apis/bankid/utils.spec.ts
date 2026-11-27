const fixtures = require('../../../../test/fixtures');
const fixture = (name: string): any => fixtures.create(name);

import { createRequest } from './utils';

import Configuration, { IConfigurationRoot } from '../../../config';
import { BANK_ID_THUMBPRINT_HEADER } from '../../http-request-builder';
const http = require('../../');

describe(':createRequest()', () => {
  describe('Given bank id thumbprint configured', () => {
    let requestForgeryToken: string;
    let configSpecification: IConfigurationRoot;

    beforeAll(() => {
      const response = fixture('IApiResponse');
      http.context = jest.fn(() => ({ requestForgeryToken }));
      requestForgeryToken = response.requestForgeryToken;

      configSpecification = fixture('IConfiguration');
      Configuration.bind(configSpecification);
    });

    it('Should have request forgery token header', () => {
      const request = createRequest();
      expect(request.headers).toHaveProperty('x-rf-token', requestForgeryToken);
    });

    it('Should have bank id thumbprint header', () => {
      const request = createRequest();
      expect(request.headers).toHaveProperty(
        BANK_ID_THUMBPRINT_HEADER,
        configSpecification.bankIdThumbprint
      );
    });

    it('Should accept application/json', () => {
      const request = createRequest();
      expect(request.headers).toHaveProperty('Accept', 'application/json');
    });

    it('Should be post request', () => {
      const request = createRequest();
      expect(request.method).toBe('post');
    });
  });

  describe('Given no bank id thumbprint configured', () => {
    beforeAll(() => {
      const fake = fixture('IConfiguration');
      delete fake.bankIdThumbprint;
      Configuration.bind(fake);
    });

    it('Should not have bank id thumbprint header', () => {
      const request = createRequest();
      expect(request.headers).not.toHaveProperty(BANK_ID_THUMBPRINT_HEADER);
    });
  });
});
