import { CreditAssessmentRecommendation } from '@wayke-se/ecom';
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
    const contactInformation = state.order?.getContactInformation();

    if (decision === CreditAssessmentRecommendation.Approve) {
      this.node.innerHTML = `
      ${Alert({
        tone: 'success',
        children: `
          <p><string>Grattis! Din låneansökan har beviljats av Volvofinans Bank.</strong></p>
          <p>Slutför ordern genom att klicka dig igenom nästkommande steg. Har du frågor under tiden? Kontakta ${contactInformation?.name} på tel ${contactInformation?.phone}.</p>
        `,
      })}
    `;
    } else if (decision === CreditAssessmentRecommendation.AssessManually) {
      this.node.innerHTML = `
      ${Alert({
        tone: 'warning',
        children: `
          <p><strong>När ordern är slutförd kommer vi att gå igenom ditt ärende och återkoppla till dig med ett lånebesked.</strong></p>
          <p>Din bil är fortfarande inte reserverad. Gå vidare till nästa steg för att slutföra ordern, men det är inte säkert att ditt lån kommer att beviljas. Har du frågor under tiden? Kontakta ${contactInformation?.name} på tel ${contactInformation?.phone}.</p>
        `,
      })}
    `;
    } else {
      this.node.innerHTML = `
        ${Alert({
          tone: 'error',
          children: `
            <p><strong>Vi kan tyvärr inte bevilja din ansökan om billån.</strong></p>
            <p>Det kan finnas olika skäl till att en ansökan nekas. Du kommer inom kort få ett brev med bekräftelse och mer information om just din ansökan.</p>
            <p>Ditt redan påbörjade köp kan fortfarande genomföras och avslutas, för att gå vidare kan du välja ett annat betalsätt.</p>
            <p>Har du frågor under tiden? Kontakta ${contactInformation?.name} på tel ${contactInformation?.phone}.</p>
          `,
        })}
      `;
    }
  }
}

export default StageCompletedFinancialCreditAssessment;
