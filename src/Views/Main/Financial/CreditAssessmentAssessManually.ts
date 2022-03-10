import { CreditAssessmentRecommendation, ICreditAssessmentStatusResponse } from '@wayke-se/ecom';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonClear from '../../../Components/Button/ButtonClear';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import StageCompletedFinancialCreditAssessment from './StageCompletedFinancialCreditAssessment';

const RESULT = 'assessment-assess-manually-result';
const RESULT_NODE = `${RESULT}-node`;

const PROCEED = 'assessment-assess-manually-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

const ABORT = 'assessment-assess-manually-abort';
const ABORT_NODE = `${ABORT}-node`;

interface CreditAssessmentAssessManuallyProps {
  store: WaykeStore;
  creditAssessmentResponse: ICreditAssessmentStatusResponse;
  onProceed: () => void;
  onGoBack: () => void;
}

class CreditAssessmentAssessManually extends HtmlNode {
  private props: CreditAssessmentAssessManuallyProps;
  constructor(element: HTMLElement, props: CreditAssessmentAssessManuallyProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--4" id="${RESULT_NODE}"></div>
      <div class="waykeecom-stack waykeecom-stack--4">
        <div class="waykeecom-stack waykeecom-stack--1" id="${PROCEED_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--1" id="${ABORT_NODE}"></div>
      </div>
    `;

    new StageCompletedFinancialCreditAssessment(this.node.querySelector(`#${RESULT_NODE}`), {
      store: this.props.store,
      decision: CreditAssessmentRecommendation.AssessManually,
    });

    new ButtonArrowRight(this.node.querySelector(`#${PROCEED_NODE}`), {
      title: 'Fortsätt',
      id: PROCEED,
      onClick: () => this.props.onProceed(),
    });

    new ButtonClear(this.node.querySelector(`#${ABORT_NODE}`), {
      title: 'Avbryt',
      id: ABORT,
      onClick: () => this.props.onGoBack(),
    });
  }
}

export default CreditAssessmentAssessManually;
