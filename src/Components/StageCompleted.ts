import KeyValueListItem, { KeyValueListItemProps } from '../Templates/KeyValueListItem';
import AppendChild from './Extension/AppendChild';

interface StageCompletedProps {
  keyValueList: KeyValueListItemProps[];
  changeButtonTitle: string;
  onEdit: () => void;
}

class StageCompleted extends AppendChild {
  private props;

  constructor(element: HTMLDivElement, props: StageCompletedProps) {
    super(element, { htmlTag: 'div' });
    this.props = props;
    this.render();
  }

  render() {
    this.content.innerHTML = `
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

    this.content.querySelector('button')?.addEventListener('click', () => this.props.onEdit());
  }
}

export default StageCompleted;
