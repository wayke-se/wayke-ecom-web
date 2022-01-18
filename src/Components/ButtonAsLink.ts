interface ButtonAsLinkProps {
  title: string;
  id: string;
  onClick?: (e: Event) => void;
}

class ButtonAsLink {
  private element: HTMLDivElement;
  private props: ButtonAsLinkProps;

  constructor(element: HTMLDivElement, props: ButtonAsLinkProps) {
    this.element = element;
    this.props = props;
    this.render();
  }

  render() {
    this.element.innerHTML = `
      <button id="${this.props.id}" title="${this.props.title}" class="link">${this.props.title}</button>
    `;
    if (this.props.onClick) {
      this.element
        .querySelector<HTMLButtonElement>('button')
        ?.addEventListener('click', this.props.onClick);
    }
  }
}

export default ButtonAsLink;
