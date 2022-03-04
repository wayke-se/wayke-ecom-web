import Button from '../../../Components/Button/Button';
import HtmlNode from '../../../Components/Extension/HtmlNode';

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
    const title = 'Nekad';
    const description = 'Du har blivit nekad. ';

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
                <div class="waykeecom-stack waykeecom-stack--2" id="${ABORT_NODE}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    new Button(this.node.querySelector(`#${ABORT_NODE}`), {
      title: 'Gå tillbaka',
      id: ABORT,
      onClick: () => this.props.onGoBack(),
    });
  }
}

export default CreditAssessmentRejected;
