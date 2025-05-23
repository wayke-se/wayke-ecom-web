import i18next from '@i18n';
import Loader from '../../Templates/Loader';
import HtmlNode from '../Extension/HtmlNode';

interface ButtonAddRemoveProps {
  readonly id?: string;
  disabled?: boolean;
  loading?: boolean;
  readonly selected?: boolean;
  readonly fullSize?: boolean;
  readonly onClick?: (e: Event) => void;
}

class ButtonAddRemove extends HtmlNode {
  private readonly props: ButtonAddRemoveProps;

  constructor(element: HTMLDivElement | null, props: ButtonAddRemoveProps) {
    super(element);
    this.props = props;
    this.render();
  }

  isDisabled() {
    return this.props.disabled;
  }

  disabled(disabled: boolean) {
    if (this.props.disabled !== disabled) {
      this.props.disabled = disabled;
      this.render();
    }
  }

  loading(loading: boolean) {
    if (this.props.loading !== loading) {
      this.props.loading = loading;
      this.props.disabled = loading;
      this.render();
    }
  }

  render() {
    const { id, disabled, loading, selected, fullSize, onClick } = this.props;

    const title = selected ? i18next.t('glossary.chosen') : i18next.t('glossary.add');

    const buttonClassName = [
      'waykeecom-button',
      fullSize ? 'waykeecom-button--full-width' : 'waykeecom-button--size-small',
    ];
    if (selected) {
      buttonClassName.push('waykeecom-button--success');
    } else {
      buttonClassName.push('waykeecom-button--action-alt');
    }

    const selectedIcon = selected
      ? '<path d="M12.3 3.3 6 9.6 3.7 7.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l3 3c.4.4 1 .4 1.4 0l7-7c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z"/>'
      : '<path d="M14 7v2H9v5H7V9H2V7h5V2h2v5h5z" />';

    this.node.innerHTML = `
      <button
        type="button"
        ${id ? `id="${id}"` : ''}
        title="${title}"
        ${disabled && `disabled=""`} 
        class="${buttonClassName.join(' ')}"
      >
        <span class="waykeecom-button__content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="waykeecom-icon"
            data-icon="${selected ? 'Check' : 'Plus'}"
          >
            ${selectedIcon}
          </svg>
        </span>
        <span class="waykeecom-button__content">${title}</span>
        ${
          loading
            ? `<span class="waykeecom-button__content">${Loader({ type: 'inline' })}</div>`
            : ''
        }
      </button>
    `;
    if (onClick) {
      this.node.querySelector<HTMLButtonElement>('button')?.addEventListener('click', onClick);
    }
  }
}

export default ButtonAddRemove;
