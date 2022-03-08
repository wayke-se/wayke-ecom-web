import InputHelp from '../../Templates/InputHelp';
import { prettyNumber } from '../../Utils/format';
import HtmlNode from '../Extension/HtmlNode';

const formatNumberPretty = (value: string | number, postfix?: string) =>
  prettyNumber(value, { postfix });

const formatFromPretty = (n: string) => parseInt(n.replace(/\D/g, ''), 10).toString();

const respectStep = (value: number, step?: number) => {
  if (!step) return value;

  return Math.round(value / step) * step;
};

interface InputRangeProps {
  title: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  name: string;
  id: string;
  information?: string;
  unit?: string;
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

class InputRange extends HtmlNode {
  private props: InputRangeProps;
  private value: number;
  private inputFieldValue: string;
  private rangeSpan: number;
  private currentValueInPercentage: number;

  constructor(element: HTMLDivElement | null, props: InputRangeProps) {
    super(element);

    this.props = props;
    this.value = props.value;
    this.inputFieldValue = formatNumberPretty(this.value, this.props.unit);
    this.rangeSpan = props.max - props.min;
    this.currentValueInPercentage = parseInt(
      (100 * ((this.value - this.props.min) / this.rangeSpan)).toString(),
      10
    );

    this.render();
  }

  onOpenInformation() {
    const foldout = this.node.querySelector<HTMLDivElement>('.input-label__foldout');
    if (foldout) {
      foldout.style.display = '';
    }
  }

  onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    this.inputFieldValue = currentTarget.value;
  }

  onBlur(e: Event) {
    const inputFieldValueAsNumber = parseInt(this.inputFieldValue.replace(/\D/g, ''), 10);
    if (
      !isNaN(inputFieldValueAsNumber) &&
      inputFieldValueAsNumber >= this.props.min &&
      inputFieldValueAsNumber <= this.props.max
    ) {
      const modifiedNumberInRespectWithSteps = respectStep(
        inputFieldValueAsNumber,
        this.props.step
      );
      this.value = modifiedNumberInRespectWithSteps;
      if (this.props.onChange && e.currentTarget) {
        (e.currentTarget as HTMLInputElement).value = modifiedNumberInRespectWithSteps.toString();
        this.props.onChange(e);
      }

      this.inputFieldValue = formatNumberPretty(this.value, this.props.unit);

      this.render();
    } else {
      this.inputFieldValue = formatNumberPretty(this.value, this.props.unit);
      this.updateInputField();
    }
  }

  onFocus(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    currentTarget.value = formatFromPretty(this.inputFieldValue);
  }

  onInput(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    this.value = parseInt(currentTarget.value, 10);
    this.inputFieldValue = prettyNumber(this.value, { postfix: this.props.unit });

    this.currentValueInPercentage = parseInt(
      (100 * ((this.value - this.props.min) / this.rangeSpan)).toString(),
      10
    );

    this.updateInputField();
    this.updateRangeSliderColor(currentTarget);
  }

  updateRangeSliderColor(element?: HTMLInputElement) {
    const elem = element || this.node.querySelector<HTMLInputElement>(`#${this.props.id}`);
    if (elem) {
      const style = getComputedStyle(elem);
      const currentBackgroundImageBits = style.backgroundImage.split(',');
      currentBackgroundImageBits[3] = currentBackgroundImageBits[3].replace(
        /(?:[1-9]\d?%|0%|100%)/,
        `${this.currentValueInPercentage}%`
      );
      currentBackgroundImageBits[6] = currentBackgroundImageBits[6].replace(
        /(?:[1-9]\d?%|0%|100%)/,
        `${this.currentValueInPercentage}%`
      );

      elem.style.backgroundImage = currentBackgroundImageBits.join(',');
    }
  }

  updateInputField() {
    const inputField = this.node.querySelector<HTMLInputElement>(`#${this.props.id}-input`);
    if (inputField) {
      inputField.value = this.inputFieldValue;
    }
  }

  render() {
    const allowSlider = this.props.min !== this.props.max;

    this.node.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="${this.props.id}" class="waykeecom-input-label__label">${
      this.props.title
    }</label>
        ${
          this.props.information
            ? `${InputHelp()}${this.props.information ? this.props.information : ''}`
            : ''
        }
      </div>
      <div role="range">
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-input-text">
            <input
              type="text"
              id="${this.props.id}-input"
              value="${this.inputFieldValue}"
              name="${this.props.name}"
              autocomplete="off"
              class="waykeecom-input-text__input"
              ${this.props.step === 0 && `disabled=""`}
            />
            ${
              this.props.unit
                ? `<div class="waykeecom-input-text__unit">${this.props.unit}</div>`
                : ''
            }
          </div>
        </div>
        ${
          allowSlider
            ? `
          <div class="waykeecom-stack waykeecom-stack--1">
            <div class="waykeecom-input-range">
              <input
                type="range"
                id="${this.props.id}"
                min="${this.props.min}"
                max="${this.props.max}"
                ${this.props.step !== undefined && `step="${this.props.step}"`}
                value="${this.value}"
                name="${this.props.name}"
                class="waykeecom-input-range__input"
              />
            </div>
          </div>
          `
            : ''
        }
      </div>
    `;

    if (this.props.information) {
      this.node.querySelector('button')?.addEventListener('click', () => this.onOpenInformation());
    }

    if (allowSlider) {
      const inputRange = this.node.querySelector<HTMLInputElement>(`#${this.props.id}`);
      if (inputRange) {
        if (this.props.onChange) {
          inputRange.addEventListener('change', this.props.onChange);
        }
        inputRange.addEventListener('input', (e) => this.onInput(e));
        //setTimeout(() => {
        this.updateRangeSliderColor(inputRange);
        //}, 10);
      }

      const inputField = this.node.querySelector(`#${this.props.id}-input`);
      if (inputField) {
        inputField.addEventListener('change', (e) => this.onChange(e));
        inputField.addEventListener('blur', (e) => this.onBlur(e));
        inputField.addEventListener('focus', (e) => this.onFocus(e));
      }
    }
  }
}

export default InputRange;
