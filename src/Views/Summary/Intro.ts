import i18next from '@i18n';
import StackNode from '../../Components/Extension/StackNode';
import { WaykeStore } from '../../Redux/store';

interface IntroProps {
  readonly store: WaykeStore;
}

class Intro extends StackNode {
  private readonly props: IntroProps;

  constructor(element: HTMLElement, props: IntroProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { store } = this.props;
    const { customer, order, createdOrderId } = store.getState();
    const email = customer.email;
    const contactInformation = order?.contactInformation;

    if (createdOrderId) {
      this.node.innerHTML = `
        <h3 class="waykeecom-heading waykeecom-heading--3">${i18next.t('summary.thankYou')}</h3>
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-content">
            <p class="waykeecom-content__p">
              <span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('summary.whatHappensNext')}</span>
            </p>
            <ol class="waykeecom-content__ol">
              <li class="waykeecom-content__li">${i18next.t('summary.orderConfirmation', { email })}</li>
              <li class="waykeecom-content__li">${i18next.t('summary.contactFromDealer', { contactName: contactInformation?.name })}</li>
              <li class="waykeecom-content__li">${i18next.t('summary.driveSafely')}</li>
            </ol>
          </div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-disclaimer-text">${i18next.t('summary.orderConfirmationDisclaimer')}</div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-heading waykeecom-heading--4">${i18next.t('summary.orderNumber', { createdOrderId })}</div>
        </div>
      `;
    }
  }
}

export default Intro;
