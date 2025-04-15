import i18next from '@i18n';
import { CreditAssessmentRecommendation } from '@wayke-se/ecom';
import Button from '../../../Components/Button/Button';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import StageCompletedFinancialCreditAssessment from './StageCompletedFinancialCreditAssessment';

const RESULT = 'assessment-rejected-result';
const RESULT_NODE = `${RESULT}-node`;

const ABORT = 'assessment-rejected-abort';
const ABORT_NODE = `${ABORT}-node`;

interface CreditAssessmentRejectedProps {
  readonly store: WaykeStore;
  readonly onGoBack: () => void;
}

class CreditAssessmentRejected extends HtmlNode {
  private props: CreditAssessmentRejectedProps;
  constructor(element: HTMLElement, props: CreditAssessmentRejectedProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { store, onGoBack } = this.props;
    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--4" id="${RESULT_NODE}"></div>
      <div class="waykeecom-stack waykeecom-stack--4" id="${ABORT_NODE}"></div>
    `;

    new StageCompletedFinancialCreditAssessment(this.node.querySelector(`#${RESULT_NODE}`), {
      store,
      decision: CreditAssessmentRecommendation.Reject,
    });

    new Button(this.node.querySelector(`#${ABORT_NODE}`), {
      title: i18next.t('creditAssessment.abortButton'),
      id: ABORT,
      onClick: () => onGoBack(),
    });
  }
}

export default CreditAssessmentRejected;
