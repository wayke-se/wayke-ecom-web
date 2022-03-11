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
  readonly store: WaykeStore;
  readonly creditAssessmentResponse: ICreditAssessmentStatusResponse;
  readonly onProceed: () => void;
  readonly onGoBack: () => void;
}

class CreditAssessmentAssessManually extends HtmlNode {
  private readonly props: CreditAssessmentAssessManuallyProps;
  constructor(element: HTMLElement, props: CreditAssessmentAssessManuallyProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { store, onProceed, onGoBack } = this.props;
    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--4" id="${RESULT_NODE}"></div>
      <div class="waykeecom-stack waykeecom-stack--4">
        <div class="waykeecom-stack waykeecom-stack--1" id="${PROCEED_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--1" id="${ABORT_NODE}"></div>
      </div>
    `;

    new StageCompletedFinancialCreditAssessment(this.node.querySelector(`#${RESULT_NODE}`), {
      store,
      decision: CreditAssessmentRecommendation.AssessManually,
    });

    new ButtonArrowRight(this.node.querySelector(`#${PROCEED_NODE}`), {
      title: 'Fortsätt',
      id: PROCEED,
      onClick: () => onProceed(),
    });

    new ButtonClear(this.node.querySelector(`#${ABORT_NODE}`), {
      title: 'Avbryt',
      id: ABORT,
      onClick: () => onGoBack(),
    });
  }
}

export default CreditAssessmentAssessManually;
