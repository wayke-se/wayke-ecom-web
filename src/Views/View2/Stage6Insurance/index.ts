import { setInsurance, editInsurance } from '../../../Redux/action';
import store from '../../../Redux/store';
import ListItem from '../ListItem';

const PROCEED = 'button-insurance-proceed';
const CHANGE_BUTTON = 'button-insurance-change';
const STAGE = 6;

class Stage6Insurance {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  onProceed() {
    setInsurance();
  }

  onEdit() {
    editInsurance();
  }

  render() {
    const state = store.getState();
    const content = ListItem(this.element, 'Försäkring', state.navigation.stage === STAGE);

    const part = document.createElement('div');

    if (state.navigation.stage > STAGE) {
      part.innerHTML = `
      <div class="stack stack--1">
          <ul class="key-value-list">
            <li class="key-value-list__item">
              <div class="key-value-list__key">Försäkring</div>
              <div class="key-value-list__value"></div>
            </li>
          </ul>
        </div>
        <div class="stack stack--1">
          <button id="${CHANGE_BUTTON}" title="Ändra dina uppgifter" class="link">Ändra</button>
        </div>
      `;
      part.querySelector(`#${CHANGE_BUTTON}`)?.addEventListener('click', () => this.onEdit());
      content.appendChild(part);
    } else if (state.navigation.stage === STAGE) {
      part.innerHTML = `
        <div class="stack stack--3">
          <h4 class="heading heading--4">Vill du teckna en försäkring på din nya bil?</h4>
          <div class="content">
            <p>Ange din uppskattade körsträcka för att se din försäkringskostnad. Därefter presenterar vi förslag på försäkringar som passar dig och din nya bil. I både hel- och halvförsäkring ingår trafikförsäkring som är obligatoriskt att ha. Ifall du har valt att finansiera bilen med ett billån är priset du ser rabatterat.</p>
          </div>
        </div>
        <button type="button" id="${PROCEED}" title="Fortsätt till nästa steg" class="button button--full-width button--action">
          <span class="button__content">Fortsätt</span>
          <span class="button__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="icon"
            >
              <title>Ikon: pil höger</title>
              <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
            </svg>
          </span>
        </button>
      `;
      part
        .querySelector<HTMLButtonElement>(`#${PROCEED}`)
        ?.addEventListener('click', () => this.onProceed());
    }

    content.appendChild(part);
  }
}

export default Stage6Insurance;
