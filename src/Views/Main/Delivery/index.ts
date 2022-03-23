import { DeliveryType } from '@wayke-se/ecom';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputRadioField from '../../../Components/Input/InputRadioField';
import StageCompleted from '../../../Components/StageCompleted';
import { goTo, setHomeDelivery } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import { getTotalDeliveryCost } from '../../../Utils/delivery';
import ListItem from '../../../Templates/ListItem';
import watch from '../../../Redux/watch';

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

  constructor(element: HTMLDivElement, props: DeliveryProps) {
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
  }

  private onProceed() {
    setHomeDelivery(this.homeDelivery, this.props.lastStage)(this.props.store.dispatch);
  }

  private onEdit() {
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  render() {
    const { store, index } = this.props;
    const state = store.getState();
    if (!state.order) throw 'Missing order...';

    const contactInformation = state.order.contactInformation;
    if (!contactInformation) throw 'Missing dealer contact information';

    const completed = state.topNavigation.stage > index;
    const content = ListItem(this.node, {
      completed,
      title: 'Leverans',
      active: state.navigation.stage === index,
      id: 'delivery',
    });

    if (state.navigation.stage > index || (completed && state.navigation.stage !== index)) {
      new StageCompleted(content, {
        keyValueList: [
          {
            key: 'Leveranssätt',
            value: state.homeDelivery ? 'Hemleverans' : 'Hämta hos handlaren',
          },
        ],
        changeButtonTitle: 'Ändra leveranssätt',
        onEdit: () => this.onEdit(),
      });
    } else if (state.navigation.stage === index) {
      const part = document.createElement('div');
      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <h4 class="waykeecom-heading waykeecom-heading--4">Hur vill du ha din bil levererad?</h4>
          <div class="waykeecom-content">
            <p class="waykeecom-content__p">Välj ifall du vill ha bilen levererad hem till dig eller ifall du vill hämta 
            den hos ${contactInformation.name}.</p>
          </div>
        </div>

        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-stack waykeecom-stack--3" id="${RADIO_HOME_FALSE_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--3" id="${RADIO_HOME_TRUE_NODE}"></div>
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
              meta: `<div class="waykeecom-text waykeecom-text--font-medium">${totalDeliveryCost} kr</div>`,
              checked: !this.homeDelivery,
              onClick: (e) => this.onChange(e),
            });
            break;
          case DeliveryType.Delivery:
            new InputRadioField(part.querySelector<HTMLInputElement>(`#${RADIO_HOME_TRUE_NODE}`), {
              id: RADIO_HOME_FALSE,
              name: 'homeDelivery',
              title: 'Hemleverans',
              value: 'true',
              description: `<div class="waykeecom-box">Till din folkbokföringsadress</div>`,
              meta: `<div class="waykeecom-text waykeecom-text--font-medium">${totalDeliveryCost} kr</div>`,
              checked: this.homeDelivery,
              onClick: (e) => this.onChange(e),
            });
            break;
          default:
            break;
        }
      });

      new ButtonArrowRight(part.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
        title: 'Gå vidare',
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
