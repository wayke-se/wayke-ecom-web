import i18next from 'i18next';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import { swedbankPayment } from '../../../Utils/payment';

type SupportedPaymentTypes = 'swedbank';

interface PaymentProps {
  store: WaykeStore;
}

class Payment extends HtmlNode {
  private props: PaymentProps;

  constructor(element: HTMLElement | null, props: PaymentProps) {
    super(element);
    this.props = props;

    this.render();
    this.init();
  }

  init() {
    const { payment: _payment } = this.props.store.getState();
    const payment = _payment as unknown as { type: string; url: string };
    sessionStorage.setItem('wayke-ecom-state', JSON.stringify(this.props.store.getState()));

    switch (payment.type as SupportedPaymentTypes) {
      case 'swedbank':
        swedbankPayment(payment.url);
        break;

      default:
        break;
    }
  }

  render() {
    const { order } = this.props.store.getState();

    const name = order?.contactInformation?.name;

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <h4 class="waykeecom-heading waykeecom-heading--4">${i18next.t('confirmation.paymentHeading')}</h4>
        <div class="waykeecom-content">
          <p class="waykeecom-content__p">${i18next.t('confirmation.paymentDescription')}</p>
          <p class="waykeecom-content__p">${i18next.t('confirmation.paymentDescription2', { name })}</p>

          <p class="waykeecom-content__p">${i18next.t('confirmation.paymentCardType')} <span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('confirmation.paymentCardTypeValue')}</span></p>
          <p class="waykeecom-content__p">${i18next.t('confirmation.paymentCardNo3DSecure')} <span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('confirmation.paymentCardNo3DSecureValue')}</span></p>
          <p class="waykeecom-content__p">${i18next.t('confirmation.paymentCard3DSecure')} <span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('confirmation.paymentCard3DSecureValue')}</span></p>
          <p class="waykeecom-content__p">${i18next.t('confirmation.paymentExpiry')} <span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('confirmation.paymentExpiryValue')}</span></p>
          <p class="waykeecom-content__p">${i18next.t('confirmation.paymentCVC')} <span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('confirmation.paymentCVCValue')}</span></p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div id="payment-menu" style="padding: 24px;border: 1px solid #ececeb;"></div>
      </div>
    `;
  }
}

export default Payment;
