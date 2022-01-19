interface ButtonSkipProps {
  title: string;
  id: string;
  onClick?: (e: Event) => void;
}

class ButtonSkip {
  private element: HTMLDivElement;
  private props: ButtonSkipProps;

  constructor(element: HTMLDivElement | null, props: ButtonSkipProps) {
    if (!element) throw `No element provided to ButtonSkip`;
    this.element = element;
    this.props = props;
    this.render();
  }

  render() {
    this.element.innerHTML = `
      <button type="button" id="${this.props.id}" title="${this.props.title}" class="button button--full-width button--action-clear">
      <span class="button__content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="icon"
          >
            <title>Ikon: hoppa över</title>
            <path d="m14.5 7-4.7 4.7-1.4-1.4L10.6 8H6.5c-1.1 0-2 .9-2 2v2c0 .6-.4 1-1 1s-1-.4-1-1v-2c0-2.2 1.8-4 4-4h4.1L8.3 3.7l1.4-1.4L14.5 7z" />
          </svg>
        </span>
        <span class="button__content">${this.props.title}</span>
      </button>
    `;
    if (this.props.onClick) {
      this.element
        .querySelector<HTMLButtonElement>('button')
        ?.addEventListener('click', this.props.onClick);
    }
  }
}

export default ButtonSkip;