import watch from 'redux-watch';
import { setInsurance, edit } from '../../../Redux/action';
import store from '../../../Redux/store';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import ListItem from '../ListItem';

const PROCEED = 'button-insurance-proceed';
const CHANGE_BUTTON = 'button-insurance-change';

class Insurance {
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
    edit(this.index);
  }

  render() {
    const state = store.getState();

    const completed = state.topNavigation.stage > this.index;
    const content = ListItem(this.element, {
      completed,
      title: 'Försäkring',
      active: state.navigation.stage === this.index,
      id: 'insurance',
    });

    const part = document.createElement('div');

    if (
      state.navigation.stage > this.index ||
      (completed && state.navigation.stage !== this.index)
    ) {
      part.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--1">
          <ul class="waykeecom-key-value-list">
            <li class="waykeecom-key-value-list__item">
              <div class="waykeecom-key-value-list__key">Försäkring</div>
              <div class="waykeecom-key-value-list__value"></div>
            </li>
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
          <div class="waykeecom-stack waykeecom-stack--2">
            <h4 class="waykeecom-heading waykeecom-heading--4">Vill du teckna en försäkring på din nya bil?</h4>
            <div class="waykeecom-content">
              <p>Ange din uppskattade körsträcka för att se din försäkringskostnad. Därefter presenterar vi förslag på försäkringar som passar dig och din nya bil. I både hel- och halvförsäkring ingår trafikförsäkring som är obligatoriskt att ha. Ifall du har valt att finansiera bilen med ett billån är priset du ser rabatterat.</p>
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--2">
            <div class="waykeecom-stack waykeecom-stack--1">
              <ul class="waykeecom-key-value-list">
                ${KeyValueListItem({
                  key: 'Uppskattad körsträcka',
                  value: '0-1 000 mil/år',
                })}
              </ul>
            </div>
            <div class="waykeecom-stack waykeecom-stack--1">
              <div class="waykeecom-align waykeecom-align--end">
                <button title="Ändra beräknad körsträcka" class="waykeecom-link">Ändra</button>
              </div>
            </div>
          </div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-overflow-grid">
            <div class="waykeecom-overflow-grid__list-wrapper">
              <ul class="waykeecom-overflow-grid__list">
                <li class="waykeecom-overflow-grid__item">
                  <div style="background: green; padding: 16px;">Grid item</div>
                </li>
                <li class="waykeecom-overflow-grid__item">
                  <div style="background: green; padding: 16px;">Grid item</div>
                </li>
                <li class="waykeecom-overflow-grid__item">
                  <div style="background: green; padding: 16px;">Grid item</div>
                </li>
              </ul>
            </div>
            <div class="waykeecom-overflow-grid__nav waykeecom-overflow-grid__nav--prev">
              <button title="Visa föregående försäkring" class="waykeecom-icon-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  class="waykeecom-icon"
                >
                  <title>Ikon: vinkel vänster</title>
                  <path d="m5.4 7 5.2-5 1 1-5.2 5 5.2 5-1.1 1-5.2-5-1-1 1.1-1z" />
                </svg>
              </button>
            </div>
            <div class="waykeecom-overflow-grid__nav waykeecom-overflow-grid__nav--next">
              <button title="Visa nästa försäkring" class="waykeecom-icon-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  class="waykeecom-icon"
                >
                  <title>Ikon: vinkel höger</title>
                  <path d="m10.5 9-5.2 5-1-1 5.2-5-5.2-5 1.1-1 5.2 5 1 1-1.1 1z" />
                </svg>
              </button>
            </div>
          </div>
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

export default Insurance;
