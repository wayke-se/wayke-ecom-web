import watch from 'redux-watch';
import ButtonArrowRight from '../../../Components/ButtonArrowRight';
import InputRadioField from '../../../Components/InputRadioField';
import { edit, setHomeDelivery } from '../../../Redux/action';
import store from '../../../Redux/store';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import ListItem from '../ListItem';

const RADIO_HOME_TRUE = 'radio-home-delivery-true';
const RADIO_HOME_TRUE_NODE = `${RADIO_HOME_TRUE}-node`;

const RADIO_HOME_FALSE = 'radio-home-delivery-false';
const RADIO_HOME_FALSE_NODE = `${RADIO_HOME_FALSE}-node`;

const CHANGE_BUTTON = 'button-home-delivery-change';

const PROCEED = 'button-home-delivery-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

class Delivery {
  private element: HTMLDivElement;
  private index: number;
  private lastStage: boolean;

  private homeDelivery: boolean;

  constructor(element: HTMLDivElement, index: number, lastStage: boolean) {
    this.element = element;
    this.index = index;
    this.lastStage = lastStage;

    const w = watch(store.getState, 'navigation');
    store.subscribe(w(() => this.render()));
    const w2 = watch(store.getState, 'edit');
    store.subscribe(w2(() => this.render()));

    this.homeDelivery = store.getState().homeDelivery;
    this.render();
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const value = currentTarget.value === 'true';
    this.homeDelivery = value;
  }

  private onProceed() {
    setHomeDelivery(this.homeDelivery, this.lastStage);
  }

  private onEdit() {
    edit(this.index);
  }

  render() {
    const state = store.getState();
    if (!state.order) throw 'Missing order...';

    const contactInformation = state.order.getContactInformation();
    if (!contactInformation) throw 'Missing dealer contact information';

    const content = ListItem(this.element, {
      title: 'Leverans',
      active: state.navigation.stage === this.index,
      completed: state.topNavigation.stage > this.index,
      id: 'delivery',
    });

    if (state.navigation.stage > this.index) {
      const part = document.createElement('div');

      const keyValueItems: { key: string; value: string }[] = [
        { key: 'Leveranssätt', value: state.homeDelivery ? 'Hemleverans' : 'Hämta hos handlaren' },
      ];

      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--1">
          <ul class="waykeecom-key-value-list">
            ${keyValueItems.map((kv) => KeyValueListItem(kv)).join('')}
          </ul>
        </div>
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-align waykeecom-align--end">
            <button id="${CHANGE_BUTTON}" title="Ändra leveranssätt" class="waykeecom-link">Ändra</button>
          </div>
        </div>
      `;

      part.querySelector(`#${CHANGE_BUTTON}`)?.addEventListener('click', () => this.onEdit());
      content.appendChild(part);
    } else if (state.navigation.stage === this.index) {
      const part = document.createElement('div');
      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <h4 class="waykeecom-heading waykeecom-heading--4">Hur vill du ha din bil levererad?</h4>
          <div class="waykeecom-content">
            <p>Välj ifall du vill ha bilen levererad hem till dig eller ifall du vill hämta 
            den hos ${contactInformation.name}.</p>
          </div>
        </div>

        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-stack waykeecom-stack--3" id="${RADIO_HOME_FALSE_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--3" id="${RADIO_HOME_TRUE_NODE}"></div>
        </div>

        <div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_NODE}"></div>
      `;

      new InputRadioField(part.querySelector<HTMLInputElement>(`#${RADIO_HOME_FALSE_NODE}`), {
        id: RADIO_HOME_TRUE,
        name: 'homeDelivery',
        title: 'Hämta hos handlaren',
        value: 'false',
        description: `
          <div class="waykeecom-box">
            <div class="waykeecom-icon-content">
              <div class="waykeecom-icon-content__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  class="waykeecom-icon"
                >
                  <title>Ikon: position</title>
                  <path d="M12.2 2C11.1.9 9.6.3 8 .3S4.9.9 3.8 2C2.6 3.2 2 4.7 2 6.3 2 9 5.3 12.9 7.3 15l.7.7.7-.7c2-2.1 5.3-6 5.3-8.7 0-1.6-.6-3.1-1.8-4.3zM8 12.8C5.5 10 4 7.6 4 6.3c0-1.1.4-2.1 1.2-2.9.7-.7 1.7-1.1 2.8-1.1 1.1 0 2.1.4 2.8 1.2.8.7 1.2 1.7 1.2 2.8 0 1.3-1.5 3.7-4 6.5zm2-6.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                </svg>
              </div>
              <div class="waykeecom-icon-content__content">
                <div class="waykeecom-icon-content__label">${contactInformation.name}</div>
                <div class="waykeecom-icon-content__meta">
                  ${contactInformation.address}, ${contactInformation.city}
                </div>
              </div>
            </div>
          </div>
        `,
        meta: `<div class="waykeecom-font-medium">Gratis (???)</div>`,
        checked: !this.homeDelivery,
        onClick: (e) => this.onChange(e),
      });

      new InputRadioField(part.querySelector<HTMLInputElement>(`#${RADIO_HOME_TRUE_NODE}`), {
        id: RADIO_HOME_FALSE,
        name: 'homeDelivery',
        title: 'Hemleverans',
        value: 'true',
        description: `<div class="waykeecom-box">Till din folkbokföringsadress</div>`,
        meta: `<div class="waykeecom-font-medium">"??? kr</div>`,
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

export default Delivery;
