import { ICreditAssessmentStatusResponse } from '@wayke-se/ecom';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonAsLink from '../../../Components/Button/ButtonAsLink';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import store from '../../../Redux/store';

const PROCEED = 'assessment-assess-manually-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

const ABORT = 'assessment-assess-manually-abort';
const ABORT_NODE = `${ABORT}-node`;

interface CreditAssessmentAssessManuallyProps {
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
    const state = store.getState();
    const contactInformation = state.order?.getContactInformation();

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <hr class="waykeecom-separator" />
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <div class="waykeecom-overlay">
          <div class="waykeecom-container waykeecom-container--narrow">
            <div class="waykeecom-stack waykeecom-stack--4" id="">
              <h4 class="waykeecom-heading waykeecom-heading--4">När ordern är slutförd kommer vi att gå igenom ditt ärende och återkoppla till dig med ett lånebesked.</h4>
              <div class="waykeecom-content">
                <p>Din bil är fortfarande inte reserverad. Gå vidare till nästa steg för att slutföra ordern, men det är inte säkert att ditt lån kommer att beviljas. Har du frågor under tiden? Kontakta ${contactInformation?.name} på tel ${contactInformation?.phone}.</p>
              </div>
            </div>
            <div class="waykeecom-stack waykeecom-stack--4">
              <div class="waykeecom-stack waykeecom-stack--3">
                <div class="waykeecom-stack waykeecom-stack--2" id="${PROCEED_NODE}"></div>
                <div class="waykeecom-stack waykeecom-stack--2" id="${ABORT_NODE}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    new ButtonArrowRight(this.node.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
      title: 'Fortsätt',
      id: PROCEED,
      onClick: () => this.props.onProceed(),
    });

    new ButtonAsLink(this.node.querySelector(`#${ABORT_NODE}`), {
      title: 'Avbryt',
      id: ABORT,
      onClick: () => this.props.onGoBack(),
    });
  }
}

export default CreditAssessmentAssessManually;
