import { CreditAssessmentRecommendation, ICreditAssessmentStatusResponse } from '@wayke-se/ecom';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import CreditAssessmentApproved from './CreditAssessmentApproved';
import CreditAssessmentAssessManually from './CreditAssessmentAssessManually';
import CreditAssessmentRejected from './CreditAssessmentRejected';

interface CreditAssessmentResultProps {
  store: WaykeStore;
  creditAssessmentResponse: ICreditAssessmentStatusResponse;
  onProceed: () => void;
  onGoBack: () => void;
}

class CreditAssessmentResult extends HtmlNode {
  private props: CreditAssessmentResultProps;
  constructor(element: HTMLElement, props: CreditAssessmentResultProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const decision = this.props.creditAssessmentResponse.getRecommendation();

    if (decision === CreditAssessmentRecommendation.Approve) {
      new CreditAssessmentApproved(this.node, {
        store: this.props.store,
        creditAssessmentResponse: this.props.creditAssessmentResponse,
        onProceed: () => this.props.onProceed(),
        onGoBack: () => this.props.onGoBack(),
      });
    } else if (decision === CreditAssessmentRecommendation.AssessManually) {
      new CreditAssessmentAssessManually(this.node, {
        store: this.props.store,
        creditAssessmentResponse: this.props.creditAssessmentResponse,
        onProceed: () => this.props.onProceed(),
        onGoBack: () => this.props.onGoBack(),
      });
    } else {
      new CreditAssessmentRejected(this.node, {
        store: this.props.store,
        onGoBack: () => this.props.onGoBack(),
      });
    }
  }
}

export default CreditAssessmentResult;
