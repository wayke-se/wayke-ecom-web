import { IAvailableInsuranceOption } from '@wayke-se/ecom';
import ButtonArrowRight from '../../../../Components/Button/ButtonArrowRight';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import { completeStage } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import InsuranceList from './InsuranceList';

const INSURANCE_GRID_LIST_NODE = 'insurance-grid-list-node';

const PROCEED_INSURANCE = 'button-insurances-proceed';
const PROCEED_INSURANCE_NODE = `${INSURANCE_GRID_LIST_NODE}-node`;

const SKIP_INSURANCES = 'button-insurances-skip';
const SKIP_INSURANCES_NODE = `${SKIP_INSURANCES}-node`;

interface DefaultInsuranceProps {
  readonly store: WaykeStore;
  readonly lastStage: boolean;
  readonly insurance: IAvailableInsuranceOption;
}

class DefaultInsurance extends HtmlNode {
  private readonly props: DefaultInsuranceProps;

  constructor(element: HTMLElement, props: DefaultInsuranceProps) {
    super(element);
    this.props = props;

    this.render();
  }
  private onProceed() {
    completeStage(this.props.lastStage)(this.props.store.dispatch);
  }

  render() {
    const { store, insurance } = this.props;
    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <h4 class="waykeecom-heading waykeecom-heading--4">Vill du teckna en försäkring på din nya bil?</h4>
        <div class="waykeecom-content">
          <p class="waykeecom-content__p">Nedan visas förslag på försäkringar som passar dig och din nya bil.</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3" id="${INSURANCE_GRID_LIST_NODE}"></div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--1" id="${PROCEED_INSURANCE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--1" id="${SKIP_INSURANCES_NODE}"></div>
      </div>
    `;

    new InsuranceList(this.node.querySelector<HTMLElement>(`#${INSURANCE_GRID_LIST_NODE}`), {
      store,
      insurances: [insurance],
    });

    new ButtonArrowRight(this.node.querySelector<HTMLElement>(`#${PROCEED_INSURANCE_NODE}`), {
      id: PROCEED_INSURANCE,
      title: 'Gå vidare',
      onClick: () => this.onProceed(),
    });
  }
}

export default DefaultInsurance;
