import { Customer, PartialCustomer } from '../../../@types/Customer';
import ButtonArrowRight from '../../../Components/ButtonArrowRight';
import InputField from '../../../Components/InputField';
import { setContactAndPhone } from '../../../Redux/action';
import store from '../../../Redux/store';
import EmailHelp from '../../../Templates/EmailHelp';
import { validationMethods } from '../../../Utils/validationMethods';

const EMAIL_INPUT_ID = 'contact-email';
const EMAIL_ERROR_ID = `${EMAIL_INPUT_ID}-error`;

const PHONE_INPUT_ID = 'contact-phone';
const PHONE_ERROR_ID = `${PHONE_INPUT_ID}-error`;

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

class Part1EmailAndPhone {
  private element: HTMLDivElement;
  private state: Part1EmailAndPhoneState;

  constructor(element: HTMLDivElement) {
    this.element = element;

    const state = store.getState();

    this.state = initalState(state.customer);
    this.render();
  }

  onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof PartialCustomerValidation;
    const value = currentTarget.value;

    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  onBlur(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof PartialCustomerValidation;

    this.state.interact[name] = true;
    this.state.validation[name] = validation[name](this.state.value[name]);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  updateUiError(name: keyof PartialCustomer) {
    const errorElement = this.element.querySelector<HTMLDivElement>(`#contact-${name}-error`);
    if (errorElement) {
      if (this.state.interact[name] && !this.state.validation[name]) {
        errorElement.style.display = '';
      } else {
        errorElement.style.display = 'none';
      }
    }
  }

  updateProceedButton() {
    const proceed = this.element.querySelector<HTMLButtonElement>(`#${PROCEED}`);
    if (proceed) {
      if (this.state.validation.email && this.state.validation.phone) {
        proceed.removeAttribute('disabled');
      } else {
        proceed.setAttribute('disabled', '');
      }
    }
  }

  onProceed() {
    setContactAndPhone(this.state.value);
  }

  render() {
    const subStage = store.getState().navigation.subStage;

    if (subStage > 1) {
      this.element.innerHTML = `
        <div class="stack stack--2">
          <ul class="key-value-list">
            <li class="key-value-list__item">
              <div class="key-value-list__key">E-post</div>
              <div class="key-value-list__value">${this.state.value.email}</div>
            </li>
            <li class="key-value-list__item">
              <div class="key-value-list__key">Telefonnummer</div>
              <div class="key-value-list__value">${this.state.value.phone}</div>
            </li>
          </ul>
        </div>
      `;
    } else {
      this.element.innerHTML = `
      <div class="stack stack--3">
        <h4 class="heading heading--4">Kontaktuppgifter</h4>
        <div class="content">
          <p>Ange din e-postadress och ditt telefonnummer.</p>
        </div>
      </div>
      <div class="stack stack--3">
        <div class="stack stack--2" id="emailNode"></div>
        <div class="stack stack--2" id="phoneNode"></div>
      </div>
      <div class="stack stack--3" id="proceedNode"></div>
    `;

      const emailNode = this.element.querySelector<HTMLDivElement>('#emailNode');
      if (emailNode) {
        new InputField(emailNode, {
          title: 'Epost',
          value: this.state.value.email,
          id: EMAIL_INPUT_ID,
          errorId: EMAIL_ERROR_ID,
          error: this.state.interact.email && !this.state.validation.email,
          errorMessage: 'En giltig e-postadress måste anges',
          name: 'email',
          placeholder: 'Ange din e-postadress',
          information: EmailHelp(),
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        });
      }

      const phoneNode = this.element.querySelector<HTMLDivElement>('#phoneNode');
      if (phoneNode) {
        new InputField(phoneNode, {
          title: 'Telefonnummer',
          value: this.state.value.phone,
          id: PHONE_INPUT_ID,
          errorId: PHONE_ERROR_ID,
          error: this.state.interact.phone && !this.state.validation.phone,
          errorMessage: 'Ange ditt telefonnummer',
          name: 'phone',
          placeholder: 'Ange ditt telefonnummer',
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        });
      }

      Object.keys(this.state.value).forEach((key) =>
        this.updateUiError(key as keyof PartialCustomer)
      );

      const proceedNode = this.element.querySelector<HTMLDivElement>('#proceedNode');
      if (proceedNode) {
        new ButtonArrowRight(proceedNode, {
          title: 'Fortsätt',
          id: PROCEED,
          onClick: () => this.onProceed(),
        });
      }

      this.updateProceedButton();
    }
  }
}

export default Part1EmailAndPhone;
