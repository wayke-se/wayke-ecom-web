import { vi } from 'vitest';
import * as fixtures from '../../test/fixtures';
import Configuration, { IOriginConfiguration, IConfigurationRoot } from '.';

const fixture = (id: string): any => fixtures.create(id);

describe('Configuration', () => {
  const env = process.env;

  beforeEach(() => {
    vi.resetModules();
    Configuration.destroy();
    process.env = {};
  });
  afterEach(() => {
    process.env = env;
  });

  describe('bind()', () => {
    it('returns a valid configuration object', () => {
      const config = Configuration.bind(fixture('IConfiguration'));
      expect(config).toBeInstanceOf(Configuration);
    });
    it('returns a default origin object', () => {
      const fake = fixture('IConfiguration');
      delete fake.origin;

      const w = window as any;

      const copy = { ...w.location };
      delete w.location;
      w.location = { ...copy, host: 'www.example.com' };

      const config = Configuration.bind(fake);
      const expected = {
        channel: 'Web',
        topic: 'example.com',
      };
      const actual = config.getOrigin();
      expect(actual).toEqual(expected);
    });
    it("returns an undefined origin object, when runtime can't be established", () => {
      const fake = fixture('IConfiguration');
      delete fake.origin;

      const w = window as any;
      delete w.location;

      const config = Configuration.bind(fake);
      const origin = config.getOrigin();
      expect(origin).toBeUndefined();
    });
  });

  describe('current()', () => {
    it('throws if not bound and no environment variable for API address exist', () => {
      expect(() => Configuration.current()).toThrowError();
    });
    it('returns a valid configuration object from environment variables by default', () => {
      const address = 'https://www.example.com';
      process.env.WAYKE_ECOM_API_ADDRESS = address;

      expect(Configuration.current()).toBeInstanceOf(Configuration);
    });
    it('returns a valid configuration object when bound with IConfigurationRoot', () => {
      Configuration.bind(fixture('IConfiguration'));
      expect(Configuration.current()).toBeInstanceOf(Configuration);
    });
  });

  describe('getApiAddress()', () => {
    it('throws if not bound and no environment variable for API address exist', () => {
      const config = new Configuration();
      expect(() => config.getApiAddress()).toThrowError();
    });
    it('returns the bound address from environment variable by default', () => {
      const address = 'https://www.example.com';
      process.env.WAYKE_ECOM_API_ADDRESS = address;

      const config = new Configuration();
      expect(config.getApiAddress()).toEqual(address);
    });
    it('returns the bound address from the specified IConfigurationRoot', () => {
      const fake = fixture('IConfiguration');
      const config = Configuration.bind(fake);
      expect(config.getApiAddress()).toEqual(fake.api.address);
    });
  });

  describe('getOrigin()', () => {
    it('throws if not bound', () => {
      const config = new Configuration();
      expect(() => config.getOrigin()).toThrowError();
    });
    it('returns undefined when no origin can be automatically created', () => {
      const address = 'https://www.example.com';
      process.env.WAYKE_ECOM_API_ADDRESS = address;

      const w = window as any;
      delete w.location;

      const config = new Configuration();
      expect(config.getOrigin()).toBeUndefined();
    });
    it('returns location host as topic by default, with www prefix stripped', () => {
      const address = 'https://www.example.com';
      process.env.WAYKE_ECOM_API_ADDRESS = address;

      const w = window as any;

      const copy = { ...w.location };
      delete w.location;
      w.location = { ...copy, host: address };

      const expected = address.replace('www.', '');
      const config = new Configuration();
      const origin = config.getOrigin() as IOriginConfiguration;
      expect(origin.topic).toEqual(expected);
    });
    it("returns 'Web' as channel by default, when host is available", () => {
      const address = 'https://www.example.com';
      process.env.WAYKE_ECOM_API_ADDRESS = address;

      const w = window as any;

      const copy = { ...w.location };
      delete w.location;
      w.location = { ...copy, host: 'www.example.com' };

      const expected = 'Web';
      const config = new Configuration();
      const origin = config.getOrigin() as IOriginConfiguration;
      expect(origin.channel).toEqual(expected);
    });
  });

  describe('useBankIdThumbprint()', () => {
    it('throws if not bound', () => {
      const config = new Configuration();
      expect(() => config.useBankIdThumbprint()).toThrowError();
    });
    it('returns false if no thumbprint is set', () => {
      const fake = fixtures.create('IConfiguration');
      delete fake.bankIdThumbprint;

      const config = Configuration.bind(fake);

      expect(config.useBankIdThumbprint()).toBe(false);
    });
    it('returns false if thumbrint is empty', () => {
      const fake = fixtures.create(
        'IConfiguration',
        (c: IConfigurationRoot) => (c.bankIdThumbprint = '')
      );

      const config = Configuration.bind(fake);

      expect(config.useBankIdThumbprint()).toBe(false);
    });
    it('returns true if thumbrint is set', () => {
      const fake = fixtures.create('IConfiguration');

      const config = Configuration.bind(fake);

      expect(config.useBankIdThumbprint()).toBe(true);
    });
  });

  describe('getBankIdThumbprint()', () => {
    it('throws if not bound', () => {
      const config = new Configuration();
      expect(() => config.getBankIdThumbprint()).toThrowError();
    });
    it('returns bound thumbprint', () => {
      const fake = fixtures.create('IConfiguration');

      const config = Configuration.bind(fake);

      expect(config.getBankIdThumbprint()).toBe(fake.bankIdThumbprint);
    });
  });
});
