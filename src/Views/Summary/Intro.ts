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
    const contactInformation = order?.getContactInformation();

    if (createdOrderId) {
      this.node.innerHTML = `
        <h3 class="waykeecom-heading waykeecom-heading--3">Tack för din order!</h3>
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-content">
            <p>
              <strong>Det här händer nu:</strong>
            </p>
            <ol>
              <li>En orderbekräftelse kommer att skickas till din e-postadress ${email}.*</li>
              <li>${contactInformation?.name} tar kontakt med dig för att gå igenom avtal, betalning och leverans.</li>
              <li>Klart! Kör försiktigt ute på vägarna.</li>
            </ol>
          </div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-disclaimer-text">*Orderbekräftelsen skickas normalt inom 10 minuter, men kan i undantagsfall dröja upp till 48 timmar.</div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-heading waykeecom-heading--4">Ordernummer ${createdOrderId}</div>
        </div>

    `;
    }
  }
}

export default Intro;
