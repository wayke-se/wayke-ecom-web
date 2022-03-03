import { Customer } from '../../../@types/Customer';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import store from '../../../Redux/store';
import KeyValueListItem, { KeyValueListItemProps } from '../../../Templates/KeyValueListItem';
import FullAddressByBankId from './FullAddressByBankId';
import FullAddressBySocialId from './FullAddressBySocialId';

class FullAddress extends HtmlNode {
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

      this.node.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--2">
          <ul class="waykeecom-key-value-list">
          ${keyValueItems.map((kv) => KeyValueListItem(kv)).join('')}
          </ul>
        </div>
      `;
    } else {
      this.node.innerHTML = '';
      if (this.useBankId) {
        new FullAddressByBankId(this.node, this.lastStage, () => this.onToggleMethod());
      } else {
        new FullAddressBySocialId(this.node, this.lastStage, () => this.onToggleMethod());
      }
    }
  }
}

export default FullAddress;
