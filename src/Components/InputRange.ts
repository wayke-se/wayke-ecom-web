import InputHelp from '../Templates/InputHelp';
import { prettyNumber } from '../Utils/format';

const formatNumberPretty = (value: string | number, postfix?: string) =>
  prettyNumber(value, { postfix });

const formatFromPretty = (n: string) => parseInt(n.replace(/\D/g, ''), 10).toString();

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

class InputRange {
  private element: HTMLDivElement;
  private props: InputRangeProps;
  private value: number;
  private inputFieldValue: string;

  constructor(element: HTMLDivElement | null, props: InputRangeProps) {
    if (!element) throw `No element provided to InputField`;
    this.element = element;
    this.props = props;
    this.value = props.value;
    this.inputFieldValue = formatNumberPretty(this.value, this.props.unit);
    this.render();
  }

  onOpenInformation() {
    const foldout = this.element.querySelector<HTMLDivElement>('.input-label__foldout');
    if (foldout) {
      foldout.style.display = '';
    }
  }

  onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    this.inputFieldValue = currentTarget.value;
  }

  onBlur(e: Event) {
    const inputFieldValueAsNumber = parseInt(this.inputFieldValue, 10);
    if (
      !isNaN(inputFieldValueAsNumber) &&
      inputFieldValueAsNumber >= this.props.min &&
      inputFieldValueAsNumber <= this.props.max
    ) {
      this.value = inputFieldValueAsNumber;
      if (this.props.onChange) {
        this.props.onChange(e);
      }
      this.inputFieldValue = formatNumberPretty(this.inputFieldValue, this.props.unit);
      this.render();
    } else {
      this.inputFieldValue = formatNumberPretty(this.inputFieldValue, this.props.unit);
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
    this.updateInputField();
  }

  updateInputField() {
    const inputField = this.element.querySelector<HTMLInputElement>(`#${this.props.id}-input`);
    if (inputField) {
      inputField.value = this.inputFieldValue;
    }
  }

  render() {
    const useResidual = this.props.min !== this.props.max;

    this.element.innerHTML = `
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
      <div class="waykeecom-stack waykeecom-stack--1">
        <div class="waykeecom-input-text">
          <input
            type="text"
            id="${this.props.id}-input"
            value="${this.inputFieldValue}"
            name="${this.props.name}"
            class="waykeecom-input-text__input"
          />
          ${
            this.props.unit
              ? `<div class="waykeecom-input-text__unit">${this.props.unit}</div>`
              : ''
          }
        </div>
      </div>
      ${
        useResidual
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
    `;

    if (this.props.information) {
      this.element
        .querySelector('button')
        ?.addEventListener('click', () => this.onOpenInformation());
    }

    if (useResidual) {
      const inputRange = this.element.querySelector(`#${this.props.id}`);
      if (inputRange) {
        if (this.props.onChange) {
          inputRange.addEventListener('change', this.props.onChange);
        }
        inputRange.addEventListener('input', (e) => this.onInput(e));
      }

      const inputField = this.element.querySelector(`#${this.props.id}-input`);
      if (inputField) {
        inputField.addEventListener('change', (e) => this.onChange(e));
        inputField.addEventListener('blur', (e) => this.onBlur(e));
        inputField.addEventListener('focus', (e) => this.onFocus(e));
      }
    }
  }
}

export default InputRange;
