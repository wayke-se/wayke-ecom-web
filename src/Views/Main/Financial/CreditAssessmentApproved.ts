import { ICreditAssessmentStatusResponse } from '@wayke-se/ecom';
import Button from '../../../Components/Button/Button';
import ButtonAsLink from '../../../Components/Button/ButtonAsLink';
import HtmlNode from '../../../Components/Extension/HtmlNode';

const SIGN = 'assessment-approved-sign';
const SIGN_NODE = `${SIGN}-node`;

const ABORT = 'assessment-approved-abort';
const ABORT_NODE = `${ABORT}-node`;

interface CreditAssessmentApprovedProps {
  creditAssessmentResponse: ICreditAssessmentStatusResponse;
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
    const title = 'Godkänd';
    const description = 'Du har blivit godkänd. ';

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <hr class="waykeecom-separator" />
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <div class="waykeecom-overlay">
          <div class="waykeecom-container waykeecom-container--narrow">
            <div class="waykeecom-stack waykeecom-stack--4" id="">
              <h4 class="waykeecom-heading waykeecom-heading--4">${title}</h4>
              <div class="waykeecom-content">
                <p>${description}</p>
              </div>
            </div>
            <div class="waykeecom-stack waykeecom-stack--4">
              <div class="waykeecom-stack waykeecom-stack--3">
                <div class="waykeecom-stack waykeecom-stack--2" id="${SIGN_NODE}"></div>
                <div class="waykeecom-stack waykeecom-stack--2" id="${ABORT_NODE}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    new Button(this.node.querySelector(`#${SIGN_NODE}`), {
      title: 'Signera',
      id: SIGN,
      onClick: () => {
        // eslint-disable-next-line
        console.log('SIGNERAR');
      },
    });

    new ButtonAsLink(this.node.querySelector(`#${ABORT_NODE}`), {
      title: 'Avbryt',
      id: ABORT,
      onClick: () => this.props.onGoBack(),
    });
  }
}

export default CreditAssessmentApproved;
