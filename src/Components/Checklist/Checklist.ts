import HtmlNode from '../Extension/HtmlNode';

interface CheckListProps {
  readonly title: string;
  readonly ariaLabel: string;
  readonly checklistItems: string[];
}

class CheckList extends HtmlNode {
  private readonly props: CheckListProps;

  constructor(element: HTMLElement | null, props: CheckListProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    this.node.innerHTML = `
      <h3 class="waykeecom-heading waykeecom-heading--4">Köp online hos Wayke</h3>
      <ul class="waykeecom-checklist" aria-label="Fördelar med att köpa bilen online hos Wayke">
        ${this.props.checklistItems
          .map((item) => ` <li class="waykeecom-checklist__item">${item}</li>`)
          .join('')}
      </ul>
    `;
  }
}

export default CheckList;
