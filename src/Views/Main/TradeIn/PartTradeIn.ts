import i18next from '@i18n';
import { MarketCode } from '../../../@types/MarketCode';
import { TradeInCarData, TradeInCarDataPartial, VehicleCondition } from '../../../@types/TradeIn';
import { VehicleLookup } from '../../../@types/VehicleLookup';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonAsLink from '../../../Components/Button/ButtonAsLink';
import ButtonSkip from '../../../Components/Button/ButtonSkip';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputField from '../../../Components/Input/InputField';
import InputRadioGroup, { RadioItem } from '../../../Components/Input/InputRadioGroup';
import InputTextarea from '../../../Components/Input/InputTextarea';
import { getTradeInVehicle } from '../../../Data/getTradeInVehicle';
import { setTradeIn } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import Alert from '../../../Templates/Alert';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import { translateTradeInCondition } from '../../../Utils/constants';
import { convertVehicleLookupResponse } from '../../../Utils/convert';
import ecomEvent, { EcomStep, EcomEvent, EcomView } from '../../../Utils/ecomEvent';
import { prettyNumber } from '../../../Utils/format';
import { validationMethods } from '../../../Utils/validationMethods';

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

const PROCEED = 'trade-in-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

const TRADE_IN_NO = 'button-trade-in-no';
const TRADE_IN_NO_NODE = `${TRADE_IN_NO}-node`;

const CHANGE_BUTTON = 'button-trade-in-change';
const CHANGE_BUTTON_NODE = `${CHANGE_BUTTON}-node`;

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

// const TRADE_IN_CACHE: { [key: string]: IVehicle | undefined } = {};

const initalState = (
  tradeIn?: TradeInCarDataPartial,
  marketCode?: MarketCode
): PartTradeInState => {
  const value = {
    registrationNumber: marketCode === 'SE' ? tradeIn?.registrationNumber || '' : '',
    mileage: tradeIn?.mileage || '',
    description: tradeIn?.description || '',
    condition: tradeIn?.condition,
  };
  return {
    value,
    validation: {
      registrationNumber: validation.registrationNumber(value.registrationNumber, marketCode),
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
  readonly marketCode: MarketCode;
}

class PartTradeIn extends HtmlNode {
  private readonly props: PartTradeInProps;
  private state: PartTradeInState;
  private response?: VehicleLookup;
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
    this.state = initalState(state.tradeIn, props.marketCode);
    this.render();
  }

  private async onFetchVehicle() {
    this.requestError = false;
    this.render();

    try {
      ecomEvent(EcomView.MAIN, EcomEvent.TRADE_IN_VALUATION_REQUESTED, EcomStep.TRADE_IN_DETAILS);

      this.contexts.buttonFetch?.loading(true);
      if (
        this.state.validation.registrationNumber &&
        this.state.validation.mileage &&
        this.state.validation.description &&
        this.state.validation.condition
      ) {
        const value = this.state.value as TradeInCarData;
        const scandinavianMileage =
          this.props.marketCode === 'SE' ? value.mileage : String(Number(value.mileage) / 10);
        const _response = await getTradeInVehicle({ ...value, mileage: scandinavianMileage });
        const response = convertVehicleLookupResponse(_response);
        this.response = response;
        this.render();
        ecomEvent(EcomView.MAIN, EcomEvent.TRADE_IN_VALUATION_SUCCEEDED, EcomStep.TRADE_IN_DETAILS);
      }
    } catch (_e) {
      this.requestError = true;
      this.render();
      ecomEvent(EcomView.MAIN, EcomEvent.TRADE_IN_VALUATION_FAILED, EcomStep.TRADE_IN_DETAILS);
    } finally {
      this.contexts.buttonFetch?.loading(false);
    }
  }

  private onEdit() {
    this.response = undefined;
    this.render();
    ecomEvent(EcomView.MAIN, EcomEvent.TRADE_IN_SKIPPED, EcomStep.TRADE_IN_DETAILS);
  }

  private onProceed() {
    if (this.response) {
      const vehicle = this.response.vehicle;
      const value = this.state.value as TradeInCarData;
      setTradeIn(this.props.lastStage, value, vehicle)(this.props.store.dispatch);
      ecomEvent(EcomView.MAIN, EcomEvent.TRADE_IN_SET, EcomStep.TRADE_IN_DETAILS);
    }
  }

  private onChangeRadio(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as INPUT_RADIO_KEYS;
    const value = currentTarget.value as VehicleCondition;

    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);
    this.updateProceedButton();

    switch (value) {
      case VehicleCondition.VeryGood:
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.TRADE_IN_CONDITION_VERY_GOOD_SELECTED,
          EcomStep.TRADE_IN_DETAILS
        );
        break;
      case VehicleCondition.Good:
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.TRADE_IN_CONDITION_GOOD_SELECTED,
          EcomStep.TRADE_IN_DETAILS
        );
        break;
      case VehicleCondition.Ok:
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.TRADE_IN_CONDITION_OK_SELECTED,
          EcomStep.TRADE_IN_DETAILS
        );
        break;
      default:
        break;
    }
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as INPUT_STRING_KEYS;

    if (name === 'registrationNumber') {
      currentTarget.value = currentTarget.value.toUpperCase();
    }

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
    ecomEvent(EcomView.MAIN, EcomEvent.TRADE_IN_SELECTED, EcomStep.TRADE_IN_DETAILS);
  }

  render() {
    if (this.response) {
      const keyValueItemsUpper: { key: string; value: string }[] = [];

      const tradeInVehicle = this.response.vehicle;
      keyValueItemsUpper.push({
        key: i18next.t('tradeIn.mileage'),
        value: `${this.state.value.mileage} mil`,
      });
      if (this.state.value.description) {
        keyValueItemsUpper.push({
          key: i18next.t('tradeIn.description'),
          value: `${this.state.value.description}`,
        });
      }

      if (this.state.value.condition) {
        keyValueItemsUpper.push({
          key: i18next.t('tradeIn.condition'),
          value: translateTradeInCondition[this.state.value.condition],
        });
      }

      this.node.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-balloon">
              <div class="waykeecom-stack waykeecom-stack--05">
                <div class="waykeecom-label">${this.state.value.registrationNumber}</div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--05">
                <span class="waykeecom-text waykeecom-text--font-medium">${
                  tradeInVehicle.manufacturer
                } ${tradeInVehicle.modelSeries}</span>
                ${tradeInVehicle.modelName}, ${tradeInVehicle.modelYear}
              </div>
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--1">
              <ul class="waykeecom-key-value-list">
                ${keyValueItemsUpper.map((kv) => KeyValueListItem(kv)).join('')}
              </ul>
            </div>
            <div class="waykeecom-stack waykeecom-stack--1">
              <div class="waykeecom-align waykeecom-align--end" id="${CHANGE_BUTTON_NODE}"></div>
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--3 waykeecom-text waykeecom-text--align-center">
            <div class="waykeecom-stack waykeecom-stack--1">
              <div class="waykeecom-text waykeecom-text--tone-alt waykeecom-text--size-small">${i18next.t('tradeIn.estimatedValue')}</div>
            </div>
            <div class="waykeecom-stack waykeecom-stack--1">
              <div class="waykeecom-heading waykeecom-heading--2 waykeecom-no-margin">
                ${prettyNumber(tradeInVehicle.valuation, { postfix: 'kr' })}
              </div>
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--3">
            ${Alert({
              tone: 'info',
              children: `<span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('tradeIn.infoText')}</span> ${i18next.t('tradeIn.infoDisclaimer')}`,
            })}
          </div>
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--1" id="${PROCEED_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--1" id="${TRADE_IN_NO_NODE}"></div>
          </div>
      `;

      new ButtonAsLink(this.node.querySelector(`#${CHANGE_BUTTON_NODE}`), {
        id: CHANGE_BUTTON,
        title: i18next.t('tradeIn.changeButtonTitle'),
        onClick: () => this.onEdit(),
      });

      new ButtonArrowRight(this.node.querySelector(`#${PROCEED_NODE}`), {
        title: i18next.t('tradeIn.proceedButton'),
        onClick: () => this.onProceed(),
      });

      new ButtonSkip(this.node.querySelector(`#${TRADE_IN_NO_NODE}`), {
        id: TRADE_IN_NO,
        title: i18next.t('tradeIn.skipButton'),
        onClick: () => this.onNoTradeIn(),
      });
      this.node.parentElement?.parentElement?.scrollIntoView();
    } else {
      this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <h4 class="waykeecom-heading waykeecom-heading--4">${i18next.t('tradeIn.detailsHeading')}</h4>
        <div class="waykeecom-content">
          <p class="waykeecom-content__p">${i18next.t('tradeIn.detailsDescription')}</p>
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
              children: i18next.t('tradeIn.fetchError'),
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
          title: i18next.t('tradeIn.registrationNumber'),
          value: this.state.value.registrationNumber,
          id: REGISTRATION_NUMBER_ID,
          error:
            this.state.interact.registrationNumber && !this.state.validation.registrationNumber,
          errorMessage: i18next.t('tradeIn.registrationNumberError'),
          name: 'registrationNumber',
          autocomplete: 'off',
          placeholder: i18next.t('tradeIn.registrationNumberPlaceholder'),
          unit:
            this.props.marketCode === 'SE'
              ? `
                <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 34" class="waykeecom-input-text__unit-regnr-icon" aria-hidden="true">
                  <rect width="22" height="34" rx="1" fill="#458BDD"/>
                  <circle cx="11" cy="10" r="5.5" stroke="#FFF500" stroke-linejoin="round" stroke-dasharray="1 2"/>
                  <path d="M10.6707 21.692c1.392 0 2.04.564 2.28.996h1.644c-.264-1.08-1.248-2.364-3.924-2.364-2.028 0-3.408.912-3.408 2.436 0 1.536 1.2 2.34 2.904 2.508l1.512.156c.876.108 1.476.372 1.476 1.188 0 .684-.684 1.176-1.98 1.176-1.56 0-2.244-.72-2.472-1.26h-1.716c.336 1.224 1.404 2.628 4.188 2.628 2.412 0 3.624-1.116 3.624-2.652 0-1.8-1.308-2.448-3.012-2.616-.576-.06-.972-.108-1.5-.156-.888-.108-1.392-.444-1.392-1.02 0-.624.612-1.02 1.776-1.02Z" fill="#fff"/>
                </svg>
              `
              : `
                <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 34" class="waykeecom-input-text__unit-regnr-icon" aria-hidden="true">
                  <rect width="22" height="34" rx="1" fill="#003399"/>
                  <rect x="4" y="5" width="14" height="10" fill="#ef2b2d"/>
                  <rect x="7.5" y="5" width="2.5" height="10" fill="#ffffff"/>
                  <rect x="4" y="8.75" width="14" height="2.5" fill="#ffffff"/>
                  <rect x="8.25" y="5" width="1" height="10" fill="#002868"/>
                  <rect x="4" y="9.5" width="14" height="1" fill="#002868"/>
                  <path d="M7.75 21.692v6h1.5v-4.5l3 4.5h1.5v-6h-1.5v4.5l-3-4.5h-1.5Z" fill="#fff"/>
                </svg>`,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.mileage = new InputField(this.node.querySelector(`#${MILEAGE_NODE}`), {
        title: i18next.t('tradeIn.mileage'),
        value: this.state.value.mileage,
        id: MILEAGE_ID,
        error: this.state.interact.mileage && !this.state.validation.mileage,
        errorMessage: i18next.t('tradeIn.mileageError'),
        name: 'mileage',
        autocomplete: 'off',
        placeholder: i18next.t('tradeIn.mileagePlaceholder'),
        unit: this.props.marketCode === 'SE' ? 'mil' : 'km',
        pattern: '[0-9]*',
        inputmode: 'numeric',
        onChange: (e) => this.onChange(e),
        onBlur: (e) => this.onBlur(e),
      });

      this.contexts.description = new InputTextarea(
        this.node.querySelector(`#${DESCRIPTION_NODE}`),
        {
          title: i18next.t('tradeIn.descriptionOptional'),
          value: this.state.value.description,
          id: DESCRIPTION_ID,
          error: this.state.interact.description && !this.state.validation.description,
          errorMessage: i18next.t('tradeIn.descriptionError'),
          name: 'description',
          autocomplete: 'off',
          placeholder: i18next.t('tradeIn.descriptionPlaceholder'),
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      new InputRadioGroup(this.node.querySelector(`#${CONDITION_NODE}`), {
        title: i18next.t('tradeIn.condition'),
        checked: this.state.value.condition as string,
        name: 'condition',
        options: [
          {
            id: `radio-${VehicleCondition.VeryGood}`,
            value: VehicleCondition.VeryGood,
            title: i18next.t('tradeIn.veryGoodCondition'),
            description: `
            <div class="waykeecom-box">
              <div class="waykeecom-content waykeecom-content--inherit-size">
                <ul class="waykeecom-content__ul">
                  <li class="waykeecom-content__li">${i18next.t('tradeIn.noScratches')}</li>
                  <li class="waykeecom-content__li">${i18next.t('tradeIn.serviced')}</li>
                  <li class="waykeecom-content__li">${i18next.t('tradeIn.goodTires')}</li>
                </ul>
              </div>
            </div>`,
          },
          {
            id: `radio-${VehicleCondition.Good}`,
            value: VehicleCondition.Good,
            title: i18next.t('tradeIn.goodCondition'),
            description: `
            <div class="waykeecom-box">
              <div class="waykeecom-content waykeecom-content--inherit-size">
                <ul class="waykeecom-content__ul">
                  <li class="waykeecom-content__li">${i18next.t('tradeIn.someScratches')}</li>
                  <li class="waykeecom-content__li">${i18next.t('tradeIn.serviced')}</li>
                  <li class="waykeecom-content__li">${i18next.t('tradeIn.okTires')}</li>
                </ul>
              </div>
            </div>`,
          },
          {
            id: `radio-${VehicleCondition.Ok}`,
            value: VehicleCondition.Ok,
            title: i18next.t('tradeIn.okCondition'),
            description: `
            <div class="waykeecom-box">
              <div class="waykeecom-content waykeecom-content--inherit-size">
                <ul class="waykeecom-content__ul">
                  <li class="waykeecom-content__li">${i18next.t('tradeIn.manyScratches')}</li>
                  <li class="waykeecom-content__li">${i18next.t('tradeIn.notServiced')}</li>
                  <li class="waykeecom-content__li">${i18next.t('tradeIn.badTires')}</li>
                </ul>
              </div>
            </div>`,
          },
        ],
        onClick: (e) => this.onChangeRadio(e),
      });

      this.contexts.buttonFetch = new ButtonArrowRight(this.node.querySelector(`#${FETCH_NODE}`), {
        title: i18next.t('tradeIn.fetchValue'),
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
        title: i18next.t('tradeIn.skipButton'),
        onClick: () => this.onNoTradeIn(),
      });
    }
  }
}

export default PartTradeIn;
