import { CreditAssessmentRecommendation } from '@wayke-se/ecom';
import Button from '../../../Components/Button/Button';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import StageCompletedFinancialCreditAssessment from './StageCompletedFinancialCreditAssessment';

const RESULT = 'assessment-rejected-result';
const RESULT_NODE = `${RESULT}-node`;

const ABORT = 'assessment-rejected-abort';
const ABORT_NODE = `${ABORT}-node`;

interface CreditAssessmentRejectedProps {
  onGoBack: () => void;
}

class CreditAssessmentRejected extends HtmlNode {
  private props: CreditAssessmentRejectedProps;
  constructor(element: HTMLElement, props: CreditAssessmentRejectedProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--4" id="${RESULT_NODE}"></div>
      <div class="waykeecom-stack waykeecom-stack--4" id="${ABORT_NODE}"></div>
    `;

    new StageCompletedFinancialCreditAssessment(this.node.querySelector(`#${RESULT_NODE}`), {
      decision: CreditAssessmentRecommendation.Reject,
    });

    new Button(this.node.querySelector(`#${ABORT_NODE}`), {
      title: 'Gå tillbaka',
      id: ABORT,
      onClick: () => this.props.onGoBack(),
    });
  }
}

export default CreditAssessmentRejected;
