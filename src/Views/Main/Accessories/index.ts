import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonSkip from '../../../Components/Button/ButtonSkip';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import StageCompleted from '../../../Components/StageCompleted';

import i18next from 'i18next';
import { completeStage, goTo } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import ListItem from '../../../Templates/ListItem';
import ecomEvent, { EcomStep, EcomEvent, EcomView } from '../../../Utils/ecomEvent';
import { prettyNumber } from '../../../Utils/format';
import AccessoryList from './AccessoryList';

const PROCEED = 'button-accessories-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

const SKIP = 'button-accessories-skip';
const SKIP_NODE = `${SKIP}-node`;

const ACCESSORY_GRID_LIST_NODE = 'accessory-grid-list-node';

interface AccessoriesProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class Accessories extends HtmlNode {
  private readonly props: AccessoriesProps;

  constructor(element: HTMLElement, props: AccessoriesProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.render();
  }

  private onProceed() {
    completeStage(this.props.lastStage)(this.props.store.dispatch);
  }

  private onEdit() {
    ecomEvent(EcomView.MAIN, EcomEvent.ACCESSORY_EDIT, EcomStep.ACCESSORY);
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  render() {
    const { store, index } = this.props;
    const state = store.getState();

    const completed = state.topNavigation.stage > index;
    const active = state.navigation.stage === index;
    if (active) {
      ecomEvent(EcomView.MAIN, EcomEvent.ACCESSORY_ACTIVE, EcomStep.ACCESSORY);
    }
    const content = ListItem(this.node, {
      completed,
      title: i18next.t('accessories.title'),
      active,
      id: 'accessories',
      index: index,
    });

    const part = document.createElement('div');

    if (state.navigation.stage > index || (completed && state.navigation.stage !== index)) {
      new StageCompleted(content, {
        keyValueList: !!state.accessories.length
          ? state.accessories.map((accessory) => ({
              key: accessory.name,
              image: accessory.media[0]
                ? {
                    src: `${accessory.media[0].url}?w=32&h=32`,
                    srcSet: `${accessory.media[0].url}?w=64&h=64 2x`,
                    alt: accessory.name,
                  }
                : undefined,
              value: prettyNumber(accessory.price, { postfix: 'kr' }),
            }))
          : [
              {
                key: i18next.t('accessories.title'),
                value: i18next.t('accessories.noSelected'),
              },
            ],
        changeButtonTitle: i18next.t('accessories.changeButtonTitle'),
        onEdit: !state.createdOrderId ? () => this.onEdit() : undefined,
      });
    } else if (state.navigation.stage === index) {
      const accessories = state.order?.accessories || [];

      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--2">
            <h4 class="waykeecom-heading waykeecom-heading--4">${i18next.t('accessories.heading')}</h4>
            <div class="waykeecom-content">
              <p class="waykeecom-content__p">${i18next.t('accessories.description')}</p>
            </div>
          </div>
        </div>

        <div class="waykeecom-stack waykeecom-stack--3" id="${ACCESSORY_GRID_LIST_NODE}"></div>

        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--1" id="${PROCEED_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--1" id="${SKIP_NODE}"></div>
      </div>
      `;

      new AccessoryList(part.querySelector<HTMLDivElement>(`#${ACCESSORY_GRID_LIST_NODE}`), {
        store,
        accessories,
      });

      new ButtonArrowRight(part.querySelector(`#${PROCEED_NODE}`), {
        id: PROCEED,
        title: i18next.t('accessories.proceedButton'),
        onClick: () => this.onProceed(),
      });

      new ButtonSkip(part.querySelector<HTMLDivElement>(`#${SKIP_NODE}`), {
        title: i18next.t('accessories.skipButton'),
        onClick: () => this.onProceed(),
      });
    }

    content.appendChild(part);
    if (state.navigation.stage === index) {
      content.parentElement?.scrollIntoView();
    }
  }
}

export default Accessories;
