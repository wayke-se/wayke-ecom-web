import watch from 'redux-watch';

import ItemTileLarge from '../../Templates/ItemTileLarge';
import { getOrder } from '../../Data/getOrder';
import { goTo, setOrder, setStages } from '../../Redux/action';
import store from '../../Redux/store';
import HowTo from './HowTo';
import ButtonArrowRight from '../../Components/Button/ButtonArrowRight';
import { StageTypes } from '../../@types/Stages';
import { stageMap, StageMapKeys } from '../../Utils/stage';
import Loader from '../../Templates/Loader';
import { Vehicle } from '../../@types/Vehicle';
import CheckList from '../../Components/Checklist/Checklist';

const PROCEED_BUTTON = 'preview-proceed';
const PROCEED_BUTTON_NODE = `${PROCEED_BUTTON}-node`;
const PREVIEW_CHECKLIST = 'preview-checklist';
const PREVIEW_CHECKLIST_NODE = `${PREVIEW_CHECKLIST}-node`;

class Preview {
  private element: Element;
  private loader?: HTMLDivElement;
  private stageOrderList: StageMapKeys[];
  private vehicle?: Vehicle;
  private contexts: { buttonProceed?: ButtonArrowRight } = {};

  constructor(element: Element, stageOrderList: StageMapKeys[], vehicle?: Vehicle) {
    this.element = element;
    this.stageOrderList = stageOrderList;
    this.vehicle = vehicle;

    const w = watch(store.getState, 'order');
    store.subscribe(
      w(() => {
        this.render();
      })
    );

    this.init();
    this.render();
  }

  async init() {
    const state = store.getState();
    try {
      this.contexts.buttonProceed?.disabled(true);
      if (this.loader) {
        this.loader.style.display = '';
      }
      const order = await getOrder(state.id);
      const { centralStorage } = state;

      const stages: StageTypes[] = [];
      this.stageOrderList.forEach((key) => {
        if (key === 'centralStorage' && !centralStorage) return;
        if (key === 'tradeIn' && !order.allowsTradeIn) return;
        if (key === 'insurance' && !order.getInsuranceOption()) return;
        if (key === 'accessories' && !order.getAccessories().length) return;

        stages.push(stageMap[key]);
      });
      setStages(stages);

      setOrder(order, this.vehicle);
      this.contexts.buttonProceed?.disabled(false);
      this.render();
    } catch (e) {
      throw e;
    } finally {
      if (this.loader) {
        this.loader.style.display = 'none';
      }
    }
  }

  render() {
    const state = store.getState();

    if (!state.order) {
      this.element.innerHTML = `
        <div class="waykeecom-page">
          <div class="waykeecom-page__body">
            <div class="waykeecom-container waykeecom-container--narrow">
              ${Loader()}
            </div>
          </div>
        </div>
      `;
      return;
    }

    this.element.innerHTML = `
      <div class="waykeecom-page">
        <div class="waykeecom-page__body">
          <div class="waykeecom-container waykeecom-container--narrow">
            <div class="waykeecom-stack waykeecom-stack--3">
              <h3 class="waykeecom-heading waykeecom-heading--3 waykeecom-no-margin">Vad roligt att du vill köpa denna bil!</h3>
            </div>
            <div class="waykeecom-stack waykeecom-stack--3">
              ${ItemTileLarge({ vehicle: state.vehicle, order: state.order })}
            </div>
            ${HowTo({ order: state.order, stageOrderList: state.stages })}
            <div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_BUTTON_NODE}"></div>
          </div>
        </div>
        <footer class="waykeecom-page__footer">
          <div class="waykeecom-container waykeecom-container--narrow" id="${PREVIEW_CHECKLIST_NODE}">
          </div>
        </footer>
      </div>
    `;

    this.contexts.buttonProceed = new ButtonArrowRight(
      document.querySelector<HTMLDivElement>(`#${PROCEED_BUTTON_NODE}`),
      {
        id: PROCEED_BUTTON,
        title: 'Gå vidare',
        onClick: () => goTo('main'),
      }
    );

    new CheckList(document.querySelector<HTMLDivElement>(`#${PREVIEW_CHECKLIST_NODE}`), {
      title: 'Köp online hos Wayke',
      ariaLabel: 'Fördelar med att köpa bilen online hos Wayke',
      checklistItems: [
        'Trygg hantering av personuppgifter',
        'Reservera bilen nu – betalning och avtalsskrivning sker senare med handlaren',
        'Inte bindande förrän avtal skrivits ihop med handlaren',
        'Bara kontrollerade bilar',
      ],
    });
  }
}

export default Preview;
