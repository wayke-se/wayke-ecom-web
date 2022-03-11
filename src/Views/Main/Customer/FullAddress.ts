import { Customer } from '../../../@types/Customer';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import KeyValueListItem, { KeyValueListItemProps } from '../../../Templates/KeyValueListItem';
import FullAddressByBankId from './FullAddressByBankId';
import FullAddressBySocialId from './FullAddressBySocialId';

interface FullAddressProps {
  readonly store: WaykeStore;
  readonly lastStage: boolean;
}
class FullAddress extends HtmlNode {
  private readonly props: FullAddressProps;
  private useBankId: boolean = true;
  private state: Customer;

  constructor(element: HTMLDivElement, props: FullAddressProps) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--2' });
    this.props = props;

    const state = this.props.store.getState();
    this.state = state.customer;

    this.render();
  }

  private onToggleMethod() {
    this.useBankId = !this.useBankId;
    this.render();
  }

  render() {
    const { store, lastStage } = this.props;
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
        new FullAddressByBankId(this.node, {
          store,
          lastStage,
          onToggleMethod: () => this.onToggleMethod(),
        });
      } else {
        new FullAddressBySocialId(this.node, {
          store,
          lastStage,
          onToggleMethod: () => this.onToggleMethod(),
        });
      }
    }
  }
}

export default FullAddress;
