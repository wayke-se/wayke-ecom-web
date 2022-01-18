import { editTradeIn, initTradeIn, setTradeIn } from '../../../Redux/action';
import store from '../../../Redux/store';
import ListItem from '../ListItem';
import PartTradeIn from './PartTradeIn';
import Alert from '../../../Templates/Alert';

const TRADE_IN_YES = 'button-trade-in-yes';
const TRADE_IN_NO = 'button-trade-in-no';
const CHANGE_BUTTON = 'button-trade-in-change';

const STAGE = 4;

class Stage4TradeIn {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  onEdit() {
    editTradeIn();
  }

  onYesTradeIn() {
    initTradeIn();
  }

  onNoTradeIn() {
    setTradeIn();
  }

  render() {
    const state = store.getState();
    const content = ListItem(
      this.element,
      'Inbytesbil',
      state.navigation.stage === STAGE,
      state.topNavigation.stage > STAGE
    );
    content.innerHTML = '';

    const part = document.createElement('div');

    if (state.navigation.stage > STAGE) {
      if (state.tradeIn && state.tradeInVehicle) {
        part.innerHTML = `
          <div class="stack stack--1">
            <ul class="key-value-list">
              <li class="key-value-list__item">
                <div class="key-value-list__key">Mätarställning</div>
                <div class="key-value-list__value">${state.tradeIn.mileage}</div>
              </li>
              <li class="key-value-list__item">
                <div class="key-value-list__key">Bilens skick</div>
                <div class="key-value-list__value">${state.tradeIn.condition}</div>
              </li>
              ${
                state.tradeIn.description &&
                `
                <li class="key-value-list__item">
                  <div class="key-value-list__key">Beskrivning</div>
                  <div class="key-value-list__value">${state.tradeIn.description}</div>
                </li>
              `
              }
            </ul>
          </div>
          <div class="stack stack--1">
            <button id="${CHANGE_BUTTON}" title="Ändra dina uppgifter" class="link">Ändra</button>
          </div>
          <ul class="key-value-list">
            <li class="key-value-list__item">
              <div class="key-value-list__key">Ungefärligt värde</div>
              <div class="key-value-list__value">~${state.tradeInVehicle.valuation} kr</div>
            </li>
          </ul>
          ${Alert({
            tone: 'info',
            children:
              '<b>Vi skickar med uppgifter om din inbytesbil till bilhandlaren.</b> Observera att värderingen som utförs ger ett uppskattat inbytesvärde. Det slutgiltliga värdet avgörs när handlare kan bekräfta bilens skick.',
          })}
        `;
        part.querySelector(`#${CHANGE_BUTTON}`)?.addEventListener('click', () => this.onEdit());
      } else {
        part.innerHTML = `
          <div class="stack stack--1">
            <ul class="key-value-list">
              <li class="key-value-list__item">
                <div class="key-value-list__key">Inbytesbil</div>
                <div class="key-value-list__value">Nej</div>
              </li>
            </ul>
          </div>
          <div class="stack stack--1">
            <button id="${CHANGE_BUTTON}" title="Ändra dina uppgifter" class="link">Ändra</button>
          </div>
        `;
        part.querySelector(`#${CHANGE_BUTTON}`)?.addEventListener('click', () => this.onEdit());
      }
    } else if (state.navigation.stage === STAGE) {
      if (state.wantTradeIn && state.tradeIn) {
        new PartTradeIn(part);
      } else {
        part.innerHTML = `
        <div class="stack stack--3">
          <h4 class="heading heading--4">Har du en inbytesbil?</h4>
          <div class="content">
            <p>Har du en bil du vill byta in när du köper din nya bil? Här får du ett uppskattat inköpspris av oss direkt online.</p>
          </div>
        </div>
        
        <div class="stack stack--3">
          <button type="button" id="${TRADE_IN_YES}" title="Fortsätt till nästa steg" class="button button--full-width button--action">
            <span class="button__content">Jag har inbytesbil</span>
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
        <div class="stack stack--3">
        <button type="button" id="${TRADE_IN_NO}" title="Fortsätt till nästa steg" class="button button--full-width button--action">
          <span class="button__content">Hoppa över detta steg</span>
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

        part
          .querySelector<HTMLButtonElement>(`#${TRADE_IN_YES}`)
          ?.addEventListener('click', () => this.onYesTradeIn());

        part
          .querySelector<HTMLButtonElement>(`#${TRADE_IN_NO}`)
          ?.addEventListener('click', () => this.onNoTradeIn());
      }
    }

    content.appendChild(part);
  }
}

export default Stage4TradeIn;
