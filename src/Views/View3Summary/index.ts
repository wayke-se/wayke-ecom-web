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
        <div class="waykeecom-page">
          <div class="waykeecom-page__body">
            <div class="waykeecom-container waykeecom-container--narrow">
              <div class="waykeecom-stack waykeecom-stack--4">
                <h2 class="waykeecom-heading waykeecom-heading--2">Sammanställning</h2>
                <div class="waykeecom-content">
                  <p>
                    <strong>Strax klart!</strong>
                  </p>
                  <p>Granska och godkänn din order för att reservera bilen. Efter det kommer ${contactInformation?.name} att kontakta dig för att slutföra köpet.</p>
                  <p>Köpet blir bindande först när du signerat det definitiva affärsförslaget med ${contactInformation?.name}. Det är även då betalningen sker. </p>
                </div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <h3 class="waykeecom-heading waykeecom-heading--3">Din order</h3>
                <div>ORDER...</div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <h4 class="waykeecom-heading waykeecom-heading--4">Inbytesbil</h4>
                <div>CONTENT...</div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <h4 class="waykeecom-heading waykeecom-heading--4">Leverans</h4>
                <div>CONTENT...</div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <h4 class="waykeecom-heading waykeecom-heading--4">Kunduppgifter</h4>
                <div>CONTENT...</div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <div>BUTTON</div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <div>BUTTON</div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <div>DISCLAIMER</div>
              </div>
            </div>
          </div>
        </div>
    `;
  }
}

export default View3Summary;
