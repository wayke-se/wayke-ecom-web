import KeyValueListItem, { KeyValueListItemProps } from '../Templates/KeyValueListItem';
import HtmlNode from './Extension/HtmlNode';

interface StageCompletedProps {
  keyValueList: KeyValueListItemProps[];
  changeButtonTitle: string;
  onEdit: () => void;
}

class StageCompleted extends HtmlNode {
  private props;

  constructor(element: HTMLDivElement, props: StageCompletedProps) {
    super(element, { htmlTag: 'div' });
    this.props = props;
    this.render();
  }

  render() {
    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--1">
        <ul class="waykeecom-key-value-list">
          ${this.props.keyValueList
            .map((keyValue) =>
              KeyValueListItem({
                key: keyValue.key,
                value: keyValue.value,
              })
            )
            .join('')}
        </ul>
      </div>
      <div class="waykeecom-stack waykeecom-stack--1">
        <div class="waykeecom-align waykeecom-align--end">
          <button type="button" title="${
            this.props.changeButtonTitle
          }" class="waykeecom-link">Ändra</button>
        </div>
      </div>
    `;

    this.node.querySelector('button')?.addEventListener('click', () => this.props.onEdit());
  }
}

export default StageCompleted;
