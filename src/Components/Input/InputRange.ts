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
  private props: InputRangeProps;
  private value: number;
  private inputFieldValue: number;
  private rangeSpan: number;
  private currentValueInPercentage: number;
  private contexts: {
    rangeSlider?: HTMLInputElement;
  } = {};

  constructor(element: HTMLDivElement | null, props: InputRangeProps) {
    super(element);

    this.props = props;
    this.value = props.value;
    this.inputFieldValue = this.value;
    this.rangeSpan = props.max - props.min;
    this.currentValueInPercentage = parseInt(
      (100 * ((this.value - this.props.min) / this.rangeSpan)).toString(),
      10
    );

    this.render();
  }

  disabled(disabled: boolean) {
    if (this.props.disabled !== disabled) {
      this.props.disabled = disabled;
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

      this.inputFieldValue = this.value;
      this.currentValueInPercentage = parseInt(
        (100 * ((this.value - this.props.min) / this.rangeSpan)).toString(),
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
      inputField.value = this.inputFieldValue.toString();
    }
  }

  render() {
    const {
      title,
      min,
      max,
      step,
      name,
      id,
      information,
      unit,
      disabled,
      onChange,
      onClickInformation,
    } = this.props;
    const allowSlider = min !== max;

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
              ${(step === 0 || disabled) && `disabled=""`}
              min="${min}"
              max="${max}"
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
                  min="${min}"
                  max="${max}"
                  ${step !== undefined && `step="${step}"`}
                  value="${this.value}"
                  name="${name}"
                  class="waykeecom-input-range__input"
                  ${disabled && `disabled=""`}
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
