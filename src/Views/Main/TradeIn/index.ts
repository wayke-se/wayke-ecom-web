import { goTo, initTradeIn, setTradeIn } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import ListItem from '../../../Templates/ListItem';
import PartTradeIn from './PartTradeIn';
import Alert from '../../../Templates/Alert';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonSkip from '../../../Components/Button/ButtonSkip';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import ButtonAsLink from '../../../Components/Button/ButtonAsLink';
import { prettyNumber } from '../../../Utils/format';
import { translateTradeInCondition } from '../../../Utils/constants';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import watch from '../../../Redux/watch';

const TRADE_IN_YES = 'button-trade-in-yes';
const TRADE_IN_YES_NODE = `${TRADE_IN_YES}-node`;

const TRADE_IN_NO = 'button-trade-in-no';
const TRADE_IN_NO_NODE = `${TRADE_IN_NO}-node`;

const CHANGE_BUTTON = 'button-trade-in-change';
const CHANGE_BUTTON_NODE = `${CHANGE_BUTTON}-node`;

interface TradeInProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class TradeIn extends HtmlNode {
  private readonly props: TradeInProps;

  constructor(element: HTMLDivElement, props: TradeInProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.render();
  }

  private onEdit() {
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  private onYesTradeIn() {
    initTradeIn(this.props.lastStage)(this.props.store.dispatch);
  }

  private onNoTradeIn() {
    setTradeIn(this.props.lastStage)(this.props.store.dispatch);
  }

  render() {
    const { store, index, lastStage } = this.props;
    const state = this.props.store.getState();
    if (!state.order?.allowsTradeIn) return;

    const completed = state.topNavigation.stage > index;
    const content = ListItem(this.node, {
      title: 'Inbytesbil',
      active: state.navigation.stage === index,
      completed: state.topNavigation.stage > index,
      id: 'trade-in',
    });
    content.innerHTML = '';

    const part = document.createElement('div');

    if (state.navigation.stage > index || (completed && state.navigation.stage !== index)) {
      const keyValueItemsUpper: { key: string; value: string }[] = [];

      if (state.tradeIn && state.tradeInVehicle) {
        keyValueItemsUpper.push({ key: 'Miltal', value: `${state.tradeIn.mileage} mil` });
        if (state.tradeIn.description)
          keyValueItemsUpper.push({
            key: 'Beskrivning',
            value: `${state.tradeIn.description}`,
          });
        if (state.tradeIn.condition)
          keyValueItemsUpper.push({
            key: 'Bilens skick',
            value: translateTradeInCondition[state.tradeIn.condition],
          });

        part.innerHTML = `
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-balloon">
              <div class="waykeecom-stack waykeecom-stack--05">
                <div class="waykeecom-label">${state.tradeIn.registrationNumber}</div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--05">
                <span class="waykeecom-font-medium">${state.tradeInVehicle.manufacturer} ${
          state.tradeInVehicle.modelSeries
        }</span>
                ${state.tradeInVehicle.modelName}, ${state.tradeInVehicle.modelYear}
              </div>
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--1">
              <ul class="waykeecom-key-value-list">
                ${keyValueItemsUpper.map((kv) => KeyValueListItem(kv)).join('')}
              </ul>
            </div>
            <div class="waykeecom-stack waykeecom-stack--1">
              <div class="waykeecom-align waykeecom-align--end" id="${CHANGE_BUTTON_NODE}"></div>
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--3 waykeecom-text-center">
            <div class="waykeecom-stack waykeecom-stack--1">
              <div class="waykeecom-text waykeecom-text--tone-alt waykeecom-text--size-small">Ungefärligt värde</div>
            </div>
            <div class="waykeecom-stack waykeecom-stack--1">
              <div class="waykeecom-heading waykeecom-heading--2 waykeecom-no-margin">
                ${prettyNumber(state.tradeInVehicle.valuation, { postfix: 'kr' })}
              </div>
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--3">
            ${Alert({
              tone: 'info',
              children:
                '<b>Vi skickar med uppgifter om din inbytesbil till bilhandlaren.</b> Observera att värderingen som utförs ger ett uppskattat inbytesvärde. Det slutgiltliga värdet avgörs när handlare kan bekräfta bilens skick.',
            })}
          </div>
        `;
        part.querySelector(`#${CHANGE_BUTTON}`)?.addEventListener('click', () => this.onEdit());
      } else {
        keyValueItemsUpper.push({ key: 'Inbytesbil', value: 'Nej' });
        part.innerHTML = `
          <div class="waykeecom-stack waykeecom-stack--1">
            <ul class="waykeecom-key-value-list">
            ${keyValueItemsUpper.map((kv) => KeyValueListItem(kv)).join('')}
            </ul>
          </div>
          <div class="waykeecom-stack waykeecom-stack--1">
            <div class="waykeecom-align waykeecom-align--end" id="${CHANGE_BUTTON_NODE}"></div>
          </div>
        `;
      }
      new ButtonAsLink(part.querySelector(`#${CHANGE_BUTTON_NODE}`), {
        id: CHANGE_BUTTON,
        title: 'Ändra',
        onClick: () => this.onEdit(),
      });
    } else if (state.navigation.stage === index) {
      if (state.wantTradeIn && state.tradeIn) {
        new PartTradeIn(part, { store, lastStage });
      } else {
        part.innerHTML = `
          <div class="waykeecom-stack waykeecom-stack--3">
            <h4 class="waykeecom-heading waykeecom-heading--4">Har du en inbytesbil?</h4>
            <div class="waykeecom-content">
              <p>Har du en bil du vill byta in när du köper din nya bil? Här får du ett uppskattat inköpspris av oss direkt online.</p>
            </div>
          </div>
          
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--1" id="${TRADE_IN_YES_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--1" id="${TRADE_IN_NO_NODE}"></div>
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
    if (state.navigation.stage === index) {
      content.parentElement?.scrollIntoView();
    }
  }
}

export default TradeIn;
