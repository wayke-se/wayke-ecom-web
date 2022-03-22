import { CreditAssessmentRecommendation } from '@wayke-se/ecom';
import { ICreditAssessmentStatus } from '../../../@types/CreditAssessmentStatus';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import CreditAssessmentApproved from './CreditAssessmentApproved';
import CreditAssessmentAssessManually from './CreditAssessmentAssessManually';
import CreditAssessmentRejected from './CreditAssessmentRejected';

interface CreditAssessmentResultProps {
  readonly store: WaykeStore;
  readonly creditAssessmentResponse: ICreditAssessmentStatus;
  readonly onProceed: () => void;
  readonly onGoBack: () => void;
}

class CreditAssessmentResult extends HtmlNode {
  private readonly props: CreditAssessmentResultProps;
  constructor(element: HTMLElement, props: CreditAssessmentResultProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { store, creditAssessmentResponse, onProceed, onGoBack } = this.props;
    const decision = creditAssessmentResponse.recommendation;

    if (decision === CreditAssessmentRecommendation.Approve) {
      new CreditAssessmentApproved(this.node, {
        store,
        onProceed: () => onProceed(),
        onGoBack: () => onGoBack(),
      });
    } else if (decision === CreditAssessmentRecommendation.AssessManually) {
      new CreditAssessmentAssessManually(this.node, {
        store,
        onProceed: () => onProceed(),
        onGoBack: () => onGoBack(),
      });
    } else {
      new CreditAssessmentRejected(this.node, {
        store,
        onGoBack: () => onGoBack(),
      });
    }
  }
}

export default CreditAssessmentResult;
