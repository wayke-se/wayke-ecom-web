import { IInsuranceOption } from '@wayke-se/ecom';
import watch from 'redux-watch';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonAsLink from '../../../Components/Button/ButtonAsLink';
import ButtonSkip from '../../../Components/Button/ButtonSkip';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { getInsurances } from '../../../Data/getInsurances';
import { completeStage } from '../../../Redux/action';
import store from '../../../Redux/store';
import Alert from '../../../Templates/Alert';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import Loader from '../../../Templates/Loader';
import { translateDrivingDistance } from '../../../Utils/constants';
import InsuranceList from './InsuranceList';

const INSURANCE_GRID_LIST_NODE = 'insurance-grid-list-node';

const PROCEED_INSURANCE = 'button-insurances-proceed';
const PROCEED_INSURANCE_NODE = `${INSURANCE_GRID_LIST_NODE}-node`;

const SKIP_INSURANCES = 'button-insurances-skip';
const SKIP_INSURANCES_NODE = `${SKIP_INSURANCES}-node`;

const EDIT_DRIVING_DISTANCE = 'button-insurance-edit-driving-distance';
const EDIT_DRIVING_DISTANCE_NODE = `${EDIT_DRIVING_DISTANCE}-node`;

interface InsuranceViewProps {
  lastStage: boolean;
  onEdit: () => void;
}

class InsuranceView extends HtmlNode {
  private props: InsuranceViewProps;
  private requestError: boolean = false;
  private insurances?: IInsuranceOption[];
  private contexts: {
    buttonProceed?: ButtonArrowRight;
  } = {};

  constructor(element: HTMLElement, props: InsuranceViewProps) {
    super(element);
    this.props = props;

    const w1 = watch(store.getState, 'drivingDistance');
    store.subscribe(w1(() => this.fetchInsurance()));

    const w2 = watch(store.getState, 'customer.socialId');
    store.subscribe(w2(() => this.fetchInsurance()));

    const w3 = watch(store.getState, 'insurance');
    store.subscribe(w3(() => this.render()));

    this.fetchInsurance();
    this.render();
  }

  private fetchInsurance() {
    const state = store.getState();
    if (state.customer.socialId) {
      this.getchInsurances();
    }
  }

  private async getchInsurances() {
    this.requestError = false;
    this.render();

    try {
      const state = store.getState();
      const response = await getInsurances(state.drivingDistance);
      this.insurances = response.getInsuranceOptions();
    } catch (e) {
      this.requestError = true;
    } finally {
      this.render();
    }
  }

  private onEditDrivingDistance() {
    this.props.onEdit();
  }

  private onProceed() {
    completeStage(this.props.lastStage);
  }

  private onSkipInsurances() {
    completeStage(this.props.lastStage);
  }

  render() {
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
            '<p>Det gick inte att hämta försäkringar. Klicka <button class="waykeecom-link">här</button> för att försöka igen.</p>',
        });
        insuranceListNode
          .querySelector<HTMLButtonElement>('button')
          ?.addEventListener('click', () => this.getchInsurances());
      } else {
        const insurances = this.insurances;
        if (insurances?.length) {
          new InsuranceList(insuranceListNode, insurances);
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
