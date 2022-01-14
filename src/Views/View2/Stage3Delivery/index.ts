import { editDelivery, setHomeDelivery } from '../../../Redux/action';
import store from '../../../Redux/store';
import ListItem from '../ListItem';

const PROCEED = 'button-home-delivery-proceed';
const RADIO_HOME_TRUE = 'radio-home-delivery-true';
const RADIO_HOME_FALSE = 'radio-home-delivery-false';

const CHANGE_BUTTON = 'button-home-delivery-change';

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

        <div>
          <input type="radio" id="${RADIO_HOME_FALSE}" name="homeDelivery" value="false">
          <label for="${RADIO_HOME_FALSE}">Hämta hos handlaren</label>
        </div>
        <div style="border: 1px solid black;">
          <p>${contactInformation.name}</p>
          <p>${contactInformation.address}, ${contactInformation.city}</p>
        </div>


        <div>
          <input type="radio" id="${RADIO_HOME_TRUE}" name="homeDelivery" value="true">
          <label for="${RADIO_HOME_TRUE}">Hemleverans</label>
        </div>
        <div style="border: 1px solid black;">
          Till din folkbokföringsadress
        </div>

        <div class="stack stack--3">
        <button type="button" id="${PROCEED}" title="Fortsätt till nästa steg" class="button button--full-width button--action">
          <span class="button__content">Fortsätt</span>
          <span class="button__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="icon"
            >
              <title>Ikon: pil höger</title>
              <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
            </svg>
          </span>
        </button>
      </div>
    `;

      const radioTrue = part.querySelector<HTMLInputElement>(`#${RADIO_HOME_TRUE}`);
      if (radioTrue) {
        if (this.homeDelivery) {
          radioTrue.setAttribute('checked', '');
        }
        radioTrue.addEventListener('click', (e) => this.onChange(e));
      }

      const radioFalse = part.querySelector<HTMLInputElement>(`#${RADIO_HOME_FALSE}`);
      if (radioFalse) {
        if (!this.homeDelivery) {
          radioFalse.setAttribute('checked', '');
        }
        radioFalse.addEventListener('click', (e) => this.onChange(e));
      }

      part
        .querySelector<HTMLButtonElement>(`#${PROCEED}`)
        ?.addEventListener('click', () => this.onProceed());

      content.appendChild(part);
    }
  }
}

export default Stage3Delivery;
