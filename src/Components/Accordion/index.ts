import HtmlNode from '../Extension/HtmlNode';

interface AccordionProps {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly append?: boolean;
}

class Accordion extends HtmlNode {
  private readonly props: AccordionProps;

  constructor(element: HTMLElement | null, props: AccordionProps) {
    super(element, props.append ? { htmlTag: 'div', className: 'waykeecom-accordion' } : undefined);
    this.props = props;

    this.render();
  }

  render() {
    const { title, description } = this.props;

    const content = `
      <div class="waykeecom-accordion">
        <input
          type="checkbox"
          id="${this.props.id}"
          class="waykeecom-accordion__checkbox"
          tabindex="-1"
        />
        <label class="waykeecom-accordion__header" for="${this.props.id}" tabindex="0" aria-label="Lorem ipsum">
          <div class="waykeecom-accordion__header-title">${title}</div>
          <div class="waykeecom-accordion__header-icon">
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
      </div>
    `;

    if (this.props.append) {
      this.node.innerHTML = content;
    }

    this.node.innerHTML = `
      ${content}
    `;
  }
}

export default Accordion;
