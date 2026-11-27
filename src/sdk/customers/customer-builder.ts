import { IAddress, ICustomer } from './types';

export class CustomerBuilder {
  private properties: { [key: string]: any } = {};
  public withAddress(address: IAddress): CustomerBuilder {
    this.properties.address = address;
    this.properties.name = address.name;
    this.properties.givenName = address.givenName;
    this.properties.surname = address.surname;

    return this;
  }

  public withPersonalNumber(personalNumber: string): CustomerBuilder {
    this.properties.personalNumber = personalNumber;

    return this;
  }

  public withEmail(email: string): CustomerBuilder {
    this.properties.email = email;

    return this;
  }

  public withPhoneNumber(phoneNumber: string): CustomerBuilder {
    this.properties.phoneNumber = phoneNumber;

    return this;
  }

  public withGivenName(givenName: string): CustomerBuilder {
    this.properties.givenName = givenName;

    return this;
  }

  public withSurname(surname: string): CustomerBuilder {
    this.properties.surname = surname;

    return this;
  }

  public build(): ICustomer {
    return this.properties as ICustomer;
  }
}
