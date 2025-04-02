import HtmlNode from '../Extension/HtmlNode';

interface AccordionProps {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly append?: boolean;
  readonly onClick?: () => void;
}

class Accordion extends HtmlNode {
  private readonly props: AccordionProps;

  constructor(element: HTMLElement | null, props: AccordionProps) {
    super(element, props.append ? { htmlTag: 'div', className: 'waykeecom-accordion' } : undefined);
    this.props = props;

    this.render();
  }

  render() {
    const { title, description, onClick } = this.props;

    const content = `
      <input
        type="checkbox"
        id="${this.props.id}"
        class="waykeecom-accordion__checkbox"
      />
      <label class="waykeecom-accordion__header" for="${this.props.id}">
        <div class="waykeecom-accordion__header-title">${title}</div>
        <div class="waykeecom-accordion__header-icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="waykeecom-icon"
            data-icon="Chevron down"
          >
            <path d="M6.7 11.4 0 4.6l1.3-1.4L8 10.1l6.7-6.9L16 4.6l-6.7 6.9L8 12.8l-1.3-1.4z" />
          </svg>
        </div>
      </label>
      <div class="waykeecom-accordion__body">${description}</div>
    `;

    if (this.props.append) {
      this.node.innerHTML = content;
    }

    this.node.innerHTML = `
      ${content}
    `;

    if (onClick) {
      this.node.querySelector('input')?.addEventListener('click', () => onClick());
    }
  }
}

export default Accordion;
