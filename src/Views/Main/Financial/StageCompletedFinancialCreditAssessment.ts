import { CreditAssessmentRecommendation, PaymentType } from '@wayke-se/ecom';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import Alert from '../../../Templates/Alert';

interface StageCompletedFinancialCreditAssessmentProps {
  readonly store: WaykeStore;
  readonly decision: CreditAssessmentRecommendation;
}

class StageCompletedFinancialCreditAssessment extends HtmlNode {
  private readonly props: StageCompletedFinancialCreditAssessmentProps;

  constructor(element: HTMLElement | null, props: StageCompletedFinancialCreditAssessmentProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { store, decision } = this.props;
    const state = store.getState();
    const { order } = state;
    const loan = order?.paymentOptions.find((x) => x.type === PaymentType.Loan);
    const contactInformation = order?.contactInformation;

    if (decision === CreditAssessmentRecommendation.Approve) {
      this.node.innerHTML = `
      ${Alert({
        tone: 'success',
        children: `
          <div class="waykeecom-content waykeecom-content--inherit-size">
            <p class="waykeecom-content__p"><string>Grattis! Din låneansökan har beviljats av ${loan?.name}.</strong></p>
            <p class="waykeecom-content__p">Slutför ordern genom att klicka dig igenom nästkommande steg. Har du frågor under tiden? Kontakta ${contactInformation?.name} på tel ${contactInformation?.phone}.</p>
          </div>
        `,
      })}
    `;
    } else if (decision === CreditAssessmentRecommendation.AssessManually) {
      this.node.innerHTML = `
      ${Alert({
        tone: 'warning',
        children: `
          <div class="waykeecom-content waykeecom-content--inherit-size">
            <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">När ordern är slutförd kommer vi att gå igenom ditt ärende och återkoppla till dig med ett lånebesked.</span></p>
            <p class="waykeecom-content__p">Din bil är fortfarande inte reserverad. Gå vidare till nästa steg för att slutföra ordern, men det är inte säkert att ditt lån kommer att beviljas. Har du frågor under tiden? Kontakta ${contactInformation?.name} på tel ${contactInformation?.phone}.</p>
          </div>
        `,
      })}
    `;
    } else {
      this.node.innerHTML = `
        ${Alert({
          tone: 'error',
          children: `
            <div class="waykeecom-content waykeecom-content--inherit-size">
              <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">Vi kan tyvärr inte bevilja din ansökan om billån.</span></p>
              <p class="waykeecom-content__p">Det kan finnas olika skäl till att en ansökan nekas. Du kommer inom kort få ett brev med bekräftelse och mer information om just din ansökan.</p>
              <p class="waykeecom-content__p">Ditt redan påbörjade köp kan fortfarande genomföras och avslutas, för att gå vidare kan du välja ett annat betalsätt.</p>
              <p class="waykeecom-content__p">Har du frågor under tiden? Kontakta ${contactInformation?.name} på tel ${contactInformation?.phone}.</p>
            </div>
          `,
        })}
      `;
    }
  }
}

export default StageCompletedFinancialCreditAssessment;
