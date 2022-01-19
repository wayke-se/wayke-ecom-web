import { editTradeIn, initTradeIn, setTradeIn } from '../../../Redux/action';
import store from '../../../Redux/store';
import ListItem from '../ListItem';
import PartTradeIn from './PartTradeIn';
import Alert from '../../../Templates/Alert';
import ButtonArrowRight from '../../../Components/ButtonArrowRight';
import ButtonSkip from '../../../Components/ButtonSkip';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import ButtonAsLink from '../../../Components/ButtonAsLink';
import { VehicleCondition } from '../../../@types/TradeIn';
import { prettyNumber } from '../../../Utils/format';
import watch from 'redux-watch';

const TRADE_IN_YES = 'button-trade-in-yes';
const TRADE_IN_YES_NODE = `${TRADE_IN_YES}-node`;

const TRADE_IN_NO = 'button-trade-in-no';
const TRADE_IN_NO_NODE = `${TRADE_IN_NO}-node`;

const CHANGE_BUTTON = 'button-trade-in-change';
const CHANGE_BUTTON_NODE = `${CHANGE_BUTTON}-node`;

const STAGE = 4;

const translateCondition = {
  [VehicleCondition.VeryGood]: 'Mycket bra',
  [VehicleCondition.Good]: 'Bra',
  [VehicleCondition.Ok]: 'Ok',
};

class Stage4TradeIn {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    const w = watch(store.getState, 'navigation');
    store.subscribe(w(() => this.render()));
    const w2 = watch(store.getState, 'edit');
    store.subscribe(w2(() => this.render()));

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
    const content = ListItem(this.element, {
      title: 'Inbytesbil',
      active: state.navigation.stage === STAGE,
      completed: state.topNavigation.stage > STAGE,
      id: 'trade-in',
    });
    content.innerHTML = '';

    const part = document.createElement('div');

    if (state.navigation.stage > STAGE) {
      const keyValueItemsUpper: { key: string; value: string }[] = [];

      if (state.tradeIn && state.tradeInVehicle) {
        keyValueItemsUpper.push({ key: 'Mätarställning', value: state.tradeIn.mileage });
        if (state.tradeIn.condition)
          keyValueItemsUpper.push({
            key: 'Bilens skick',
            value: translateCondition[state.tradeIn.condition],
          });
        if (state.tradeIn.description)
          keyValueItemsUpper.push({
            key: 'Beskrivning',
            value: `${state.tradeIn.description}`,
          });

        const keyValueItemsLower: { key: string; value: string }[] = [
          {
            key: 'Ungefärligt värde',
            value: `~${prettyNumber(state.tradeInVehicle.valuation, { postfix: 'kr' })}`,
          },
        ];
        part.innerHTML = `
          <div class="stack stack--1">
            <ul class="key-value-list">
              ${keyValueItemsUpper.map((kv) => KeyValueListItem(kv)).join('')}
            </ul>
          </div>
          <div class="stack stack--1" id="${CHANGE_BUTTON_NODE}"></div>
          <ul class="key-value-list">
            ${keyValueItemsLower.map((kv) => KeyValueListItem(kv)).join('')}
          </ul>
          ${Alert({
            tone: 'info',
            children:
              '<b>Vi skickar med uppgifter om din inbytesbil till bilhandlaren.</b> Observera att värderingen som utförs ger ett uppskattat inbytesvärde. Det slutgiltliga värdet avgörs när handlare kan bekräfta bilens skick.',
          })}
        `;
        part.querySelector(`#${CHANGE_BUTTON}`)?.addEventListener('click', () => this.onEdit());
      } else {
        keyValueItemsUpper.push({ key: 'Inbytesbil', value: 'Nej' });
        part.innerHTML = `
          <div class="stack stack--1">
            <ul class="key-value-list">
            ${keyValueItemsUpper.map((kv) => KeyValueListItem(kv)).join('')}
            </ul>
          </div>
          <div class="stack stack--1">
            <div class="align align--end" id="${CHANGE_BUTTON_NODE}"></div>
          </div>
        `;
      }
      new ButtonAsLink(part.querySelector(`#${CHANGE_BUTTON_NODE}`), {
        id: CHANGE_BUTTON,
        title: 'Ändra',
        onClick: () => this.onEdit(),
      });
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
            <div class="stack stack--1" id="${TRADE_IN_YES_NODE}"></div>
            <div class="stack stack--1" id="${TRADE_IN_NO_NODE}"></div>
          </div>
        `;

        new ButtonArrowRight(part.querySelector<HTMLDivElement>(`#${TRADE_IN_YES_NODE}`), {
          id: TRADE_IN_YES,
          title: 'Jag har inbytesbil',
          onClick: () => this.onYesTradeIn(),
        });

        new ButtonSkip(part.querySelector<HTMLDivElement>(`#${TRADE_IN_NO_NODE}`), {
          id: TRADE_IN_NO,
          title: 'Hoppa över detta steg',
          onClick: () => this.onNoTradeIn(),
        });
      }
    }

    content.appendChild(part);
  }
}

export default Stage4TradeIn;
