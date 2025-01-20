import i18next from 'i18next';
import { Customer, PartialCustomer } from '../../../@types/Customer';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputField from '../../../Components/Input/InputField';
import { goTo, setContactAndPhone } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import ecomEvent, { EcomStep, EcomEvent, EcomView } from '../../../Utils/ecomEvent';
import { validationMethods } from '../../../Utils/validationMethods';

const EMAIL_NODE = 'contact-email-node';
const EMAIL_INPUT_ID = 'contact-email';

const PHONE_NODE = 'contact-phone-node';
const PHONE_INPUT_ID = 'contact-phone';

const PROCEED_NODE = 'contact-proceed-node';
const PROCEED = 'contact-proceed';

const validation = {
  email: validationMethods.requiredEmail,
  phone: validationMethods.requiredTelephone,
};

export interface PartialCustomerValidation {
  email: boolean;
  phone: boolean;
}

interface Part1EmailAndPhoneState {
  value: PartialCustomer;
  validation: PartialCustomerValidation;
  interact: PartialCustomerValidation;
}

const initalState = (customer?: Customer): Part1EmailAndPhoneState => {
  const value = {
    email: customer?.email || '',
    phone: customer?.phone || '',
  };
  return {
    value,
    validation: {
      email: validation.email(value.email),
      phone: validation.phone(value.phone),
    },
    interact: { email: false, phone: false },
  };
};

interface EmailAndPhoneProps {
  readonly store: WaykeStore;
}

class EmailAndPhone extends HtmlNode {
  private readonly props: EmailAndPhoneProps;
  private state: Part1EmailAndPhoneState;
  private contexts: {
    email?: InputField;
    phone?: InputField;
    button?: ButtonArrowRight;
  } = {};

  constructor(element: HTMLDivElement, props: EmailAndPhoneProps) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--2' });
    this.props = props;

    const state = this.props.store.getState();
    this.state = initalState(state.customer);

    this.render();
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof PartialCustomerValidation;

    const value = currentTarget.value;
    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);

    this.updateUiError(name);
    this.updateProceedButton();
  }

  private onBlur(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof PartialCustomerValidation;

    this.state.interact[name] = true;
    this.state.validation[name] = validation[name](this.state.value[name]);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  private updateUiError(name: keyof PartialCustomer) {
    this.contexts[name]?.setError(this.state.interact[name] && !this.state.validation[name]);
  }

  private updateProceedButton() {
    this.contexts.button?.disabled(!this.state.validation.email || !this.state.validation.phone);
  }

  private onProceed() {
    ecomEvent(
      EcomView.MAIN,
      EcomEvent.CUSTOMER_EMAIL_AND_PHONE_SET,
      EcomStep.CUSTOMER_EMAIL_AND_PHONE
    );
    setContactAndPhone({
      email: this.state.value.email.trim(),
      phone: this.state.value.phone.trim(),
    })(this.props.store.dispatch);
  }

  private onChangeContacts() {
    ecomEvent(EcomView.MAIN, EcomEvent.CUSTOMER_EDIT, EcomStep.CUSTOMER_EMAIL_AND_PHONE);
    goTo('main', 1)(this.props.store.dispatch);
  }

  render() {
    const subStage = this.props.store.getState().navigation.subStage;

    if (subStage > 1) {
      const keyValueItems: { key: string; value: string }[] = [
        { key: i18next.t('customer.email'), value: this.state.value.email },
        { key: i18next.t('customer.phone'), value: this.state.value.phone },
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
              <button type="button" title="${i18next.t('customer.changeContactsButton')}" class="waykeecom-link" id="change-contacts">${i18next.t('customer.changeContactsButton')}</button>
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
        <div class="waykeecom-stack waykeecom-stack--2" id="${EMAIL_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${PHONE_NODE}"></div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_NODE}"></div>
    `;

      this.contexts.email = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${EMAIL_NODE}`),
        {
          title: i18next.t('customer.email'),
          value: this.state.value.email,
          id: EMAIL_INPUT_ID,
          error: this.state.interact.email && !this.state.validation.email,
          errorMessage: i18next.t('customer.emailErrorMessage'),
          name: 'email',
          autocomplete: 'email',
          placeholder: i18next.t('customer.emailPlaceholder'),
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.phone = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${PHONE_NODE}`),
        {
          title: i18next.t('customer.phone'),
          value: this.state.value.phone,
          id: PHONE_INPUT_ID,
          error: this.state.interact.phone && !this.state.validation.phone,
          errorMessage: i18next.t('customer.phoneErrorMessage'),
          name: 'phone',
          autocomplete: 'tel',
          placeholder: i18next.t('customer.phonePlaceholder'),
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.button = new ButtonArrowRight(
        this.node.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`),
        {
          title: i18next.t('customer.proceedButton'),
          id: PROCEED,
          disabled: !(this.state.validation.email && this.state.validation.phone),
          onClick: () => this.onProceed(),
        }
      );
    }

    this.node
      .querySelector('#change-contacts')
      ?.addEventListener('click', () => this.onChangeContacts());
  }
}

export default EmailAndPhone;
