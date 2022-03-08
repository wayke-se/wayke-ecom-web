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
import HtmlNode from '../../Components/Extension/HtmlNode';
import Alert from '../../Templates/Alert';

const PROCEED_BUTTON = 'preview-proceed';
const PROCEED_BUTTON_NODE = `${PROCEED_BUTTON}-node`;
const PREVIEW_CHECKLIST = 'preview-checklist';
const PREVIEW_CHECKLIST_NODE = `${PREVIEW_CHECKLIST}-node`;

class Preview extends HtmlNode {
  private stageOrderList: StageMapKeys[];
  private vehicle?: Vehicle;
  private contexts: { buttonProceed?: ButtonArrowRight } = {};
  private requestError = false;

  constructor(element: HTMLElement, stageOrderList: StageMapKeys[], vehicle?: Vehicle) {
    super(element);
    this.stageOrderList = stageOrderList;
    this.vehicle = vehicle;

    this.init();
    this.render();
  }

  async init() {
    this.requestError = false;
    this.render();

    const state = store.getState();
    try {
      this.contexts.buttonProceed?.disabled(true);

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
      this.render();
    } catch (e) {
      this.requestError = true;
      this.render();
      throw e;
    }
  }

  render() {
    const state = store.getState();

    if (!state.order) {
      this.node.innerHTML = `
        ${
          this.requestError
            ? Alert({
                tone: 'error',
                children: `<p>Ett fel uppstod och det gick inte att initiera modulen. Försök igen.</p>`,
              })
            : Loader()
        }
      `;
      return;
    }

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <h3 class="waykeecom-heading waykeecom-heading--3 waykeecom-no-margin">Vad roligt att du vill köpa denna bil!</h3>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        ${ItemTileLarge({ vehicle: state.vehicle, order: state.order })}
      </div>
      ${HowTo({ order: state.order, stageOrderList: state.stages })}
      <div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_BUTTON_NODE}"></div>
      <footer class="waykeecom-footer" id="${PREVIEW_CHECKLIST_NODE}"></footer>
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
