import { CreditAssessmentRecommendation, PaymentType } from '@wayke-se/ecom';
import i18next from 'i18next';
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
            <p class="waykeecom-content__p"><strong>${i18next.t('stageCompletedFinancialCreditAssessment.approved', { loanName: loan?.name })}</strong></p>
            <p class="waykeecom-content__p">${i18next.t('stageCompletedFinancialCreditAssessment.approvedDescription', { contactName: contactInformation?.name, contactPhone: contactInformation?.phone })}</p>
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
            <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('stageCompletedFinancialCreditAssessment.assessManually')}</span></p>
            <p class="waykeecom-content__p">${i18next.t('stageCompletedFinancialCreditAssessment.assessManuallyDescription', { contactName: contactInformation?.name, contactPhone: contactInformation?.phone })}</p>
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
              <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('stageCompletedFinancialCreditAssessment.declined')}</span></p>
              <p class="waykeecom-content__p">${i18next.t('stageCompletedFinancialCreditAssessment.declinedDescription')}</p>
              <p class="waykeecom-content__p">${i18next.t('stageCompletedFinancialCreditAssessment.declinedNextSteps')}</p>
              <p class="waykeecom-content__p">${i18next.t('stageCompletedFinancialCreditAssessment.contactInfo', { contactName: contactInformation?.name, contactPhone: contactInformation?.phone })}</p>
            </div>
          `,
        })}
      `;
    }
  }
}

export default StageCompletedFinancialCreditAssessment;
