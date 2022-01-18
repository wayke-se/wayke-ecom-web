import store from '../../Redux/store';

class View3Summary {
  private element: Element;

  constructor(element: Element) {
    this.element = element;
    store.subscribe(() => this.render());
    this.render();
  }

  render() {
    const state = store.getState();

    const { order } = state;

    const contactInformation = order?.getContactInformation();
    this.element.innerHTML = `
        <div>
          <h3>Sammanställning</h3>
          <p><b>Strax klart!</b></p>
          <p>Granska och godkänn din order för att reservera bilen. Efter det kommer ${contactInformation?.name} att kontakta dig för att slutföra köpet.</p>
          <p>Köpet blir bindande först när du signerat det definitiva affärsförslaget med ${contactInformation?.name}. Det är även då betalningen sker. </p>
        </div>
    `;
  }
}

export default View3Summary;
