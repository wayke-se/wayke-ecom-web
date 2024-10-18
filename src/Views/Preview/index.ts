import { StageTypes } from '../../@types/Stages';
import { Vehicle } from '../../@types/Vehicle';
import ButtonArrowRight from '../../Components/Button/ButtonArrowRight';
import CheckList from '../../Components/Checklist/Checklist';
import HtmlNode from '../../Components/Extension/HtmlNode';
import { getOrder } from '../../Data/getOrder';
import { goTo, setOrder, setStages } from '../../Redux/action';
import { WaykeStore } from '../../Redux/store';
import Alert from '../../Templates/Alert';
import ItemTileLarge from '../../Templates/ItemTileLarge';
import Loader from '../../Templates/Loader';
import { convertOrderOptionsResponse } from '../../Utils/convert';
import ecomEvent, { EcomEvent, EcomView } from '../../Utils/ecomEvent';
import { StageMapKeys, stageMap } from '../../Utils/stage';
import HowTo from './HowTo';

const PROCEED_BUTTON = 'preview-proceed';
const PROCEED_BUTTON_NODE = `${PROCEED_BUTTON}-node`;
const PREVIEW_CHECKLIST = 'preview-checklist';
const PREVIEW_CHECKLIST_NODE = `${PREVIEW_CHECKLIST}-node`;

interface PreviewProps {
  readonly store: WaykeStore;
  readonly stageOrderList: StageMapKeys[];
  readonly vehicle?: Vehicle;
  readonly cdnMedia?: string;
}

class Preview extends HtmlNode {
  private readonly props: PreviewProps;
  private contexts: { buttonProceed?: ButtonArrowRight } = {};
  private requestError = false;

  constructor(element: HTMLElement, props: PreviewProps) {
    super(element);
    this.props = props;
    this.init();
    this.render();
  }

  async init() {
    this.requestError = false;
    this.render();

    const state = this.props.store.getState();
    try {
      this.contexts.buttonProceed?.disabled(true);

      const _order = await getOrder(state.id);
      const order = convertOrderOptionsResponse(_order);
      const stages: StageTypes[] = [];
      this.props.stageOrderList.forEach((key) => {
        if (key === 'centralStorage' && !order.requiresDealerSelection) return;
        if (key === 'tradeIn' && !order.allowsTradeIn) return;
        if (key === 'insurance' && !order.insuranceOption) return;
        if (key === 'accessories' && !order.accessories.length) return;

        stages.push(stageMap[key]);
      });

      setStages(stages)(this.props.store.dispatch);

      setOrder(order, this.props.vehicle)(this.props.store.dispatch);
      this.render();
    } catch (e) {
      this.requestError = true;
      this.render();
      throw e;
    }
  }

  private onProceed() {
    ecomEvent(EcomView.PREVIEW, EcomEvent.PREVIEW_PROCEED);
    goTo('main')(this.props.store.dispatch);
  }

  render() {
    const { store, cdnMedia } = this.props;
    const state = store.getState();

    if (!state.order) {
      this.node.innerHTML = `
        ${
          this.requestError
            ? Alert({
                tone: 'error',
                children: `Ett fel uppstod och det gick inte att initiera modulen. Försök igen.`,
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
        ${ItemTileLarge({
          vehicle: state.vehicle,
          order: state.order,
          cdnMedia,
        })}
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
        onClick: () => this.onProceed(),
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
