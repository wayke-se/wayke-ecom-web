import ButtonAsLink from '../../../Components/ButtonAsLink';
import { edit } from '../../../Redux/action';
import store from '../../../Redux/store';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import { maskSSn, maskText } from '../../../Utils/mask';

const CHANGE_BUTTON_NODE = 'contact-change-button-node';
const CHANGE_BUTTON = 'contact-change-button';

class Part3CustomerSummary {
  private element: HTMLDivElement;
  private index: number;

  constructor(element: HTMLDivElement, index: number) {
    this.element = element;
    this.index = index;
    this.render();
  }

  onChange() {
    edit(this.index);
  }

  render() {
    const state = store.getState();

    const keyValueItems: { key: string; value: string }[] = [
      { key: 'E-post', value: state.customer.email },
      { key: 'Telefonnummer', value: state.customer.phone },
      { key: 'Personnummer', value: maskSSn(state.customer.socialId) },
      ...(state.address
        ? [
            {
              key: 'Namn',
              value: `${maskText(state.address.givenName)} ${maskText(state.address.surname)}`,
            },
            { key: 'Adress', value: state.address.street },
            { key: 'Postnummer', value: state.address.postalCode },
            { key: 'Stad', value: state.address.city },
          ]
        : []),
    ];

    this.element.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--1">
        <ul class="waykeecom-key-value-list">
          ${keyValueItems.map((kv) => KeyValueListItem(kv)).join('')}
        </ul>
      </div>
      <div class="waykeecom-stack waykeecom-stack--1">
        <div class="waykeecom-align waykeecom-align--end" id="${CHANGE_BUTTON_NODE}"></div>
      </div>
    `;

    new ButtonAsLink(this.element.querySelector<HTMLDivElement>(`#${CHANGE_BUTTON_NODE}`), {
      id: CHANGE_BUTTON,
      title: 'Ändra',
      onClick: () => this.onChange(),
    });
  }
}

export default Part3CustomerSummary;
