import watch from 'redux-watch';
import Attach from '../../../Components/Extension/Attach';
import StageCompleted from '../../../Components/StageCompleted';

import { goTo, completeStage } from '../../../Redux/action';
import store from '../../../Redux/store';
import ListItem from '../ListItem';
import AccessoryList from './AccessoryList';

const PROCEED = 'button-accessories-proceed';
const ACCESSORY_GRID_LIST_NODE = 'accessory-grid-list-node';
class Accessories extends Attach {
  private index: number;
  private lastStage: boolean;

  constructor(element: HTMLDivElement, index: number, lastStage: boolean) {
    super(element);
    this.index = index;
    this.lastStage = lastStage;

    const w = watch(store.getState, 'navigation');
    store.subscribe(w(() => this.render()));
    const w2 = watch(store.getState, 'edit');
    store.subscribe(w2(() => this.render()));

    this.render();
  }

  private onProceed() {
    completeStage(this.lastStage);
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
      new StageCompleted(content, {
        keyValueList: [
          {
            key: 'Tillbehör',
            value: state.accessories.length
              ? state.accessories.map((accessory) => accessory.name).join(', ')
              : 'Inga',
          },
        ],
        changeButtonTitle: 'Ändra tillbehör',
        onEdit: () => this.onEdit(),
      });
    } else if (state.navigation.stage === this.index) {
      const accessories = state.order?.getAccessories() || [];

      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--2">
            <h4 class="waykeecom-heading waykeecom-heading--4">Vill du teckna en försäkring på din nya bil?</h4>
            <div class="waykeecom-content">
              <p>Ange din uppskattade körsträcka för att se din försäkringskostnad. Därefter presenterar vi förslag på försäkringar som passar dig och din nya bil. I både hel- och halvförsäkring ingår trafikförsäkring som är obligatoriskt att ha. Ifall du har valt att finansiera bilen med ett billån är priset du ser rabatterat.</p>
            </div>
          </div>
        </div>

        <div class="waykeecom-stack waykeecom-stack--3" id="${ACCESSORY_GRID_LIST_NODE}"></div>
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

      new AccessoryList(
        part.querySelector<HTMLDivElement>(`#${ACCESSORY_GRID_LIST_NODE}`),
        accessories
      );

      part
        .querySelector<HTMLButtonElement>(`#${PROCEED}`)
        ?.addEventListener('click', () => this.onProceed());
    }

    content.appendChild(part);
  }
}

export default Accessories;
