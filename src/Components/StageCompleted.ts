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
    const { keyValueList, changeButtonTitle, onEdit } = this.props;
    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--1">
        <ul class="waykeecom-key-value-list">
          ${keyValueList
            .map((keyValue) =>
              KeyValueListItem({
                key: keyValue.key,
                image: keyValue.image,
                value: keyValue.value,
              })
            )
            .join('')}
        </ul>
      </div>
      <div class="waykeecom-stack waykeecom-stack--1">
        <div class="waykeecom-align waykeecom-align--end">
          <button type="button" title="${changeButtonTitle}" class="waykeecom-link">Ändra</button>
        </div>
      </div>
    `;

    this.node.querySelector('button')?.addEventListener('click', () => onEdit());
  }
}

export default StageCompleted;
