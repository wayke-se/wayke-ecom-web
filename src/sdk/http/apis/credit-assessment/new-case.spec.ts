import * as fixtures from '../../../../test/fixtures';
import * as http from '../../';
import { mockExport } from '../../../../test/mock-export';
const fixture = (name: string): any => fixtures.create(name);

import Configuration from '../../../config';
import { requestNewCase } from './new-case';

describe('New credit assessment', () => {
  let host: string;

  beforeAll(() => {
    const response = fixture('IApiResponse');
    mockExport(http, 'context', () => ({
      requestForgeryToken: response.requestForgeryToken,
    }));
    mockExport(http, 'captureStateContext');
    mockExport(http, 'json');

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
