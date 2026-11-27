const fixtures = require('../../../../test/fixtures');
const fixture = (name: string): any => fixtures.create(name);

import Configuration from '../../../config';
const http = require('../../');
import { requestNewCase } from './new-case';

describe('New credit assessment', () => {
  let host: string;

  beforeAll(() => {
    const response = fixture('IApiResponse');
    http.context = jest.fn(() => ({
      requestForgeryToken: response.requestForgeryToken,
    }));
    http.captureStateContext = jest.fn();
    http.json = jest.fn();

    const fake = fixture('IConfiguration');
    const config = Configuration.bind(fake);
    host = config.getApiAddress();
  });

  describe(':requestNewCase()', () => {
    it('Should use specified inquiry as body in request', () => {
      const inquiry = fixture('ICreditAssessmentInquiry');

      requestNewCase(inquiry);

      const requestBody = JSON.parse(http.json.mock.calls[0][1].body);
      expect(requestBody).toEqual(inquiry);
    });
  });

  afterAll(() => {
    http.context.mockRestore();
  });
});
