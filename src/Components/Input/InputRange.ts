import HtmlNode from '../Extension/HtmlNode';
import InputInformation from './InputInformation';

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
  disabled?: boolean;
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
  onClickInformation?: (visible: boolean) => void;
}

class InputRange extends HtmlNode {
  private readonly props: InputRangeProps;
  private value: number;
  private inputFieldValue: number;
  private min: number;
  private max: number;
  private rangeSpan: number;
  private isDisabled?: boolean;
  private currentValueInPercentage: number;
  private contexts: {
    rangeSlider?: HTMLInputElement;
  } = {};

  constructor(element: HTMLDivElement | null, props: InputRangeProps) {
    super(element);

    this.props = props;
    this.value = props.value;
    this.min = props.min;
    this.max = props.max;
    this.isDisabled = props.disabled;
    this.inputFieldValue = this.value;
    this.rangeSpan = this.max - this.min;
    this.currentValueInPercentage = parseInt(
      (100 * ((this.value - this.min) / this.rangeSpan)).toString(),
      10
    );

    this.render();
  }

  update(value: number, min: number, max: number) {
    this.value = value;
    this.inputFieldValue = value;
    this.min = min;
    this.max = max;
    this.rangeSpan = max - min;
    this.isDisabled = !this.rangeSpan;
    const percentage = parseInt((100 * ((this.value - min) / this.rangeSpan)).toString(), 10);
    this.currentValueInPercentage = !isNaN(percentage) ? percentage : 0;
    this.render();
  }

  disabled(disabled: boolean) {
    if (this.isDisabled !== disabled) {
      this.isDisabled = disabled;
      this.render();
    }
  }

  onOpenInformation() {
    const foldout = this.node.querySelector<HTMLDivElement>('.input-label__foldout');
    if (foldout) {
      foldout.style.display = '';
    }
  }

  onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    this.inputFieldValue = currentTarget.valueAsNumber;
  }

  onBlur(e: Event) {
    const inputFieldValueAsNumber = this.inputFieldValue;
    if (
      !isNaN(inputFieldValueAsNumber) &&
      inputFieldValueAsNumber >= this.min &&
      inputFieldValueAsNumber <= this.max
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

      this.inputFieldValue = this.value;
      this.currentValueInPercentage = parseInt(
        (100 * ((this.value - this.min) / this.rangeSpan)).toString(),
        10
      );

      this.render();
    } else {
      this.inputFieldValue = this.value;
      this.updateInputField();
    }
  }

  onFocus(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    currentTarget.value = this.value.toString();
  }

  onInput(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    this.value = parseInt(currentTarget.value, 10);
    this.inputFieldValue = this.value;

    this.currentValueInPercentage = parseInt(
      (100 * ((this.value - this.min) / this.rangeSpan)).toString(),
      10
    );

    this.updateInputField();
    this.updateRangeSliderColor(currentTarget);
  }

  updateRangeSliderColor(element?: HTMLInputElement) {
    const elem = element || this.node.querySelector<HTMLInputElement>(`#${this.props.id}`);
    if (elem) {
      elem.style.setProperty('--percentage', `${this.currentValueInPercentage}%`);
    }
  }

  updateInputField() {
    const inputField = this.node.querySelector<HTMLInputElement>(`#${this.props.id}-input`);
    if (inputField) {
      inputField.value = this.inputFieldValue.toString();
    }
  }

  render() {
    const { title, step, name, id, information, unit, onChange, onClickInformation } = this.props;
    const allowSlider = this.min !== this.max;

    this.node.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="${id}" class="waykeecom-input-label__label">${title}</label>
      </div>
      <div role="range">
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-input-text">
            <input
              type="number"
              pattern="[0-9]*"
              id="${id}-input"
              value="${this.inputFieldValue}"
              name="${name}"
              autocomplete="off"
              class="waykeecom-input-text__input"
              ${(step === 0 || this.isDisabled || !allowSlider) && `disabled=""`}
              min="${this.min}"
              max="${this.max}"
              ${step !== undefined && `step="${step}"`}
            />
            ${unit ? `<div class="waykeecom-input-text__unit">${unit}</div>` : ''}
          </div>
        </div>
        ${
          allowSlider
            ? `
            <div class="waykeecom-stack waykeecom-stack--1">
              <div class="waykeecom-input-range">
                <input
                  type="range"
                  id="${id}"
                  min="${this.min}"
                  max="${this.max}"
                  ${step !== undefined && `step="${step}"`}
                  value="${this.value}"
                  name="${name}"
                  class="waykeecom-input-range__input"
                  ${this.isDisabled && `disabled=""`}
                />
              </div>
            </div>
            `
            : ''
        }
      </div>
    `;

    if (information) {
      new InputInformation(this.node.querySelector<HTMLElement>('.waykeecom-input-label'), {
        information,
        onClickInformation,
      });
    }

    if (allowSlider) {
      this.contexts.rangeSlider = this.node.querySelector<HTMLInputElement>(`#${id}`) || undefined;
      if (this.contexts.rangeSlider) {
        if (onChange) {
          this.contexts.rangeSlider.addEventListener('change', onChange);
        }
        this.contexts.rangeSlider.addEventListener('input', (e) => this.onInput(e));
        this.updateRangeSliderColor(this.contexts.rangeSlider);
      }

      const inputField = this.node.querySelector(`#${id}-input`);
      if (inputField) {
        inputField.addEventListener('change', (e) => this.onChange(e));
        inputField.addEventListener('blur', (e) => this.onBlur(e));
      }
    }
  }
}

export default InputRange;
