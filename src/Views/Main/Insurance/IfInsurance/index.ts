import { DrivingDistance } from '@wayke-se/ecom';
import ButtonArrowRight from '../../../../Components/Button/ButtonArrowRight';
import ButtonSkip from '../../../../Components/Button/ButtonSkip';
import Disclaimer from '../../../../Components/Disclaimer/Disclaimer';
import Alert from '../../../../Templates/Alert';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import InputSelect from '../../../../Components/Input/InputSelect';
import { setDrivingDistance } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import { translateDrivingDistance } from '../../../../Utils/constants';
import InsuranceView from './InsuranceView';
import ecomEvent, { Step, EcomEvent, EcomView } from '../../../../Utils/ecomEvent';

const DISTANCE = 'select-insurance-distance';
const DISTANCE_NODE = `${DISTANCE}-node`;

const INSURANCE_INFO_NODE = `insurance-info-node`;

const SHOW_INSURANCES = 'button-insurances-show';
const SHOW_INSURANCES_NODE = `${SHOW_INSURANCES}-node`;
const SHOW_INSURANCES_DISCLAIMER_NODE = `${SHOW_INSURANCES}-disclaimer-node`;

const SKIP_INSURANCES = 'button-insurances-skip';
const SKIP_INSURANCES_NODE = `${SKIP_INSURANCES}-node`;

interface IfInsuranceProps {
  readonly store: WaykeStore;
  readonly lastStage: boolean;
  readonly onSkip: () => void;
}

class IfInsurance extends HtmlNode {
  private readonly props: IfInsuranceProps;
  private showInsurances = false;

  constructor(element: HTMLElement, props: IfInsuranceProps) {
    super(element);
    this.props = props;
    this.showInsurances = !!this.props.store.getState().insurance;
    this.render();
  }

  private onChangeDistance(e: Event) {
    this.showInsurances = false;
    const currentTarget = e.currentTarget as HTMLSelectElement;
    const distance = currentTarget.value as DrivingDistance;
    setDrivingDistance(distance)(this.props.store.dispatch);
    switch (distance) {
      case DrivingDistance.Between0And1000:
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.INSURANCE_MILEAGE_BETWEEN_0_AND_1000_SELECTED,
          Step.INSURANCE_IF
        );
        break;
      case DrivingDistance.Between1000And1500:
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.INSURANCE_MILEAGE_BETWEEN_1000_AND_1500_SELECTED,
          Step.INSURANCE_IF
        );
        break;
      case DrivingDistance.Between1500And2000:
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.INSURANCE_MILEAGE_BETWEEN_1500_AND_2000_SELECTED,
          Step.INSURANCE_IF
        );
        break;
      case DrivingDistance.Between2000And2500:
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.INSURANCE_MILEAGE_BETWEEN_2000_AND_2500_SELECTED,
          Step.INSURANCE_IF
        );
        break;
      case DrivingDistance.Over2500:
        ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_MILEAGE_OVER_2500_SELECTED, Step.INSURANCE_IF);
        break;
      default:
        break;
    }
  }

  private onShowInsurances() {
    this.showInsurances = true;
    this.render();
    ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_SHOW, Step.INSURANCE_IF);
  }

  private onEdit() {
    this.showInsurances = false;
    this.render();
    ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_EDIT_MILEAGE, Step.INSURANCE_IF);
  }

  render() {
    const { store, lastStage, onSkip } = this.props;
    const state = store.getState();

    const insuranceDisclaimerTitle =
      state.order?.insuranceOption?.title || '[Okänt försäkringsbolag]';

    if (this.showInsurances) {
      new InsuranceView(this.node, {
        store,
        lastStage,
        onEdit: () => this.onEdit(),
      });
    } else {
      this.node.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <h4 class="waykeecom-heading waykeecom-heading--4">Vill du teckna en försäkring på din nya bil?</h4>
          <div class="waykeecom-content">
            <p class="waykeecom-content__p">Ange din uppskattade körsträcka för att se din försäkringskostnad. Därefter presenterar vi förslag på försäkringar som passar dig och din nya bil. I både hel- och halvförsäkring ingår trafikförsäkring som är obligatoriskt att ha. Ifall du har valt att finansiera bilen med ett billån är priset du ser rabatterat.</p>
          </div>
        </div>

        <div class="waykeecom-stack waykeecom-stack--3" id="${INSURANCE_INFO_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${DISTANCE_NODE}"></div>

        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--1" id="${SHOW_INSURANCES_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--1" id="${SKIP_INSURANCES_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--1" id="${SHOW_INSURANCES_DISCLAIMER_NODE}"></div>
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

      const insuranceInfoNode = this.node.querySelector<HTMLDivElement>(`#${INSURANCE_INFO_NODE}`);
      if (insuranceInfoNode) {
        insuranceInfoNode.innerHTML = Alert({
          tone: 'info',
          children: `Vi är anknutna försäkringsförmedlare till ${insuranceDisclaimerTitle}, If Skadeförsäkring. Försäkringsgivare är If Skadeförsäkring (publ). Vad detta innebär kan du läsa mer om på försäkringsförmedlarens hemsida.`,
        });
      }

      new Disclaimer(
        this.node.querySelector<HTMLDivElement>(`#${SHOW_INSURANCES_DISCLAIMER_NODE}`),
        {
          text: `Genom att du klickar på Visa försäkringar så godkänner du att vi skickar dina uppgifter vidare till ${insuranceDisclaimerTitle} för att de ska kunna ge dig ett pris på försäkring. Hur de hanterar dina personuppgifter kan du läsa om på deras hemsida.`,
        }
      );

      new ButtonSkip(this.node.querySelector<HTMLDivElement>(`#${SKIP_INSURANCES_NODE}`), {
        id: SKIP_INSURANCES,
        title: 'Hoppa över detta steg',
        onClick: () => onSkip(),
      });
    }
  }
}

export default IfInsurance;
