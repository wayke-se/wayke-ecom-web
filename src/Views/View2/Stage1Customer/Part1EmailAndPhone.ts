import { Customer, PartialCustomer } from '../../../@types/Customer';
import { setContactAndPhone } from '../../../Redux/action';
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
        <div class="stack stack--2">
          <div class="input-label">
            <label for="${EMAIL_INPUT_ID}" class="input-label__label input-label__label--is-required">E-post</label>
            <div class="input-label__help">
              <button class="input-label__help-btn" title="Vad betyder detta?">
                <span class="sr-only">Visa hjälp</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  class="icon"
                  aria-hidden="true"
                >
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm-1.4-3.8h1.9V12H6.6v-1.8zm3.8-3.4c0 1-.5 1.5-1.4 2l-.4.3c-.3.1-.3.2-.3.4v.1H6.7v-.3c0-.6.1-.9.8-1.3l.7-.4c.3-.2.6-.4.6-.8s-.3-.7-.7-.7c-.5 0-.8.3-.8.8v.3H5.7v-.4c0-1.2.8-2 2.3-2 1.5 0 2.4.7 2.4 2z" />
                </svg>
                <!--
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  class="icon"
                  aria-hidden="true"
                >
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm3.5-8.1L9.4 8l2.1 2.1-1.4 1.4L8 9.4l-2.1 2.1-1.4-1.4L6.6 8 4.5 5.9l1.4-1.4L8 6.6l2.1-2.1 1.4 1.4z" />
                </svg>
                -->
              </button>
            </div>
            <div class="input-label__foldout">
              <p><strong>Hur mycket av dina egna pengar vill du lägga?</strong></p>
              <p>Kontantinsatsen är en del av bilens pris som du betalar med egna pengar. Den behöver vara minst 20% av priset på bilen. Kontantinsatsen betalar du senare i samband med avtalsskrivning hos handlaren.</p>
              <p>Ifall du har en inbytesbil kan du betala kontantinsatsen med den. Detta kommer du överens om tillsammans med handlaren vid avtalsskrivning. </p>
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

      const proceed = this.element.querySelector<HTMLButtonElement>(`#${PROCEED}`);
      if (proceed) {
        proceed.addEventListener('click', () => this.onProceed());
      }

      this.updateProceedButton();
    }
  }
}

export default Part1EmailAndPhone;
