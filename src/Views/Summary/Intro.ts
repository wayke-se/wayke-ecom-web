import StackNode from '../../Components/Extension/StackNode';
import store from '../../Redux/store';

interface IntroProps {
  createdOrderId?: string;
}

class Intro extends StackNode {
  private props: IntroProps;

  constructor(element: HTMLElement, props: IntroProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const state = store.getState();
    const email = state.customer.email;
    const contactInformation = state.order?.getContactInformation();

    if (this.props.createdOrderId) {
      this.node.innerHTML = `
        <h2 class="waykeecom-heading waykeecom-heading--2">Allt är klart, tack för din order!</h2>
        <div class="waykeecom-content">
          <p>Ditt ordernummer är: 
            <strong>${this.props.createdOrderId}</strong>
          </p>
        </div>
        <h3 class="waykeecom-heading waykeecom-heading--3">Det här händer nu:</h3>
        <div class="waykeecom-content">
          <ol>
            <li>En orderbekräftelse kommer att skickas till din e-postadress ${email}.*</li>
            <li>${contactInformation?.name} tar kontakt med dig för att gå igenom avtal, betalning och leverans.</li>
            <li>Klart! Kör försiktigt ute på vägarna.</li>
          </ol>
          <p>*Orderbekräftelsen skickas normalt inom 10 minuter, men kan i undantagsfall dröja upp till 48 timmar.</p>
        </div>

    `;
    } else {
      this.node.innerHTML = `
        <h2 class="waykeecom-heading waykeecom-heading--2">Sammanställning</h2>
        <div class="waykeecom-content">
          <p>
            <strong>Strax klart!</strong>
          </p>
          <p>Granska och godkänn din order för att reservera bilen. Efter det kommer ${contactInformation?.name} att kontakta dig för att slutföra köpet.</p>
          <p>Köpet blir bindande först när du signerat det definitiva affärsförslaget med ${contactInformation?.name}. Det är även då betalningen sker. </p>
        </div>
      `;
    }
  }
}

export default Intro;
