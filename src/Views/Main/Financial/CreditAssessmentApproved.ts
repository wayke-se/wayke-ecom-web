import { CreditAssessmentRecommendation, ICreditAssessmentStatusResponse } from '@wayke-se/ecom';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonAsLink from '../../../Components/Button/ButtonAsLink';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import StageCompletedFinancialCreditAssessment from './StageCompletedFinancialCreditAssessment';

const RESULT = 'assessment-approved-result';
const RESULT_NODE = `${RESULT}-node`;

const PROCEED = 'assessment-approved-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

const ABORT = 'assessment-approved-abort';
const ABORT_NODE = `${ABORT}-node`;

interface CreditAssessmentApprovedProps {
  store: WaykeStore;
  creditAssessmentResponse: ICreditAssessmentStatusResponse;
  onProceed: () => void;
  onGoBack: () => void;
}

class CreditAssessmentApproved extends HtmlNode {
  private props: CreditAssessmentApprovedProps;
  constructor(element: HTMLElement, props: CreditAssessmentApprovedProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--4" id="${RESULT_NODE}"></div>
      <div class="waykeecom-stack waykeecom-stack--4">
        <div class="waykeecom-stack waykeecom-stack--2" id="${PROCEED_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${ABORT_NODE}"></div>
      </div>
    `;

    new StageCompletedFinancialCreditAssessment(this.node.querySelector(`#${RESULT_NODE}`), {
      store: this.props.store,
      decision: CreditAssessmentRecommendation.Approve,
    });

    new ButtonArrowRight(this.node.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
      title: 'Fortsätt',
      id: PROCEED,
      onClick: () => this.props.onProceed(),
    });

    new ButtonAsLink(this.node.querySelector(`#${ABORT_NODE}`), {
      title: 'Avbryt',
      id: ABORT,
      onClick: () => this.props.onGoBack(),
    });
  }
}

export default CreditAssessmentApproved;
