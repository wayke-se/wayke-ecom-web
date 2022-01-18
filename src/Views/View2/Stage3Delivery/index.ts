import ButtonArrowRight from '../../../Components/ButtonArrowRight';
import InputRadioField from '../../../Components/InputRadioField';
import { editDelivery, setHomeDelivery } from '../../../Redux/action';
import store from '../../../Redux/store';
import ListItem from '../ListItem';

const RADIO_HOME_TRUE = 'radio-home-delivery-true';
const RADIO_HOME_TRUE_NODE = `${RADIO_HOME_TRUE}-node`;

const RADIO_HOME_FALSE = 'radio-home-delivery-false';
const RADIO_HOME_FALSE_NODE = `${RADIO_HOME_FALSE}-node`;

const CHANGE_BUTTON = 'button-home-delivery-change';

const PROCEED = 'button-home-delivery-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

const STAGE = 3;

class Stage3Delivery {
  private element: HTMLDivElement;
  private homeDelivery: boolean;

  constructor(element: HTMLDivElement) {
    this.element = element;

    this.homeDelivery = store.getState().homeDelivery;
    this.render();
  }

  onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const value = currentTarget.value === 'true';
    this.homeDelivery = value;
  }

  onProceed() {
    setHomeDelivery(this.homeDelivery);
  }

  onEdit() {
    editDelivery();
  }

  render() {
    const state = store.getState();
    if (!state.order) throw 'Missing order...';

    const contactInformation = state.order.getContactInformation();
    if (!contactInformation) throw 'Missing dealer contact information';

    const content = ListItem(this.element, 'Leverans', state.navigation.stage === STAGE);

    if (state.navigation.stage > STAGE) {
      const part = document.createElement('div');
      part.innerHTML = `
        <div class="stack stack--1">
          <ul class="key-value-list">
            <li class="key-value-list__item">
              <div class="key-value-list__key">Leveranssätt</div>
              <div class="key-value-list__value">${
                state.homeDelivery ? 'Hemleverans' : 'Hämta hos handlaren'
              }</div>
            </li>
          </ul>
        </div>
        <div class="stack stack--1">
          <button id="${CHANGE_BUTTON}" title="Ändra dina uppgifter" class="link">Ändra</button>
        </div>
      `;

      part.querySelector(`#${CHANGE_BUTTON}`)?.addEventListener('click', () => this.onEdit());
      content.appendChild(part);
    } else if (state.navigation.stage === STAGE) {
      const part = document.createElement('div');
      part.innerHTML = `
        <div class="stack stack--3">
          <h4 class="heading heading--4">Hur vill du ha din bil levererad?</h4>
          <div class="content">
            <p>Välj ifall du vill ha bilen levererad hem till dig eller ifall du vill hämta 
            den hos ${contactInformation.name}.</p>
          </div>
        </div>

        <div class="stack stack--2">
          <div class="stack stack--3" id="${RADIO_HOME_FALSE_NODE}"></div>
          <div class="stack stack--3" id="${RADIO_HOME_TRUE_NODE}"></div>
        </div>

        <div class="stack stack--3" id="${PROCEED_NODE}"></div>
      `;

      new InputRadioField(part.querySelector<HTMLInputElement>(`#${RADIO_HOME_FALSE_NODE}`), {
        id: RADIO_HOME_TRUE,
        name: 'homeDelivery',
        title: 'Hämta hos handlaren',
        value: 'false',
        description: `
          <div style="border: 1px solid black;">
            <p>${contactInformation.name}</p>
            <p>${contactInformation.address}, ${contactInformation.city}</p>
          </div>
        `,
        meta: `<div class="font-medium">Gratis (???)</div>`,
        checked: !this.homeDelivery,
        onClick: (e) => this.onChange(e),
      });

      new InputRadioField(part.querySelector<HTMLInputElement>(`#${RADIO_HOME_TRUE_NODE}`), {
        id: RADIO_HOME_FALSE,
        name: 'homeDelivery',
        title: 'Hemleverans',
        value: 'true',
        description: `
          <div style="border: 1px solid black;">
            Till din folkbokföringsadress
          </div>
        `,
        meta: `<div class="font-medium">"??? kr</div>`,
        checked: this.homeDelivery,
        onClick: (e) => this.onChange(e),
      });

      new ButtonArrowRight(part.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
        title: 'Fortsätt',
        id: PROCEED,
        onClick: () => this.onProceed(),
      });

      content.appendChild(part);
    }
  }
}

export default Stage3Delivery;
