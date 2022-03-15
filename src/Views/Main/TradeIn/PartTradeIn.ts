import { IVehicle } from '@wayke-se/ecom';
import { TradeInCarData, TradeInCarDataPartial, VehicleCondition } from '../../../@types/TradeIn';
import Alert from '../../../Templates/Alert';
import { getTradeInVehicle } from '../../../Data/getTradeInVehicle';
import { setTradeIn } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import { validationMethods } from '../../../Utils/validationMethods';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import InputField from '../../../Components/Input/InputField';
import InputTextarea from '../../../Components/Input/InputTextarea';
import ButtonSkip from '../../../Components/Button/ButtonSkip';
import InputRadioGroup from '../../../Components/Input/InputRadioGroup';
import HtmlNode from '../../../Components/Extension/HtmlNode';

const REGISTRATION_NUMBER_ID = 'trade-in-registrationNumber';
const REGISTRATION_NUMBER_NODE = `${REGISTRATION_NUMBER_ID}-node`;

const MILEAGE_ID = 'trade-in-mileage';
const MILEAGE_NODE = `${MILEAGE_ID}-node`;

const DESCRIPTION_ID = 'trade-in-description';
const DESCRIPTION_NODE = `${DESCRIPTION_ID}-node`;

const CONDITION_ID = 'trade-in-condition';
const CONDITION_NODE = `${CONDITION_ID}-node`;

const FETCH = 'trade-in-fetch';
const FETCH_NODE = `${FETCH}-node`;

const TRADE_IN_NO = 'button-trade-in-no';
const TRADE_IN_NO_NODE = `${TRADE_IN_NO}-node`;

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

type INPUT_STRING_KEYS = keyof Omit<TradeInValidation, 'condition'>;
type INPUT_RADIO_KEYS = keyof Omit<
  TradeInValidation,
  'registrationNumber' | 'mileage' | 'description'
>;

const TRADE_IN_CACHE: { [key: string]: IVehicle | undefined } = {};

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
    title: 'Helt okej skick',
  },
];
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

interface PartTradeInProps {
  readonly store: WaykeStore;
  readonly lastStage: boolean;
}

class PartTradeIn extends HtmlNode {
  private readonly props: PartTradeInProps;
  private state: PartTradeInState;
  private contexts: {
    registrationNumber?: InputField;
    mileage?: InputField;
    description?: InputTextarea;
    buttonFetch?: ButtonArrowRight;
  } = {};
  private requestError = false;

  constructor(element: HTMLElement, props: PartTradeInProps) {
    super(element);
    this.props = props;

    const state = this.props.store.getState();
    this.state = initalState(state.tradeIn);
    this.render();
  }

  private async onFetchVehicle() {
    this.requestError = false;
    this.render();

    const key = `${this.state.value.registrationNumber}-${this.state.value.mileage}-${this.state.value.condition}`;
    const cache = TRADE_IN_CACHE[key];
    if (cache) {
      setTradeIn(
        this.props.lastStage,
        this.state.value as TradeInCarData,
        cache
      )(this.props.store.dispatch);
      return;
    }

    try {
      this.contexts.buttonFetch?.loading(true);
      if (
        this.state.validation.registrationNumber &&
        this.state.validation.mileage &&
        this.state.validation.description &&
        this.state.validation.condition
      ) {
        const value = this.state.value as TradeInCarData;
        const response = await getTradeInVehicle(value);
        const vehicle = response.getVehicle();
        TRADE_IN_CACHE[key] = vehicle;
        setTradeIn(this.props.lastStage, value, vehicle)(this.props.store.dispatch);
      }
    } catch (e) {
      this.requestError = true;
      this.render();
    } finally {
      this.contexts.buttonFetch?.loading(false);
    }
  }

  private onChangeRadio(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as INPUT_RADIO_KEYS;
    const value = currentTarget.value as VehicleCondition;

    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);
    this.updateProceedButton();
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as INPUT_STRING_KEYS;
    const value = currentTarget.value;

    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  private onBlur(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as INPUT_STRING_KEYS;

    this.state.interact[name] = true;
    this.state.validation[name] = validation[name](this.state.value[name]);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  private updateUiError(name: INPUT_STRING_KEYS) {
    this.contexts[name]?.setError(this.state.interact[name] && !this.state.validation[name]);
  }

  private updateProceedButton() {
    this.contexts.buttonFetch?.disabled(
      !(
        this.state.validation.registrationNumber &&
        this.state.validation.mileage &&
        this.state.validation.description &&
        this.state.validation.condition
      )
    );
  }

  private onNoTradeIn() {
    setTradeIn(this.props.lastStage)(this.props.store.dispatch);
  }

  render() {
    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <h4 class="waykeecom-heading waykeecom-heading--4">Uppgifter om din inbytesbil</h4>
        <div class="waykeecom-content">
          <p>Ange registreringsnumret och aktuellt miltal för din inbytesbil så får du ett uppskattat inköpspris av oss. </p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2" id="${REGISTRATION_NUMBER_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${MILEAGE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${DESCRIPTION_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${CONDITION_NODE}"></div>
      </div>
      ${
        this.requestError
          ? `<div class="waykeecom-stack waykeecom-stack--3">${Alert({
              tone: 'error',
              children:
                '<p>Tyvärr fick vi ingen träff på registreringsnummret du angav. Vänligen kontrollera att registreringsnummret stämmer.</p>',
            })}</div>`
          : ''
      }
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--1" id="${FETCH_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--1" id="${TRADE_IN_NO_NODE}"></div>
      </div>
    `;

    this.contexts.registrationNumber = new InputField(
      this.node.querySelector(`#${REGISTRATION_NUMBER_NODE}`),
      {
        title: 'Registreringsnummer',
        value: this.state.value.registrationNumber,
        id: REGISTRATION_NUMBER_ID,
        error: this.state.interact.registrationNumber && !this.state.validation.registrationNumber,
        errorMessage: 'Ett giltig registreringsnummer i formatet ABC123 eller ABC12A måste anges',
        name: 'registrationNumber',
        autocomplete: 'off',
        placeholder: 'Ange registreringsnummer',
        unit: `
          <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 34" class="waykeecom-input-text__unit-regnr-icon" aria-hidden="true">
            <rect width="22" height="34" rx="1" fill="#458BDD"/>
            <circle cx="11" cy="10" r="5.5" stroke="#FFF500" stroke-linejoin="round" stroke-dasharray="1 2"/>
            <path d="M10.6707 21.692c1.392 0 2.04.564 2.28.996h1.644c-.264-1.08-1.248-2.364-3.924-2.364-2.028 0-3.408.912-3.408 2.436 0 1.536 1.2 2.34 2.904 2.508l1.512.156c.876.108 1.476.372 1.476 1.188 0 .684-.684 1.176-1.98 1.176-1.56 0-2.244-.72-2.472-1.26h-1.716c.336 1.224 1.404 2.628 4.188 2.628 2.412 0 3.624-1.116 3.624-2.652 0-1.8-1.308-2.448-3.012-2.616-.576-.06-.972-.108-1.5-.156-.888-.108-1.392-.444-1.392-1.02 0-.624.612-1.02 1.776-1.02Z" fill="#fff"/>
          </svg>
        `,
        onChange: (e) => this.onChange(e),
        onBlur: (e) => this.onBlur(e),
      }
    );

    this.contexts.mileage = new InputField(this.node.querySelector(`#${MILEAGE_NODE}`), {
      title: 'Miltal',
      value: this.state.value.mileage,
      id: MILEAGE_ID,
      error: this.state.interact.mileage && !this.state.validation.mileage,
      errorMessage: 'Ett miltal mellan 0 till 80 000 mil måste anges',
      name: 'mileage',
      autocomplete: 'off',
      placeholder: 'Ange bilens miltal',
      unit: 'mil',
      onChange: (e) => this.onChange(e),
      onBlur: (e) => this.onBlur(e),
    });

    this.contexts.description = new InputTextarea(this.node.querySelector(`#${DESCRIPTION_NODE}`), {
      title: 'Beskrivning (valfritt)',
      value: this.state.value.description,
      id: DESCRIPTION_ID,
      error: this.state.interact.description && !this.state.validation.description,
      errorMessage: '????',
      name: 'description',
      autocomplete: 'off',
      placeholder: 'Beskriv bilen',
      onChange: (e) => this.onChange(e),
      onBlur: (e) => this.onBlur(e),
    });

    new InputRadioGroup(this.node.querySelector(`#${CONDITION_NODE}`), {
      title: 'Bilens skick',
      checked: this.state.value.condition as string,
      name: 'condition',
      options: RadioElements,
      onClick: (e) => this.onChangeRadio(e),
    });

    this.contexts.buttonFetch = new ButtonArrowRight(this.node.querySelector(`#${FETCH_NODE}`), {
      title: 'Hämta uppskattat värde',
      id: FETCH,
      disabled: !(
        this.state.validation.registrationNumber &&
        this.state.validation.mileage &&
        this.state.validation.condition
      ),
      onClick: () => this.onFetchVehicle(),
    });

    new ButtonSkip(this.node.querySelector(`#${TRADE_IN_NO_NODE}`), {
      id: TRADE_IN_NO,
      title: 'Hoppa över detta steg',
      onClick: () => this.onNoTradeIn(),
    });
  }
}

export default PartTradeIn;
