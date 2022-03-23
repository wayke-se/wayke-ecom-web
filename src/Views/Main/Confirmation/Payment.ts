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
        <h4 class="waykeecom-heading waykeecom-heading--4">Välj betalsätt</h4>
        <div class="waykeecom-content">
          <p class="waykeecom-content__p">Genomför en förskottsbetalning på 5% av bilens pris (10 995 kr) för att reservera bilen. Välj hur du vill genomföra betalningen.</p>
          <p class="waykeecom-content__p">Resterande del av kontantinsatsen 32 985 kr med eventuellt avdrag av värde för inbytesbil betalas hos ${name} vid kontraktskrivning. </p>

          <p class="waykeecom-content__p">Korttyp <span class="waykeecom-text waykeecom-text--font-medium">Credit</span></p>
          <p class="waykeecom-content__p">Kort utan 3d secure <span class="waykeecom-text waykeecom-text--font-medium">4925000000000004</span></p>
          <p class="waykeecom-content__p">Kort med 3d secure <span class="waykeecom-text waykeecom-text--font-medium">4761739001010416</span></p>
          <p class="waykeecom-content__p">MM/ÅÅ: <span class="waykeecom-text waykeecom-text--font-medium">12/25</span></p>
          <p class="waykeecom-content__p">CVC: <span class="waykeecom-text waykeecom-text--font-medium">123</span></p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div id="payment-menu" style="padding: 24px;border: 1px solid #ececeb;"></div>
      </div>
    `;
  }
}

export default Payment;
