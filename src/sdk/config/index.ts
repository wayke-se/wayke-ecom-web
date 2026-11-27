export interface IOriginConfiguration {
  topic: string;
  channel: string;
}

export interface IApiConfiguration {
  address: string;
}

export interface IConfigurationRoot {
  api: IApiConfiguration;
  origin?: IOriginConfiguration;
  bankIdThumbprint?: string;
}

export interface IConfiguration {
  getApiAddress(): string;
  getOrigin(): IOriginConfiguration | undefined;
  useBankIdThumbprint(): boolean;
  getBankIdThumbprint(): string | undefined;
}

const createDefaultOrigin = (): IOriginConfiguration | undefined => {
  if (!window || !window.location) return undefined;

  const topic = window.location.host.replace('www.', '');
  const channel = 'Web';

  return {
    topic,
    channel,
  };
};

const createDefaultConfig = (): IConfigurationRoot | undefined => {
  if (process.env.WAYKE_ECOM_API_ADDRESS) {
    return {
      api: {
        address: process.env.WAYKE_ECOM_API_ADDRESS,
      },
      origin: createDefaultOrigin(),
    };
  }

  return undefined;
};

class Configuration implements IConfiguration {
  public static current(): IConfiguration {
    if (Configuration.instance) {
      return Configuration.instance;
    }

    const instance = new Configuration();
    if (!instance.config) {
      throw Configuration.notBoundError;
    }

    Configuration.instance = instance;
    return Configuration.instance;
  }

  public static bind(newConfig: IConfigurationRoot): IConfiguration {
    Configuration.instance = new Configuration();
    Configuration.instance.config = {
      api: {
        address: newConfig.api.address,
      },
      origin: newConfig.origin
        ? {
            topic: newConfig.origin.topic,
            channel: newConfig.origin.channel,
          }
        : createDefaultOrigin(),
      bankIdThumbprint: newConfig.bankIdThumbprint,
    };

    return Configuration.instance;
  }

  public static destroy() {
    Configuration.instance = undefined;
  }

  private static instance: Configuration | undefined = undefined;
  private static notBoundError: Error = new Error('Configuration not bound yet');

  private config: IConfigurationRoot | undefined = createDefaultConfig();

  public getApiAddress(): string {
    if (!this.config) {
      throw Configuration.notBoundError;
    }

    return this.config.api.address;
  }

  public getOrigin(): IOriginConfiguration | undefined {
    if (!this.config) {
      throw Configuration.notBoundError;
    }

    return this.config.origin;
  }

  public useBankIdThumbprint(): boolean {
    if (!this.config) {
      throw Configuration.notBoundError;
    }

    return !!this.config.bankIdThumbprint;
  }

  public getBankIdThumbprint(): string | undefined {
    if (!this.config) {
      throw Configuration.notBoundError;
    }

    return this.config.bankIdThumbprint;
  }
}

export default Configuration;
