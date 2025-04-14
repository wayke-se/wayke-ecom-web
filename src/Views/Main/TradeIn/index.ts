import i18next from '@i18n';
import { MarketCode } from '../../../@types/MarketCode';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonAsLink from '../../../Components/Button/ButtonAsLink';
import ButtonSkip from '../../../Components/Button/ButtonSkip';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { goTo, initTradeIn, setTradeIn } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import Alert from '../../../Templates/Alert';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import ListItem from '../../../Templates/ListItem';
import { translateTradeInCondition } from '../../../Utils/constants';
import ecomEvent, { EcomStep, EcomEvent, EcomView } from '../../../Utils/ecomEvent';
import { prettyNumber } from '../../../Utils/format';
import PartTradeIn from './PartTradeIn';

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
  readonly marketCode: MarketCode;
}

class TradeIn extends HtmlNode {
  private readonly props: TradeInProps;

  constructor(element: HTMLElement, props: TradeInProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.render();
  }

  private onEdit() {
    ecomEvent(EcomView.MAIN, EcomEvent.TRADE_IN_EDIT, EcomStep.TRADE_IN);
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  private onYesTradeIn() {
    ecomEvent(EcomView.MAIN, EcomEvent.TRADE_IN_SELECTED, EcomStep.TRADE_IN);
    initTradeIn(this.props.lastStage)(this.props.store.dispatch);
  }

  private onNoTradeIn() {
    ecomEvent(EcomView.MAIN, EcomEvent.TRADE_IN_SKIPPED, EcomStep.TRADE_IN);
    setTradeIn(this.props.lastStage)(this.props.store.dispatch);
  }

  render() {
    const { store, index, lastStage } = this.props;
    const state = this.props.store.getState();
    if (!state.order?.allowsTradeIn) return;

    const completed = state.topNavigation.stage > index;
    const active = state.navigation.stage === index;
    if (active) {
      ecomEvent(
        EcomView.MAIN,
        EcomEvent.TRADE_IN_ACTIVE,
        state.navigation.subStage === 1 ? EcomStep.TRADE_IN : EcomStep.TRADE_IN_DETAILS
      );
    }
    const content = ListItem(this.node, {
      title: i18next.t('tradeIn.title'),
      active,
      completed,
      id: 'trade-in',
      index: index,
    });
    content.innerHTML = '';

    const part = document.createElement('div');

    if (state.navigation.stage > index || (completed && state.navigation.stage !== index)) {
      const keyValueItemsUpper: { key: string; value: string }[] = [];

      if (state.tradeIn && state.tradeInVehicle) {
        keyValueItemsUpper.push({
          key: i18next.t('tradeIn.mileage'),
          value: `${state.tradeIn.mileage} ${this.props.marketCode === 'SE' ? 'mil' : 'km'}`,
        });
        if (state.tradeIn.description)
          keyValueItemsUpper.push({
            key: i18next.t('tradeIn.description'),
            value: `${state.tradeIn.description}`,
          });
        if (state.tradeIn.condition)
          keyValueItemsUpper.push({
            key: i18next.t('tradeIn.condition'),
            value: translateTradeInCondition[state.tradeIn.condition],
          });

        part.innerHTML = `
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-balloon">
              <div class="waykeecom-stack waykeecom-stack--05">
                <div class="waykeecom-label">${state.tradeIn.registrationNumber}</div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--05">
                <span class="waykeecom-text waykeecom-text--font-medium">${
                  state.tradeInVehicle.manufacturer
                } ${state.tradeInVehicle.modelSeries}</span>
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
            ${
              !state.createdOrderId
                ? `
                  <div class="waykeecom-stack waykeecom-stack--1">
                    <div class="waykeecom-align waykeecom-align--end" id="${CHANGE_BUTTON_NODE}"></div>
                  </div>
                `
                : ''
            }
          </div>
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-shadow-box">
              <div class="waykeecom-stack waykeecom-stack--2">
                <ul class="waykeecom-key-value-list waykeecom-key-value-list--large-value">
                  ${KeyValueListItem({
                    key: i18next.t('tradeIn.estimatedValue'),
                    value: `~ ${prettyNumber(state.tradeInVehicle.valuation, { postfix: 'kr' })}`,
                  })}
                </ul>
              </div>
              <div class="waykeecom-stack waykeecom-stack--2">
               ${Alert({
                 tone: 'info',
                 children: `<span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('tradeIn.infoText')}</span> ${i18next.t('tradeIn.infoDisclaimer')}`,
               })}
              </div>
            </div>
          </div>
        `;
        part.querySelector(`#${CHANGE_BUTTON}`)?.addEventListener('click', () => this.onEdit());
      } else {
        keyValueItemsUpper.push({
          key: i18next.t('tradeIn.title'),
          value: i18next.t('tradeIn.no'),
        });
        part.innerHTML = `
          <div class="waykeecom-stack waykeecom-stack--1">
            <ul class="waykeecom-key-value-list">
            ${keyValueItemsUpper.map((kv) => KeyValueListItem(kv)).join('')}
            </ul>
          </div>
          ${
            !state.createdOrderId
              ? `
                <div class="waykeecom-stack waykeecom-stack--1">
                  <div class="waykeecom-align waykeecom-align--end" id="${CHANGE_BUTTON_NODE}"></div>
                </div>
              `
              : ''
          }
        `;
      }
      if (!state.createdOrderId) {
        new ButtonAsLink(part.querySelector(`#${CHANGE_BUTTON_NODE}`), {
          id: CHANGE_BUTTON,
          title: i18next.t('tradeIn.changeButtonTitle'),
          onClick: () => this.onEdit(),
        });
      }
    } else if (state.navigation.stage === index) {
      if (state.wantTradeIn && state.tradeIn) {
        new PartTradeIn(part, { store, lastStage, marketCode: this.props.marketCode });
      } else {
        part.innerHTML = `
          <div class="waykeecom-stack waykeecom-stack--3">
            <h4 class="waykeecom-heading waykeecom-heading--4">${i18next.t('tradeIn.heading')}</h4>
            <div class="waykeecom-content">
              <p class="waykeecom-content__p">${i18next.t('tradeIn.tradeInDescription')}</p>
            </div>
          </div>
          
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--1" id="${TRADE_IN_YES_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--1" id="${TRADE_IN_NO_NODE}"></div>
          </div>
        `;

        new ButtonArrowRight(part.querySelector<HTMLDivElement>(`#${TRADE_IN_YES_NODE}`), {
          id: TRADE_IN_YES,
          title: i18next.t('tradeIn.yesButton'),
          onClick: () => this.onYesTradeIn(),
        });

        new ButtonSkip(part.querySelector<HTMLDivElement>(`#${TRADE_IN_NO_NODE}`), {
          id: TRADE_IN_NO,
          title: i18next.t('tradeIn.skipButton'),
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
