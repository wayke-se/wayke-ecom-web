// import Attach from '../Extension/Attach';
import Loader from '../../Templates/Loader';
import HtmlNode, { HtmlNodeSettings } from '../Extension/HtmlNode';

interface ButtonBankIdProps {
  title: string;
  id?: string;
  disabled?: boolean;
  loading?: boolean;
  htmlNodesettings?: HtmlNodeSettings;
  onClick?: (e: Event) => void;
}

class ButtonBankId extends HtmlNode {
  private props: ButtonBankIdProps;

  constructor(element: HTMLElement | null, props: ButtonBankIdProps) {
    super(element, props.htmlNodesettings);
    this.props = props;
    this.render();
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
    const { title, id, disabled, loading, onClick } = this.props;
    this.node.innerHTML = `
      <button
        type="button"
        ${id ? `id="${id}"` : ''}
        title="${title}"
        ${disabled && `disabled=""`}
        class="waykeecom-button waykeecom-button--full-width waykeecom-button--action"
      >
        <span class="waykeecom-button__content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="waykeecom-icon"
          >
            <title>Ikon: BankId</title>
            <path d="M4.6 11.3h-4c.1-.5 1.1-6.8 1.1-7.2h.7c.5 0 .9-.2 1.1-.6.2-.3.1-.7-.2-.9 0-.1-.1-.2-.1-.3 0-.2.4-.5.9-.5.3 0 .5.1.7.2.1 0 .1.1.1.2s-.2.3-.3.4c-.6.4-.5.8-.5 1 .1.3.6.5.9.5h.7L5 8.3c-.2 1.6-.4 2.8-.4 3zm-2.3 2.8c.4.1.5.4.5.7-.1.5-.5.8-1 .8H0l.4-2.8H2c.7 0 .9.4.8.7 0 .2-.2.4-.5.6zm-.4.6c0-.2-.1-.4-.4-.4h-.3l-.2.9h.3c.4 0 .5-.2.6-.5zm.1-1.1c0-.2-.1-.4-.4-.4h-.3l-.1.7h.3c.3 0 .5-.1.5-.3zm9.2 2h1l.4-2.8h-1l-.4 2.8zm-1.1-2.2-.8.7.2-1.4h-.8l-.4 2.8h.8l.2-1 .6 1H11l-.8-1.2 1-.9h-1.1zM5.3 15l-.2.6c-.4 0-.6 0-.7-.2-.2.1-.5.2-.7.2-.5 0-.6-.2-.6-.5 0-.1.1-.3.2-.4.3-.2.9-.3 1.2-.4 0-.2-.1-.3-.3-.3-.3 0-.5.1-.9.4l.1-.6c.3-.2.7-.4 1.1-.4.5 0 .9.2.8.7l-.1.6c-.1.3-.1.3.1.3zm-1-.4c-.2.1-.6.1-.7.4 0 .1.1.2.2.2s.3-.1.4-.1v-.2l.1-.3zm11.4-.4c-.1.6-.6 1.3-1.5 1.3h-1.6l.4-2.8h1.4c1.1.1 1.4.9 1.3 1.5zm-1.5-.7h-.3l-.2 1.5h.3c.5 0 .7-.2.8-.7 0-.5-.1-.8-.6-.8zm-6.8-.1c-.3 0-.5.1-.7.3v-.3h-.8l-.3 2.1h.8l.2-1.3c.1-.2.2-.2.4-.2s.2.1.2.3L7 15.5h.8l.2-1.3c.1-.5-.1-.8-.6-.8zm2.9-13h-4l-.5 3.4h.7c.4 0 .7-.2.9-.4.1-.1.1-.2.1-.2 0-.1-.1-.2-.2-.3-.3-.2-.4-.5-.4-.6v-.1c.1-.3.6-.7 1.2-.7.4 0 .7.1.9.3.2.1.2.4.2.6-.1.2-.4.4-.5.5-.4.3-.4.5-.3.6 0 .2.3.3.6.3h1c1.4 0 2.2.7 1.9 2.2-.2 1.4-1.3 2-2.6 2l-.5 3.3h.8c3.2 0 5.8-2.1 6.3-5.3.6-4-1.9-5.6-5.6-5.6z"/>
          </svg>
        </span>
        <span class="waykeecom-button__content">${title}</span>
        <span class="waykeecom-button__content">
          ${
            loading
              ? Loader({ type: 'inline' })
              : `
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  class="waykeecom-icon"
                >
                  <title>Ikon: pil höger</title>
                  <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
                </svg>`
          }
        </span>
      </button>
    `;
    if (onClick) {
      this.node.querySelector<HTMLButtonElement>('button')?.addEventListener('click', onClick);
    }
  }
}

export default ButtonBankId;
