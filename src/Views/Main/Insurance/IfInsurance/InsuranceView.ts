import { IInsuranceOption } from '@wayke-se/ecom';
import ButtonArrowRight from '../../../../Components/Button/ButtonArrowRight';
import ButtonAsLink from '../../../../Components/Button/ButtonAsLink';
import ButtonSkip from '../../../../Components/Button/ButtonSkip';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import { getInsurances } from '../../../../Data/getInsurances';
import { addOrRemoveInsurance, completeStage } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import watch from '../../../../Redux/watch';
import Alert from '../../../../Templates/Alert';
import KeyValueListItem from '../../../../Templates/KeyValueListItem';
import Loader from '../../../../Templates/Loader';
import { translateDrivingDistance } from '../../../../Utils/constants';
import InsuranceList from './InsuranceList';

const INSURANCE_GRID_LIST_NODE = 'insurance-grid-list-node';

const PROCEED_INSURANCE = 'button-insurances-proceed';
const PROCEED_INSURANCE_NODE = `${INSURANCE_GRID_LIST_NODE}-node`;

const SKIP_INSURANCES = 'button-insurances-skip';
const SKIP_INSURANCES_NODE = `${SKIP_INSURANCES}-node`;

const EDIT_DRIVING_DISTANCE = 'button-insurance-edit-driving-distance';
const EDIT_DRIVING_DISTANCE_NODE = `${EDIT_DRIVING_DISTANCE}-node`;

const IF_INSURANCE_CACHE: { [key: string]: IInsuranceOption[] | undefined } = {};

interface InsuranceViewProps {
  readonly store: WaykeStore;
  readonly lastStage: boolean;
  readonly onEdit: () => void;
}

class InsuranceView extends HtmlNode {
  private readonly props: InsuranceViewProps;
  private requestError: boolean = false;
  private insurances?: IInsuranceOption[];
  private contexts: {
    buttonProceed?: ButtonArrowRight;
    listners: ((() => void) | undefined)[];
  } = { listners: [] };

  constructor(element: HTMLElement, props: InsuranceViewProps) {
    super(element);
    this.props = props;

    const drivingDistanceListner = watch(this.props.store, 'drivingDistance', () => {
      this.fetchInsurance();
    });
    this.contexts.listners.push(drivingDistanceListner);

    const customerIdListner = watch(this.props.store, 'customer.socialId', () => {
      this.fetchInsurance();
    });

    this.contexts.listners.push(customerIdListner);

    const insuranceListner = watch(this.props.store, 'insurance', () => {
      this.contexts.buttonProceed?.disabled(!this.props.store.getState().insurance);
    });
    this.contexts.listners.push(insuranceListner);

    this.fetchInsurance();
    this.render();
  }

  private fetchInsurance() {
    const state = this.props.store.getState();
    if (state.customer.socialId) {
      this.getInsurances();
    }
  }

  private async getInsurances() {
    const state = this.props.store.getState();
    this.requestError = false;
    this.render();

    const cacheKey = `${state.customer.socialId}-${state.id}-${state.drivingDistance}`;
    const cache = IF_INSURANCE_CACHE[cacheKey];
    if (cache) {
      this.insurances = cache;
      this.render();
      return;
    }

    try {
      const response = await getInsurances(this.props.store, state.drivingDistance);
      this.insurances = response.getInsuranceOptions();
      IF_INSURANCE_CACHE[cacheKey] = this.insurances;
    } catch (e) {
      this.requestError = true;
    } finally {
      this.render();
    }
  }

  private onEditDrivingDistance() {
    this.contexts.listners.forEach((x) => x?.());
    this.props.onEdit();
  }

  private onProceed() {
    completeStage(this.props.lastStage)(this.props.store.dispatch);
  }

  private onSkipInsurances() {
    addOrRemoveInsurance()(this.props.store.dispatch);
    completeStage(this.props.lastStage)(this.props.store.dispatch);
  }

  render() {
    const { store } = this.props;
    const state = store.getState();
    const { insurance, drivingDistance } = state;

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <h4 class="waykeecom-heading waykeecom-heading--4">Vill du teckna en försäkring på din nya bil?</h4>
        <div class="waykeecom-content">
          <p>Nedan visas förslag på försäkringar som passar dig och din nya bil. I både hel- och halvförsäkring ingår trafikförsäkring som är obligatoriskt att ha. Ifall du har valt att finansiera bilen med ett billån är priset du ser rabatterat.</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--1">
          <ul class="waykeecom-key-value-list">
            ${KeyValueListItem({
              key: 'Uppskattad körsträcka',
              value: translateDrivingDistance[drivingDistance],
            })}
          </ul>
        </div>
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-align waykeecom-align--end" id="${EDIT_DRIVING_DISTANCE_NODE}">
            <button type="button" title="Ändra" class="waykeecom-link" >Ändra</button>
          </div>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3" id="${INSURANCE_GRID_LIST_NODE}"></div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--1" id="${PROCEED_INSURANCE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--1" id="${SKIP_INSURANCES_NODE}"></div>
      </div>
    `;

    const insuranceListNode = this.node.querySelector<HTMLDivElement>(
      `#${INSURANCE_GRID_LIST_NODE}`
    );
    if (insuranceListNode) {
      if (this.requestError) {
        insuranceListNode.innerHTML = Alert({
          tone: 'error',
          children:
            '<p>Det gick inte att hämta försäkringar. <button type="button" titlte="Försök igen" class="waykeecom-link waykeecom-link--align-baseline waykeecom-link--current-color">Klicka här för att försöka igen</button>.</p>',
        });
        insuranceListNode
          .querySelector<HTMLButtonElement>('button')
          ?.addEventListener('click', () => this.getInsurances());
      } else {
        const insurances = this.insurances;
        if (insurances?.length) {
          new InsuranceList(insuranceListNode, { store, insurances });
        } else {
          insuranceListNode.innerHTML = Loader();
        }
      }
    }

    new ButtonAsLink(this.node.querySelector<HTMLDivElement>(`#${EDIT_DRIVING_DISTANCE_NODE}`), {
      id: EDIT_DRIVING_DISTANCE,
      title: 'Ändra',
      onClick: () => this.onEditDrivingDistance(),
    });

    this.contexts.buttonProceed = new ButtonArrowRight(
      this.node.querySelector<HTMLDivElement>(`#${PROCEED_INSURANCE_NODE}`),
      {
        id: PROCEED_INSURANCE,
        disabled: !insurance,
        title: 'Gå vidare',
        onClick: () => this.onProceed(),
      }
    );

    new ButtonSkip(this.node.querySelector<HTMLDivElement>(`#${SKIP_INSURANCES_NODE}`), {
      id: SKIP_INSURANCES,
      title: 'Hoppa över detta steg',
      onClick: () => this.onSkipInsurances(),
    });
  }
}

export default InsuranceView;
