import { CreditAssessmentRecommendation, ICreditAssessmentStatusResponse } from '@wayke-se/ecom';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import CreditAssessmentApproved from './CreditAssessmentApproved';
import CreditAssessmentAssessManually from './CreditAssessmentAssessManually';
import CreditAssessmentRejected from './CreditAssessmentRejected';

interface CreditAssessmentResultProps {
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
        creditAssessmentResponse: this.props.creditAssessmentResponse,
        onProceed: () => this.props.onProceed(),
        onGoBack: () => this.props.onGoBack(),
      });
    } else if (decision === CreditAssessmentRecommendation.AssessManually) {
      new CreditAssessmentAssessManually(this.node, {
        creditAssessmentResponse: this.props.creditAssessmentResponse,
        onProceed: () => this.props.onProceed(),
        onGoBack: () => this.props.onGoBack(),
      });
    } else {
      new CreditAssessmentRejected(this.node, { onGoBack: () => this.props.onGoBack() });
    }
  }
}

export default CreditAssessmentResult;
