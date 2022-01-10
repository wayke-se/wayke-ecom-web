import store from '../../../Redux/store';
import ListItem from '../ListItem';

class Stage2 {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const state = store.getState();
    if (!state.order) throw 'Missing order...';

    const contactInformation = state.order.getContactInformation();
    const content = ListItem(this.element, 'Leverans', state.stage === 2);

    if (state.stage === 2) {
      const part = document.createElement('div');
      part.innerHTML = `
        <div class="stack stack--3">
          <h4 class="heading heading--4">Hur vill du ha din bil levererad?</h4>
          <div class="content">
            <p>Välj ifall du vill ha bilen levererad hem till dig eller ifall du vill hämta 
            den hos ${contactInformation?.name}.</p>
          </div>
        </div>
        <div>
          <input type="radio" id="radio-homeDelivery-true" name="homeDelivery" value="true">
          <label for="radio-homeDelivery-true">Hämta hos handlaren</label>
        </div>
        <div>
          <input type="radio" id="radio-homeDelivery-false" name="homeDelivery" value="false">
          <label for="radio-homeDelivery-false">Hemleverans</label>
        </div>
    `;
      content.appendChild(part);
    }
  }
}

export default Stage2;
