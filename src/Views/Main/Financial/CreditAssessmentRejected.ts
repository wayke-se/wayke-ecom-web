import Button from '../../../Components/Button/Button';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import store from '../../../Redux/store';

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
    const state = store.getState();
    const contactInformation = state.order?.getContactInformation();

    const title = 'Vi kan tyvärr inte bevilja din ansökan om billån.';

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
                <p>Det kan finnas olika skäl till att en ansökan nekas. Du kommer inom kort få ett brev med bekräftelse och mer information om just din ansökan.</p>
                <p>Ditt redan påbörjade köp kan fortfarande genomföras och avslutas, för att gå vidare kan du välja ett annat betalsätt.</p>
                <p>Har du frågor under tiden? Kontakta ${contactInformation?.name} på tel ${contactInformation?.phone}.</p>
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
