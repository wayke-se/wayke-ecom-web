import ButtonAsLink from '../../../Components/ButtonAsLink';
import { editCustomer } from '../../../Redux/action';
import store from '../../../Redux/store';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import { maskSSn, maskText } from '../../../Utils/mask';

const CHANGE_BUTTON_NODE = 'contact-change-button-node';
const CHANGE_BUTTON = 'contact-change-button';

class Part3CustomerSummary {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  onChange() {
    editCustomer();
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
            { key: 'Adress', value: maskSSn(state.address.street) },
            { key: 'Postnummer', value: maskSSn(state.address.postalCode) },
            { key: 'Stad', value: maskSSn(state.address.city) },
          ]
        : []),
    ];

    this.element.innerHTML = `
      <div class="stack stack--1">
        <ul class="key-value-list">
          ${keyValueItems.map((kv) => KeyValueListItem(kv)).join('')}
        </ul>
      </div>
      <div class="stack stack--1">
        <div class="align align--end" id="${CHANGE_BUTTON_NODE}"></div>
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
