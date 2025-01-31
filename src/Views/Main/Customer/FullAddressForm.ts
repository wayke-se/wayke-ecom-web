import i18next from '@i18n';
import { IAddress } from '@wayke-se/ecom';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputField from '../../../Components/Input/InputField';
import { goTo, setAddress, setContactAndPhone } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import ecomEvent, { EcomEvent, EcomStep, EcomView } from '../../../Utils/ecomEvent';
import { validationMethods } from '../../../Utils/validationMethods';

const GIVENNAME_NODE = 'contact-givenname-node';
const GIVENNAME_INPUT_ID = 'contact-givenname';
const SURNAME_NODE = 'contact-surname-node';
const SURNAME_INPUT_ID = 'contact-surname';
const STREET_NODE = 'contact-street-node';
const STREET_INPUT_ID = 'contact-street';
const STREET2_NODE = 'contact-street2-node';
const STREET2_INPUT_ID = 'contact-street2';
const POSTALCODE_NODE = 'contact-postalcode-node';
const POSTALCODE_INPUT_ID = 'contact-postalcode';
const CITY_NODE = 'contact-city-node';
const CITY_INPUT_ID = 'contact-city';

const PROCEED_NODE = 'contact-proceed-node';
const PROCEED = 'contact-proceed';

const validation = {
  givenName: validationMethods.requiredName,
  surname: validationMethods.requiredName,
  street: validationMethods.requiredStreet,
  street2: validationMethods.requiredStreet2,
  postalCode: validationMethods.requiredZip,
  city: validationMethods.requiredCity,
};

export interface PartialAddressValidation {
  givenName: boolean;
  surname: boolean;
  street: boolean;
  street2: boolean;
  postalCode: boolean;
  city: boolean;
}

interface AddressState {
  value: IAddress;
  validation: PartialAddressValidation;
  interact: PartialAddressValidation;
}

const initalState = (address?: IAddress): AddressState => {
  const value = {
    givenName: address?.givenName || '',
    surname: address?.surname || '',
    street: address?.street || '',
    street2: address?.street2 || '',
    postalCode: address?.postalCode || '',
    city: address?.city || '',
  };
  return {
    value,
    validation: {
      givenName: validation.givenName(value.givenName),
      surname: validation.surname(value.surname),
      street: validation.street(value.street),
      street2: validation.street2(value.street2),
      postalCode: validation.postalCode(value.postalCode),
      city: validation.city(value.city),
    },
    interact: {
      givenName: false,
      surname: false,
      street: false,
      street2: false,
      postalCode: false,
      city: false,
    },
  };
};

interface FullAddressFormProps {
  readonly store: WaykeStore;
  readonly lastStage: boolean;
}

class FullAddressForm extends HtmlNode {
  private readonly props: FullAddressFormProps;
  private state: AddressState;
  private contexts: {
    givenName?: InputField;
    surname?: InputField;
    street?: InputField;
    street2?: InputField;
    postalCode?: InputField;
    city?: InputField;
    button?: ButtonArrowRight;
  } = {};

  constructor(element: HTMLElement, props: FullAddressFormProps) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--2' });
    this.props = props;

    const state = this.props.store.getState();
    this.state = initalState(state.address);

    this.render();
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof PartialAddressValidation;

    const value = currentTarget.value;
    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);

    this.updateUiError(name);
    this.updateProceedButton();
  }

  private onBlur(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof PartialAddressValidation;

    this.state.interact[name] = true;
    this.state.validation[name] = validation[name](this.state.value[name]);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  private updateUiError(name: keyof Omit<IAddress, 'name' | 'distance'>) {
    this.contexts[name]?.setError(this.state.interact[name] && !this.state.validation[name]);
  }

  private updateProceedButton() {
    this.contexts.button?.disabled(
      !this.state.validation.givenName ||
        !this.state.validation.surname ||
        !this.state.validation.street ||
        !this.state.validation.street2 ||
        !this.state.validation.postalCode ||
        !this.state.validation.city
    );
  }

  private onProceed() {
    ecomEvent(EcomView.MAIN, EcomEvent.CUSTOMER_ADDRESS_SET, EcomStep.CUSTOMER_ADDRESS);

    setAddress(
      {
        givenName: this.state.value.givenName.trim(),
        surname: this.state.value.surname.trim(),
        street: this.state.value.street.trim(),
        street2: this.state.value.street2.trim(),
        postalCode: this.state.value.postalCode.trim(),
        city: this.state.value.city.trim(),
      },
      this.props.lastStage
    )(this.props.store.dispatch);
  }

  private onChangeAddress() {
    ecomEvent(EcomView.MAIN, EcomEvent.CUSTOMER_ADDRESS_EDIT, EcomStep.CUSTOMER_ADDRESS);
    goTo('main', 2)(this.props.store.dispatch);
  }

  render() {
    const subStage = this.props.store.getState().navigation.subStage;

    if (subStage > 2) {
      const keyValueItems: { key: string; value: string }[] = [
        { key: i18next.t('customer.givenName'), value: this.state.value.givenName },
        { key: i18next.t('customer.surname'), value: this.state.value.surname },
        { key: i18next.t('customer.street'), value: this.state.value.street },
        { key: i18next.t('customer.street2'), value: this.state.value.street2 },
        { key: i18next.t('customer.postalCode'), value: this.state.value.postalCode },
        { key: i18next.t('customer.city'), value: this.state.value.city },
      ];

      this.node.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--2">
          <ul class="waykeecom-key-value-list">
            ${keyValueItems.map((kv) => KeyValueListItem(kv)).join('')}
          </ul>
        </div>
      `;

      if (subStage <= 2) {
        this.node.innerHTML += `
          <div class="waykeecom-stack waykeecom-stack--2">
            <div class="waykeecom-align waykeecom-align--end">
              <button type="button" title="${i18next.t('customer.changeContactsButton')}" class="waykeecom-link" id="change-address">${i18next.t('customer.changeContactsButton')}</button>
            </div>
          </div>
        `;
      }
    } else {
      this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <h4 class="waykeecom-heading waykeecom-heading--4">${i18next.t('customer.contactInfoTitle')}</h4>
        <div class="waykeecom-content">
          <p class="waykeecom-content__p">${i18next.t('customer.contactInfoDescription')}</p>
        </div>
      </div>

      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2" id="${GIVENNAME_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${SURNAME_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${STREET_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${STREET2_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${POSTALCODE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${CITY_NODE}"></div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_NODE}"></div>
    `;

      this.contexts.givenName = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${GIVENNAME_NODE}`),
        {
          title: i18next.t('customer.givenName'),
          value: this.state.value.givenName,
          id: GIVENNAME_INPUT_ID,
          error: this.state.interact.givenName && !this.state.validation.givenName,
          errorMessage: i18next.t('customer.givenNameErrorMessage'),
          name: 'givenName',
          autocomplete: 'text',
          placeholder: i18next.t('customer.givenNamePlaceholder'),
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.surname = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${SURNAME_NODE}`),
        {
          title: i18next.t('customer.surname'),
          value: this.state.value.surname,
          id: SURNAME_INPUT_ID,
          error: this.state.interact.surname && !this.state.validation.surname,
          errorMessage: i18next.t('customer.surnameErrorMessage'),
          name: 'surname',
          autocomplete: 'text',
          placeholder: i18next.t('customer.surnamePlaceholder'),
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.street = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${STREET_NODE}`),
        {
          title: i18next.t('customer.street'),
          value: this.state.value.street,
          id: STREET_INPUT_ID,
          error: this.state.interact.street && !this.state.validation.street,
          errorMessage: i18next.t('customer.streetErrorMessage'),
          name: 'street',
          autocomplete: 'text',
          placeholder: i18next.t('customer.streetPlaceholder'),
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.street2 = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${STREET2_NODE}`),
        {
          title: i18next.t('customer.street2'),
          value: this.state.value.street2,
          id: STREET2_INPUT_ID,
          error: this.state.interact.street2 && !this.state.validation.street2,
          errorMessage: i18next.t('customer.street2ErrorMessage'),
          name: 'street2',
          autocomplete: 'text',
          placeholder: i18next.t('customer.street2Placeholder'),
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.postalCode = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${POSTALCODE_NODE}`),
        {
          title: i18next.t('customer.postalCode'),
          value: this.state.value.postalCode,
          id: POSTALCODE_INPUT_ID,
          error: this.state.interact.postalCode && !this.state.validation.postalCode,
          errorMessage: i18next.t('customer.postalCodeErrorMessage'),
          name: 'postalCode',
          autocomplete: 'text',
          placeholder: i18next.t('customer.postalCodePlaceholder'),
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.city = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${CITY_NODE}`),
        {
          title: i18next.t('customer.city'),
          value: this.state.value.city,
          id: CITY_INPUT_ID,
          error: this.state.interact.city && !this.state.validation.city,
          errorMessage: i18next.t('customer.cityErrorMessage'),
          name: 'city',
          autocomplete: 'text',
          placeholder: i18next.t('customer.cityPlaceholder'),
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.button = new ButtonArrowRight(
        this.node.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`),
        {
          title: i18next.t('customer.proceedButton'),
          id: PROCEED,
          disabled: !(
            this.state.validation.givenName &&
            this.state.validation.surname &&
            this.state.validation.street &&
            this.state.validation.street2 &&
            this.state.validation.postalCode &&
            this.state.validation.city
          ),
          onClick: () => this.onProceed(),
        }
      );
    }

    this.node
      .querySelector('#change-address')
      ?.addEventListener('click', () => this.onChangeAddress());
  }
}

export default FullAddressForm;
