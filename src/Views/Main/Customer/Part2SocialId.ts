import { Customer } from '../../../@types/Customer';
import store from '../../../Redux/store';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import Part2WithBankId from './Part2WithBankId';
import Part2WithSocialId from './Part2WithSocialId';

class Part2SocialId {
  private useBankId: boolean = true;
  private element: HTMLDivElement;
  private lastStage: boolean;
  private state: Customer;

  constructor(element: HTMLDivElement, lastStage: boolean) {
    this.element = element;
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
      const keyValueItems: { key: string; value: string }[] = [
        { key: 'Personnummer', value: this.state.socialId },
      ];

      this.element.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <ul class="waykeecom-key-value-list">
        ${keyValueItems.map((kv) => KeyValueListItem(kv)).join('')}
        </ul>
      </div>
      `;
    } else {
      if (this.useBankId) {
        new Part2WithBankId(this.element, this.lastStage, () => this.onToggleMethod());
      } else {
        new Part2WithSocialId(this.element, this.lastStage, () => this.onToggleMethod());
      }
    }
  }
}

export default Part2SocialId;
