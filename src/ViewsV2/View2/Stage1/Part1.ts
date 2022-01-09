import { Customer } from '../../../@types/Customer';
import store from '../../../Redux/store';
import { validationMethods } from '../../../Utils/validationMethods';

const EMAIL_INPUT_ID = 'contact-email';
const EMAIL_ERROR_ID = `${EMAIL_INPUT_ID}-error`;

const PHONE_INPUT_ID = 'contact-phone';
const PHONE_ERROR_ID = `${PHONE_INPUT_ID}-error`;

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
    `;

    Object.keys(this.state.value).forEach((key) => {
      const name = key as keyof PartialCustomer;
      const errorElement = this.element.querySelector<HTMLDivElement>(`#${EMAIL_INPUT_ID}-error`);
      if (errorElement) {
        if (this.state.interact[name] && !this.state.validation[name]) {
          errorElement.style.display = '';
        } else {
          errorElement.style.display = 'none';
        }
      }
    });
  }
}

export default Part1;
