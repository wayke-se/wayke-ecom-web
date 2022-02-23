import store from '../../Redux/store';
import StackItem from '../Main/TradeIn/StackItem';

class Intro {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const state = store.getState();
    const contactInformation = state.order?.getContactInformation();

    const content = StackItem(this.element);

    content.innerHTML = `
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

export default Intro;
