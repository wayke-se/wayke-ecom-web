import HtmlNode from '../Extension/HtmlNode';

interface ButtonSkipProps {
  title: string;
  id: string;
  onClick?: (e: Event) => void;
}

class ButtonSkip extends HtmlNode {
  private props: ButtonSkipProps;

  constructor(element: HTMLDivElement | null, props: ButtonSkipProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { title, id, onClick } = this.props;

    this.node.innerHTML = `
      <button type="button" id="${id}" title="${title}" class="waykeecom-button waykeecom-button--full-width waykeecom-button--action-clear">
      <span class="waykeecom-button__content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="waykeecom-icon"
            data-icon="Skip"
          >
            <path d="m14.5 7-4.7 4.7-1.4-1.4L10.6 8H6.5c-1.1 0-2 .9-2 2v2c0 .6-.4 1-1 1s-1-.4-1-1v-2c0-2.2 1.8-4 4-4h4.1L8.3 3.7l1.4-1.4L14.5 7z" />
          </svg>
        </span>
        <span class="waykeecom-button__content">${title}</span>
      </button>
    `;
    if (onClick) {
      this.node.querySelector<HTMLButtonElement>('button')?.addEventListener('click', onClick);
    }
  }
}

export default ButtonSkip;
