import watch from 'redux-watch';
import { setInsurance, goTo } from '../../../Redux/action';
import store from '../../../Redux/store';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import ListItem from '../ListItem';

const PROCEED = 'button-accessories-proceed';
const CHANGE_BUTTON = 'button-accessories-change';

class Accessories {
  private element: HTMLDivElement;
  private index: number;
  private lastStage: boolean;

  constructor(element: HTMLDivElement, index: number, lastStage: boolean) {
    this.element = element;
    this.index = index;
    this.lastStage = lastStage;

    const w = watch(store.getState, 'navigation');
    store.subscribe(w(() => this.render()));
    const w2 = watch(store.getState, 'edit');
    store.subscribe(w2(() => this.render()));

    this.render();
  }

  private onProceed() {
    setInsurance(this.lastStage);
  }

  private onEdit() {
    goTo('main', this.index);
  }

  render() {
    const state = store.getState();

    const completed = state.topNavigation.stage > this.index;
    const content = ListItem(this.element, {
      completed,
      title: 'Tillbehör',
      active: state.navigation.stage === this.index,
      id: 'accessories',
    });

    const part = document.createElement('div');

    if (
      state.navigation.stage > this.index ||
      (completed && state.navigation.stage !== this.index)
    ) {
      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--1">
          <ul class="waykeecom-key-value-list">
            ${KeyValueListItem({
              key: 'Tillbehör',
              value: '[SELECTED_ACCESSORIES]',
            })}
          </ul>
        </div>
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-align waykeecom-align--end">
            <button id="${CHANGE_BUTTON}" title="Ändra försäkring" class="waykeecom-link">Ändra</button>
          </div>
        </div>
      `;
      part.querySelector(`#${CHANGE_BUTTON}`)?.addEventListener('click', () => this.onEdit());
      content.appendChild(part);
    } else if (state.navigation.stage === this.index) {
      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <div>[ACCESSORIES]</div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--3">
          <button type="button" id="${PROCEED}" title="Fortsätt till nästa steg" class="waykeecom-button waykeecom-button--full-width waykeecom-button--action">
            <span class="waykeecom-button__content">Fortsätt</span>
            <span class="waykeecom-button__content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                class="waykeecom-icon"
              >
                <title>Ikon: pil höger</title>
                <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
              </svg>
            </span>
          </button>
        </div>
      `;
      part
        .querySelector<HTMLButtonElement>(`#${PROCEED}`)
        ?.addEventListener('click', () => this.onProceed());
    }

    content.appendChild(part);
  }
}

export default Accessories;
