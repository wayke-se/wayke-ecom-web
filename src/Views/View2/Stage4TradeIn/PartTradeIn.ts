import { IVehicle } from '@wayke-se/ecom';
import { TradeInCarData, TradeInCarDataPartial, VehicleCondition } from '../../../@types/TradeIn';
import Alert from '../../../Templates/Alert';
import { getTradeInVehicle } from '../../../Data/getTradeInVehicle';
import { setTradeIn } from '../../../Redux/action';
import store from '../../../Redux/store';
import { validationMethods } from '../../../Utils/validationMethods';
import ButtonArrowRight from '../../../Components/ButtonArrowRight';
import InputField from '../../../Components/InputField';
import InputRadioField from '../../../Components/InputRadioField';

const REGISTRATION_NUMBER_INPUT_ID = 'trade-in-registrationNumber';
const REGISTRATION_NUMBER_ERROR_ID = `${REGISTRATION_NUMBER_INPUT_ID}-error`;
const REGISTRATION_NUMBER_INPUT_ID_NODE = `${REGISTRATION_NUMBER_INPUT_ID}-node`;

const MILEAGE_INPUT_ID = 'trade-in-mileage';
const MILEAGE_ERROR_ID = `${MILEAGE_INPUT_ID}-error`;
const MILEAGE_INPUT_ID_NODE = `${MILEAGE_INPUT_ID}-node`;

const DESCRIPTION_INPUT_ID = 'trade-in-description';
const DESCRIPTION_ERROR_ID = `${DESCRIPTION_INPUT_ID}-error`;
const DESCRIPTION_INPUT_ID_NODE = `${DESCRIPTION_ERROR_ID}-node`;

const TRADE_IN_FETCH_ERROR_ID = 'trade-in-fetch-error';

const PROCEED = 'trade-in-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

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
    const RadioElements = [
      {
        id: `radio-${VehicleCondition.VeryGood}`,
        value: VehicleCondition.VeryGood,
        title: 'Mycket bra skick',
      },
      {
        id: `radio-${VehicleCondition.Good}`,
        value: VehicleCondition.Good,
        title: 'Bra skick',
      },
      {
        id: `radio-${VehicleCondition.Ok}`,
        value: VehicleCondition.Ok,
        title: 'Ok skick',
      },
    ];

    this.element.innerHTML = `
      <div class="stack stack--3">
        <h4 class="heading heading--4">Kontaktuppgifter</h4>
        <div class="content">
          <p>Ange din e-postadress och ditt telefonnummer.</p>
        </div>
      </div>
      <div class="stack stack--3">
        <div class="stack stack--2" id="${REGISTRATION_NUMBER_INPUT_ID_NODE}"></div>
        <div class="stack stack--2" id="${MILEAGE_INPUT_ID_NODE}"></div>
        <div class="stack stack--2" id="${DESCRIPTION_INPUT_ID_NODE}"></div>
        <div class="stack stack--2">
          <fieldset class="input-group">
            <legend class="input-group__legend">Bilens skick</legend>
            ${RadioElements.map(
              (radio) => `<div class="input-group__item" id="${radio.id}-node"></div>`
            ).join('')}
          </fieldset>
        </div>
      </div>

      <div class="stack stack--3" style="display:none;" id="${TRADE_IN_FETCH_ERROR_ID}">
        ${Alert({
          tone: 'error',
          children: '<p>Tyvärr fick vi ingen träff på personnumret du angav.</p>',
        })}
      </div>
      <div class="stack stack--3" id="${PROCEED_NODE}"></div>
    `;

    new InputField(
      this.element.querySelector<HTMLDivElement>(`#${REGISTRATION_NUMBER_INPUT_ID_NODE}`),
      {
        title: 'Registreringsnummer',
        value: this.state.value.registrationNumber,
        id: REGISTRATION_NUMBER_INPUT_ID,
        errorId: REGISTRATION_NUMBER_ERROR_ID,
        error: this.state.interact.registrationNumber && !this.state.validation.registrationNumber,
        errorMessage: 'En giltig registreringsnummer i formatet ABC123 eller ABC12A måste anges',
        name: 'registrationNumber',
        placeholder: 'Ange registreringsnummer',
        onChange: (e) => this.onChange(e),
        onBlur: (e) => this.onBlur(e),
      }
    );

    new InputField(this.element.querySelector<HTMLDivElement>(`#${MILEAGE_INPUT_ID_NODE}`), {
      title: 'Miltal',
      value: this.state.value.mileage,
      id: MILEAGE_INPUT_ID,
      errorId: MILEAGE_ERROR_ID,
      error: this.state.interact.mileage && !this.state.validation.mileage,
      errorMessage: 'Ett miltal mellan 0 - 80000 mil måste anges',
      name: 'mileage',
      placeholder: 'Ange bilens miltal',
      onChange: (e) => this.onChange(e),
      onBlur: (e) => this.onBlur(e),
    });

    new InputField(this.element.querySelector<HTMLDivElement>(`#${DESCRIPTION_INPUT_ID_NODE}`), {
      title: 'Beskrivning(valfritt)',
      value: this.state.value.description,
      id: DESCRIPTION_INPUT_ID,
      errorId: DESCRIPTION_ERROR_ID,
      error: this.state.interact.description && !this.state.validation.description,
      errorMessage: '????',
      name: 'description',
      placeholder: 'Beskriv bilen',
      onChange: (e) => this.onChange(e),
      onBlur: (e) => this.onBlur(e),
    });

    RadioElements.forEach((radio) => {
      new InputRadioField(this.element.querySelector<HTMLInputElement>(`#${radio.id}-node`), {
        id: radio.id,
        name: 'condition',
        title: radio.title,
        value: radio.value,
        checked: this.state.value.condition === radio.value,
        onClick: (e) => this.onChangeRadio(e),
      });
    });

    Object.keys(this.state.value).forEach((key) =>
      this.updateUiError(key as keyof TradeInCarDataPartial)
    );

    new ButtonArrowRight(this.element.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
      title: 'Hämta uppskattat värde',
      id: PROCEED,
      onClick: () => this.onFetchVehicle(),
    });

    this.updateProceedButton();
  }
}

export default PartTradeIn;
