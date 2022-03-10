import { DrivingDistance } from '@wayke-se/ecom';
import ButtonArrowRight from '../../../../Components/Button/ButtonArrowRight';
import ButtonSkip from '../../../../Components/Button/ButtonSkip';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import InputSelect from '../../../../Components/Input/InputSelect';
import { setDrivingDistance } from '../../../../Redux/action';
import store from '../../../../Redux/store';
import { translateDrivingDistance } from '../../../../Utils/constants';
import InsuranceView from './InsuranceView';

const DISTANCE = 'select-insurance-distance';
const DISTANCE_NODE = `${DISTANCE}-node`;

const SHOW_INSURANCES = 'button-insurances-show';
const SHOW_INSURANCES_NODE = `${SHOW_INSURANCES}-node`;

const SKIP_INSURANCES = 'button-insurances-skip';
const SKIP_INSURANCES_NODE = `${SKIP_INSURANCES}-node`;

interface IfInsuranceProps {
  lastStage: boolean;
  onSkip: () => void;
}

class IfInsurance extends HtmlNode {
  private props: IfInsuranceProps;
  private showInsurances = false;

  constructor(element: HTMLElement, props: IfInsuranceProps) {
    super(element);
    this.props = props;
    this.render();
  }

  private onChangeDistance(e: Event) {
    const currentTarget = e.currentTarget as HTMLSelectElement;
    setDrivingDistance(currentTarget.value as DrivingDistance);
  }

  private onShowInsurances() {
    this.showInsurances = true;
    this.render();
  }

  private onEdit() {
    this.showInsurances = false;
    this.render();
  }

  render() {
    const state = store.getState();
    if (this.showInsurances) {
      new InsuranceView(this.node, {
        lastStage: this.props.lastStage,
        onEdit: () => this.onEdit(),
      });
    } else {
      this.node.innerHTML = `
       <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--2">
              <h4 class="waykeecom-heading waykeecom-heading--4">Vill du teckna en försäkring på din nya bil?</h4>
              <div class="waykeecom-content">
                <p>Ange din uppskattade körsträcka för att se din försäkringskostnad. Därefter presenterar vi förslag på försäkringar som passar dig och din nya bil. I både hel- och halvförsäkring ingår trafikförsäkring som är obligatoriskt att ha. Ifall du har valt att finansiera bilen med ett billån är priset du ser rabatterat.</p>
              </div>
            </div>
            <div class="waykeecom-stack waykeecom-stack--2" id="${DISTANCE_NODE}"></div>
          </div>

          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--1" id="${SHOW_INSURANCES_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--1" id="${SKIP_INSURANCES_NODE}"></div>
          </div>
      `;
      new InputSelect(this.node.querySelector<HTMLDivElement>(`#${DISTANCE_NODE}`), {
        id: DISTANCE,
        title: 'Visa försäkringar',
        name: 'distance',
        value: state.drivingDistance,
        options: [
          {
            value: DrivingDistance.Between0And1000,
            title: translateDrivingDistance[DrivingDistance.Between0And1000],
          },
          {
            value: DrivingDistance.Between1000And1500,
            title: translateDrivingDistance[DrivingDistance.Between1000And1500],
          },
          {
            value: DrivingDistance.Between1500And2000,
            title: translateDrivingDistance[DrivingDistance.Between1500And2000],
          },
          {
            value: DrivingDistance.Between2000And2500,
            title: translateDrivingDistance[DrivingDistance.Between2000And2500],
          },
          {
            value: DrivingDistance.Over2500,
            title: translateDrivingDistance[DrivingDistance.Over2500],
          },
        ],
        onChange: (e) => this.onChangeDistance(e),
      });

      new ButtonArrowRight(this.node.querySelector<HTMLDivElement>(`#${SHOW_INSURANCES_NODE}`), {
        id: SHOW_INSURANCES,
        title: 'Visa försäkringar',
        onClick: () => this.onShowInsurances(),
      });

      new ButtonSkip(this.node.querySelector<HTMLDivElement>(`#${SKIP_INSURANCES_NODE}`), {
        id: SKIP_INSURANCES,
        title: 'Hoppa över detta steg',
        onClick: () => this.props.onSkip(),
      });
    }
  }
}

export default IfInsurance;