import { Customer } from '../../../@types/Customer';
import AppendChild from '../../../Components/Extension/AppendChild';
import store from '../../../Redux/store';
import KeyValueListItem, { KeyValueListItemProps } from '../../../Templates/KeyValueListItem';
import FullAddressByBankId from './FullAddressByBankId';
import FullAddressBySocialId from './FullAddressBySocialId';

class FullAddress extends AppendChild {
  private useBankId: boolean = true;
  private lastStage: boolean;
  private state: Customer;

  constructor(element: HTMLDivElement, lastStage: boolean) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--2' });

    this.lastStage = lastStage;
    const state = store.getState();
    this.state = state.customer;

    this.render();
  }

  onToggleMethod() {
    this.useBankId = !this.useBankId;
    this.render();
  }

  render() {
    const subStage = store.getState().navigation.subStage;
    if (subStage > 2) {
      const keyValueItems: KeyValueListItemProps[] = [
        { key: 'Personnummer', value: this.state.socialId },
      ];

      this.content.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--2">
          <ul class="waykeecom-key-value-list">
          ${keyValueItems.map((kv) => KeyValueListItem(kv)).join('')}
          </ul>
        </div>
      `;
    } else {
      this.content.innerHTML = '';
      if (this.useBankId) {
        new FullAddressByBankId(this.content, this.lastStage, () => this.onToggleMethod());
      } else {
        new FullAddressBySocialId(this.content, this.lastStage, () => this.onToggleMethod());
      }
    }
  }
}

export default FullAddress;
