import { IVehicle } from '@wayke-se/ecom';
import { TradeInCarData, TradeInCarDataPartial, VehicleCondition } from '../../../@types/TradeIn';
import Alert from '../../../Templates/Alert';
import { getTradeInVehicle } from '../../../Data/getTradeInVehicle';
import { setTradeIn } from '../../../Redux/action';
import store from '../../../Redux/store';
import { validationMethods } from '../../../Utils/validationMethods';

const REGISTRATION_NUMBER_INPUT_ID = 'trade-in-registrationNumber';
const REGISTRATION_NUMBER_ERROR_ID = `${REGISTRATION_NUMBER_INPUT_ID}-error`;

const MILEAGE_INPUT_ID = 'trade-in-mileage';
const MILEAGE_ERROR_ID = `${MILEAGE_INPUT_ID}-error`;

const DESCRIPTION_INPUT_ID = 'trade-in-description';
const DESCRIPTION_ERROR_ID = `${DESCRIPTION_INPUT_ID}-error`;

const TRADE_IN_FETCH_ERROR_ID = 'trade-in-fetch-error';

const PROCEED = 'trade-in-proceed';

const validation = {
  registrationNumber: validationMethods.requiredRegistrationNumber,
  mileage: validationMethods.requiredMileage,
  description: validationMethods.optionalString,
  condition: validationMethods.requiredCondition,
};

export interface TradeInValidation {
  registrationNumber: boolean;
  mileage: boolean;
  description: boolean;
  condition: boolean;
}

interface PartTradeInState {
  value: TradeInCarDataPartial;
  validation: TradeInValidation;
  interact: TradeInValidation;
}

const TRADE_IN_CACHE: { [key: string]: IVehicle | undefined } = {};

const initalState = (tradeIn?: TradeInCarDataPartial): PartTradeInState => {
  const value = {
    registrationNumber: tradeIn?.registrationNumber || '',
    mileage: tradeIn?.mileage || '',
    description: tradeIn?.description || '',
    condition: tradeIn?.condition,
  };
  return {
    value,
    validation: {
      registrationNumber: validation.registrationNumber(value.registrationNumber),
      mileage: validation.mileage(value.mileage),
      description: validation.description(value.description),
      condition: validation.condition(value.condition),
    },
    interact: { registrationNumber: false, mileage: false, description: false, condition: false },
  };
};

class PartTradeIn {
  private element: HTMLDivElement;
  private state: PartTradeInState;

  constructor(element: HTMLDivElement) {
    this.element = element;

    const state = store.getState();
    this.state = initalState(state.tradeIn);
    this.render();
  }

  async onFetchVehicle() {
    const errorAlert = document.querySelector<HTMLDivElement>(`#${TRADE_IN_FETCH_ERROR_ID}`);
    if (!errorAlert) return;
    errorAlert.style.display = 'none';

    const proceed = this.element.querySelector<HTMLDivElement>(`#${PROCEED}`);
    if (proceed) {
      const key = `${this.state.value.registrationNumber}-${this.state.value.mileage}-${this.state.value.condition}`;
      const cache = TRADE_IN_CACHE[key];
      if (cache) {
        setTradeIn(this.state.value as TradeInCarData, cache);
        return;
      }

      try {
        if (
          this.state.validation.registrationNumber &&
          this.state.validation.mileage &&
          this.state.validation.description &&
          this.state.validation.condition
        ) {
          const value = this.state.value as TradeInCarData;
          proceed.setAttribute('disabled', '');
          const response = await getTradeInVehicle(value);
          const vehicle = response.getVehicle();
          TRADE_IN_CACHE[key] = vehicle;
          setTradeIn(value, vehicle);
        }
      } catch (e) {
        errorAlert.style.display = '';
      } finally {
        proceed.removeAttribute('disabled');
      }
    }
  }

  onChangeRadio(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof Omit<
      TradeInValidation,
      'registrationNumber' | 'mileage' | 'description'
    >;
    const value = currentTarget.value as VehicleCondition;

    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);
    this.updateProceedButton();
  }

  onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof Omit<TradeInValidation, 'condition'>;
    const value = currentTarget.value;

    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  onBlur(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof Omit<TradeInValidation, 'condition'>;

    this.state.interact[name] = true;
    this.state.validation[name] = validation[name](this.state.value[name]);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  attach(element: HTMLInputElement) {
    element.addEventListener('input', (e) => this.onChange(e));
    element.addEventListener('blur', (e) => this.onBlur(e));
  }

  updateUiError(name: keyof TradeInCarDataPartial) {
    const errorElement = this.element.querySelector<HTMLDivElement>(`#trade-in-${name}-error`);
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
      if (
        this.state.validation.registrationNumber &&
        this.state.validation.mileage &&
        this.state.validation.description &&
        this.state.validation.condition
      ) {
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
            <label for="${REGISTRATION_NUMBER_INPUT_ID}" class="input-label__label input-label__label--is-required">Registreringsnummer</label>
          </div>
          <input
            type="text"
            id="${REGISTRATION_NUMBER_INPUT_ID}"
            value="${this.state.value.registrationNumber}"
            name="registrationNumber"
            placeholder="Ange registreringsnummer"
            class="input-text"
          />
          <div id="${REGISTRATION_NUMBER_ERROR_ID}" class="input-error">En giltig registreringsnummer i formatet ABC123 eller ABC12A måste anges</div>
        </div>
        <div class="stack stack--2">
          <div class="input-label">
            <label for="${MILEAGE_INPUT_ID}" class="input-label__label">Miltal</label>
          </div>
          <input
            type="text"
            id="${MILEAGE_INPUT_ID}"
            value="${this.state.value.mileage}"
            name="mileage"
            placeholder="Ange bilens miltal"
            class="input-text"
          />
          <div id="${MILEAGE_ERROR_ID}" class="input-error">Ett miltal mellan 0 - 80000 mil måste anges</div>
        </div>
        <div class="stack stack--2">
          <div class="input-label">
            <label for="${DESCRIPTION_INPUT_ID}" class="input-label__label">Beskrivning(valfritt)</label>
          </div>
          <input
            type="text"
            id="${DESCRIPTION_INPUT_ID}"
            value="${this.state.value.mileage}"
            name="mileage"
            placeholder="Ange bilens miltal"
            class="input-text"
          />
          <div id="${DESCRIPTION_ERROR_ID}" class="input-error">????</div>
        </div>
        <div class="stack stack--2">
          <div>
            <input type="radio" id="radio-${VehicleCondition.VeryGood}" name="condition" value="${
      VehicleCondition.VeryGood
    }">
            <label for="radio-${VehicleCondition.VeryGood}">Mycket bra skick</label>
          </div>
          <div>
            <input type="radio" id="radio-${VehicleCondition.Good}" name="condition" value="${
      VehicleCondition.Good
    }">
            <label for="radio-${VehicleCondition.Good}">Bra skick</label>
          </div>
          <div>
            <input type="radio" id="radio-${VehicleCondition.Ok}" name="condition" value="${
      VehicleCondition.Ok
    }">
            <label for="radio-${VehicleCondition.Ok}">Bra skick</label>
          </div>
        </div>
      </div>

      <div class="stack stack--3" style="display:none;" id="${TRADE_IN_FETCH_ERROR_ID}">
        ${Alert({
          tone: 'error',
          children: '<p>Tyvärr fick vi ingen träff på personnumret du angav.</p>',
        })}
      </div>
      <div class="stack stack--3">
        <button type="button" id="${PROCEED}" title="Fortsätt till nästa steg" class="button button--full-width button--action">
          <span class="button__content">Gå</span>
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

    const registrationNumberElement = this.element.querySelector<HTMLInputElement>(
      `#${REGISTRATION_NUMBER_INPUT_ID}`
    );
    if (registrationNumberElement) {
      this.attach(registrationNumberElement);
    }

    const mileageElement = this.element.querySelector<HTMLInputElement>(`#${MILEAGE_INPUT_ID}`);
    if (mileageElement) {
      this.attach(mileageElement);
    }

    const descriptionElement = this.element.querySelector<HTMLInputElement>(
      `#${DESCRIPTION_INPUT_ID}`
    );
    if (descriptionElement) {
      this.attach(descriptionElement);
    }

    const radioElements = this.element.querySelectorAll<HTMLInputElement>(
      `#radio-${VehicleCondition.VeryGood}, #radio-${VehicleCondition.Good}, #radio-${VehicleCondition.Ok}`
    );
    if (radioElements) {
      radioElements.forEach((radio) => {
        if (this.state.value.condition === radio.value) {
          radio.setAttribute('checked', '');
        }
        radio.addEventListener('click', (e) => this.onChangeRadio(e));
      });
    }

    Object.keys(this.state.value).forEach((key) =>
      this.updateUiError(key as keyof TradeInCarDataPartial)
    );

    const proceed = this.element.querySelector<HTMLButtonElement>(`#${PROCEED}`);
    if (proceed) {
      proceed.addEventListener('click', () => this.onFetchVehicle());
    }

    this.updateProceedButton();
  }
}

export default PartTradeIn;
