import HtmlNode from '../Extension/HtmlNode';

interface ButtonClearProps {
  readonly title: string;
  readonly id?: string;
  readonly onClick?: (e: Event) => void;
}

class ButtonClear extends HtmlNode {
  private readonly props: ButtonClearProps;

  constructor(element: HTMLDivElement | null, props: ButtonClearProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { title, id, onClick } = this.props;

    this.node.innerHTML = `
      <button type="button" id="${id}" title="${title}" class="waykeecom-button waykeecom-button--full-width waykeecom-button--action-clear">
        ${title}
      </button>
    `;
    if (onClick) {
      this.node.querySelector<HTMLButtonElement>('button')?.addEventListener('click', onClick);
    }
  }
}

export default ButtonClear;
