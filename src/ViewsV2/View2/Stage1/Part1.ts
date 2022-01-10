import { Customer } from '../../../@types/Customer';
import store from '../../../Redux/store';
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

interface PartialCustomer {
  email: string;
  phone: string;
}

export interface PartialCustomerValidation {
  email: boolean;
  phone: boolean;
}

interface Part1Stage1State {
  value: PartialCustomer;
  validation: PartialCustomerValidation;
  interact: PartialCustomerValidation;
}

const initalState = (customer?: Customer): Part1Stage1State => {
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

class Part1 {
  private element: HTMLDivElement;
  private state: Part1Stage1State;

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

  attach(element: HTMLInputElement) {
    element.addEventListener('input', (e) => this.onChange(e));
    element.addEventListener('blur', (e) => this.onBlur(e));
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

  render() {
    this.element.innerHTML = `
      <div class="stack stack--3">
        <h4 class="heading heading--4">Kontaktuppgifter</h4>
        <div class="content">
          <p>Ange din e-postadress och ditt telefonnummer.</p>
        </div>
      </div>
      <div class="stack stack--3">
        <div class="stack stack--2">
          <div class="input-label">
            <label for="${EMAIL_INPUT_ID}" class="input-label__label">E-post</label>
            <div class="input-label__help">
              HELP???
            </div>
          </div>
          <input
            type="text"
            id="${EMAIL_INPUT_ID}"
            value="${this.state.value.email}"
            name="email"
            placeholder="Ange din e-postadress"
            class="input-text"
          />
          <div id="${EMAIL_ERROR_ID}" class="input-error">En giltig e-postadress måste anges</div>
        </div>
        <div class="stack stack--2">
          <div class="input-label">
            <label for="${PHONE_INPUT_ID}" class="input-label__label">Telefonnummer</label>
          </div>
          <input
            type="text"
            id="${PHONE_INPUT_ID}"
            value="${this.state.value.phone}"
            name="phone"
            placeholder="Ange ditt telefonnummer"
            class="input-text"
          />
          <div id="${PHONE_ERROR_ID}" class="input-error">Ange ditt telefonnummer</div>
        </div>
      </div>
      <div class="stack stack--3">
        <button type="button" id="${PROCEED}" title="Fortsätt till nästa steg" class="button button--full-width button--action">
          <span class="button__content">Fortsätt</span>
          <span class="button__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="icon"
            >
              <title>Ikon: pil höger</title>
              <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
            </svg>
          </span>
        </button>
      </div>
    `;

    const emailElement = this.element.querySelector<HTMLInputElement>(`#${EMAIL_INPUT_ID}`);
    if (emailElement) {
      this.attach(emailElement);
    }

    const phoneELement = this.element.querySelector<HTMLInputElement>(`#${PHONE_INPUT_ID}`);
    if (phoneELement) {
      this.attach(phoneELement);
    }

    Object.keys(this.state.value).forEach((key) =>
      this.updateUiError(key as keyof PartialCustomer)
    );
    this.updateProceedButton();
  }
}

export default Part1;
