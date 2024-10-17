import HtmlNode from '../Extension/HtmlNode';
import InputError from './InputError';
import InputInformation from './InputInformation';
import InputRadioField from './InputRadioField';

export interface RadioItem {
  id: string;
  value: string;
  title?: string;
  description?: string;
  meta?: string;
}

interface InputRadioGroupProps {
  readonly title?: string;
  readonly name: string;
  readonly checked?: string;
  readonly options: RadioItem[];
  error?: boolean;
  information?: string;
  readonly errorMessage?: string;
  readonly onClick: (e: Event) => void;
  readonly onClickInformation?: (visible: boolean) => void;
}

class InputRadioGroup extends HtmlNode {
  private readonly props: InputRadioGroupProps;
  private contexts: {
    error?: InputError;
  } = {};

  constructor(element: HTMLElement | null, props: InputRadioGroupProps) {
    super(element);

    this.props = props;
    this.render();
  }

  private updateBorder() {
    const border = this.node.querySelector('.waykeecom-input-text');
    if (border) {
      if (this.props.error) {
        border?.classList.add('waykeecom-input-text--has-error');
      } else {
        border?.classList.remove('waykeecom-input-text--has-error');
      }
    }
  }

  setError(error: boolean) {
    this.props.error = error;
    this.updateBorder();
    this.contexts.error?.setError(error);
  }

  render() {
    const {
      title,
      options,
      name,
      checked,
      error,
      errorMessage,
      information,
      onClick,
      onClickInformation,
    } = this.props;
    this.node.innerHTML = `
     <fieldset class="waykeecom-input-group" role="radiogroup" aria-required="true">
       ${
         title
           ? `<legend class="waykeecom-input-label"><div class="waykeecom-input-label__label">${title}</div></legend>`
           : ''
       }
        ${options
          .map((option) => `<div class="waykeecom-input-group__item" id="${option.id}-node"></div>`)
          .join('')}
      </fieldset>
    `;

    this.updateBorder();
    if (errorMessage) {
      this.contexts.error = new InputError(this.node, {
        error,
        errorMessage,
      });
    }

    options.forEach(
      (option) =>
        new InputRadioField(this.node.querySelector<HTMLDivElement>(`#${option.id}-node`), {
          id: option.id,
          name,
          title: option.title || option.value,
          value: option.value,
          checked: checked === option.value,
          description: option.description,
          meta: option.meta,
          onClick: (e) => onClick(e),
        })
    );

    if (information) {
      new InputInformation(this.node.querySelector<HTMLElement>('.waykeecom-input-label'), {
        information,
        onClickInformation,
      });
    }
  }
}

export default InputRadioGroup;
