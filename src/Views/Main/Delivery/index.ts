import { DeliveryType } from '@wayke-se/ecom';
import i18next from 'i18next';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputRadioField from '../../../Components/Input/InputRadioField';
import StageCompleted from '../../../Components/StageCompleted';
import { goTo, setHomeDelivery } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import Alert from '../../../Templates/Alert';
import ListItem from '../../../Templates/ListItem';
import { getTotalDeliveryCost } from '../../../Utils/delivery';
import ecomEvent, { EcomStep, EcomEvent, EcomView } from '../../../Utils/ecomEvent';
import { prettyNumber } from '../../../Utils/format';

const RADIO_HOME_TRUE = 'radio-home-delivery-true';
const RADIO_HOME_TRUE_NODE = `${RADIO_HOME_TRUE}-node`;

const RADIO_HOME_FALSE = 'radio-home-delivery-false';
const RADIO_HOME_FALSE_NODE = `${RADIO_HOME_FALSE}-node`;

const PROCEED = 'button-home-delivery-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

interface DeliveryProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class Delivery extends HtmlNode {
  private readonly props: DeliveryProps;
  private homeDelivery: boolean;

  constructor(element: HTMLElement, props: DeliveryProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    const state = this.props.store.getState();
    this.homeDelivery = state.homeDelivery;
    this.render();
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const value = currentTarget.value === 'true';
    this.homeDelivery = value;
    ecomEvent(
      EcomView.MAIN,
      this.homeDelivery ? EcomEvent.DELIVERY_HOME_SELECTED : EcomEvent.DELIVERY_DEALER_SELECTED,
      EcomStep.DELIVERY
    );
  }

  private onProceed() {
    setHomeDelivery(this.homeDelivery, this.props.lastStage)(this.props.store.dispatch);
    ecomEvent(
      EcomView.MAIN,
      this.homeDelivery ? EcomEvent.DELIVERY_HOME_SET : EcomEvent.DELIVERY_DEALER_SET,
      EcomStep.DELIVERY
    );
  }

  private onEdit() {
    ecomEvent(EcomView.MAIN, EcomEvent.DELIVERY_EDIT, EcomStep.DELIVERY);
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  render() {
    const { store, index } = this.props;
    const state = store.getState();
    if (!state.order) throw 'Missing order...';

    const contactInformation = state.order.contactInformation;
    if (!contactInformation) throw 'Missing dealer contact information';

    const completed = state.topNavigation.stage > index;
    const active = state.navigation.stage === index;
    if (active) {
      ecomEvent(EcomView.MAIN, EcomEvent.DELIVERY_ACTIVE, EcomStep.DELIVERY);
    }
    const content = ListItem(this.node, {
      completed,
      title: i18next.t('delivery.title'),
      active,
      id: 'delivery',
      index: index,
    });

    if (state.navigation.stage > index || (completed && state.navigation.stage !== index)) {
      new StageCompleted(content, {
        keyValueList: [
          {
            key: i18next.t('delivery.deliveryMethod'),
            value: state.homeDelivery
              ? i18next.t('delivery.homeDelivery')
              : i18next.t('delivery.pickup'),
          },
        ],
        changeButtonTitle: i18next.t('delivery.changeDeliveryMethod'),
        onEdit: !state.createdOrderId ? () => this.onEdit() : undefined,
      });
    } else if (state.navigation.stage === index) {
      const part = document.createElement('div');
      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <h4 class="waykeecom-heading waykeecom-heading--4">${i18next.t('delivery.heading')}</h4>
          <div class="waykeecom-content">
            <p class="waykeecom-content__p">${i18next.t('delivery.description', { name: contactInformation.name })}</p>
          </div>
        </div>

        <div class="waykeecom-stack waykeecom-stack--3">
          <fieldset class="waykeecom-input-group" role="radiogroup" aria-required="true" aria-label="${i18next.t('delivery.deliveryMethod')}">
            <div class="waykeecom-input-group__item" id="${RADIO_HOME_FALSE_NODE}"></div>
            <div class="waykeecom-input-group__item" id="${RADIO_HOME_TRUE_NODE}"></div>
          </fieldset>
        </div>

        <div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_NODE}"></div>
      `;

      const deliveryOptions = state.order.deliveryOptions;
      deliveryOptions.forEach((deliveryOption) => {
        const addressDistance = state.address?.distance;
        const totalDeliveryCost = getTotalDeliveryCost(addressDistance, deliveryOption) || 0;

        switch (deliveryOption.type) {
          case DeliveryType.Pickup:
            new InputRadioField(part.querySelector<HTMLInputElement>(`#${RADIO_HOME_FALSE_NODE}`), {
              id: RADIO_HOME_TRUE,
              name: 'homeDelivery',
              title: i18next.t('delivery.pickup'),
              value: 'false',
              description: `
                <div class="waykeecom-box">
                  <div class="waykeecom-icon-content">
                    <div class="waykeecom-icon-content__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        class="waykeecom-icon"
                        data-icon="Location pin"
                      >
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
              meta: `<div class="waykeecom-text waykeecom-text--font-bold">${
                totalDeliveryCost === 0
                  ? i18next.t('delivery.free')
                  : prettyNumber(totalDeliveryCost, {
                      postfix: 'kr',
                    })
              }</div>`,
              checked: !this.homeDelivery,
              onClick: (e) => this.onChange(e),
            });
            break;
          case DeliveryType.Delivery:
            const distance = state.address?.distance?.value || 0;
            const maxDistance = deliveryOption.unitPrice || 0;

            const tooFarAway = distance > maxDistance;

            new InputRadioField(part.querySelector<HTMLInputElement>(`#${RADIO_HOME_TRUE_NODE}`), {
              id: RADIO_HOME_FALSE,
              name: 'homeDelivery',
              title: i18next.t('delivery.homeDelivery'),
              value: 'true',
              disabled: tooFarAway,
              description: `<div class="waykeecom-box">
                <div class="waykeecom-stack waykeecom-stack--2">${i18next.t('delivery.toYourAddress')}</div>
                ${
                  tooFarAway
                    ? `<div class="waykeecom-stack waykeecom-stack--2">${Alert({
                        tone: 'info',
                        children: i18next.t('delivery.tooFarAway'),
                      })}</div>`
                    : ''
                }</div>`,
              meta: `<div class="waykeecom-text waykeecom-text--font-bold">${
                tooFarAway
                  ? '-'
                  : prettyNumber(totalDeliveryCost, {
                      postfix: 'kr',
                    })
              }</div>`,
              checked: this.homeDelivery,
              onClick: (e) => this.onChange(e),
            });
            break;
          default:
            break;
        }
      });

      new ButtonArrowRight(part.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
        title: i18next.t('delivery.proceedButton'),
        id: PROCEED,
        onClick: () => this.onProceed(),
      });

      content.appendChild(part);
      if (state.navigation.stage === index) {
        content.parentElement?.scrollIntoView();
      }
    }
  }
}

export default Delivery;
