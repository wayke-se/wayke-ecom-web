import { CreditAssessmentDecision, ICreditAssessmentStatusResponse } from '@wayke-se/ecom';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import CreditAssessmentApproved from './CreditAssessmentApproved';
import CreditAssessmentRejected from './CreditAssessmentRejected';

interface CreditAssessmentResultProps {
  creditAssessmentResponse: ICreditAssessmentStatusResponse;
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
    const decision = this.props.creditAssessmentResponse.getDecision();

    if (decision === CreditAssessmentDecision.Approved) {
      new CreditAssessmentApproved(this.node, {
        creditAssessmentResponse: this.props.creditAssessmentResponse,
        onGoBack: () => this.props.onGoBack(),
      });
    } else {
      new CreditAssessmentRejected(this.node, { onGoBack: () => this.props.onGoBack() });
    }
  }
}

export default CreditAssessmentResult;
