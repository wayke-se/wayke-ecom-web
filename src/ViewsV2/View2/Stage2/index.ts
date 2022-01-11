import store from '../../../Redux/store';
import ListItem from '../ListItem';

const RADIO_HOME_TRUE = 'radio-homeDelivery-true';
const RADIO_HOME_FALSE = 'radio-homeDelivery-false';

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
          <input type="radio" id="${RADIO_HOME_TRUE}" name="homeDelivery" value="true">
          <label for="${RADIO_HOME_TRUE}">Hämta hos handlaren</label>
        </div>
        <div>
          <input type="radio" id="${RADIO_HOME_FALSE}" name="homeDelivery" value="false">
          <label for="${RADIO_HOME_FALSE}">Hemleverans</label>
        </div>
    `;
      content.appendChild(part);
    }
  }
}

export default Stage2;
