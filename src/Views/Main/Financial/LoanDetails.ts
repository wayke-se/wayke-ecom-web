import { IPaymentOption } from '@wayke-se/ecom';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import PieChart from '../../../Components/Chart/PieChart';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import LoanDetailsBasic from './LoanDetailsBasic';
import LoanDetailsDetailed from './LoanDetailsDetailed';
import LoanDetailsMonthlyCost from './LoanDetailsMonthlyCost';

const LOAN_DETAILS_MONTHLY_COST_NODE = 'finance-details-monthly-cost';
const LOAN_DETAILS_PIE_CHART_NODE = 'finance-details-pie-chart-node';
const LOAN_DETAILS_BASIC_NODE = 'finance-details-basic';
const LOAN_DETAILS_DETAILED_NODE = 'finance-details-detailed';

interface LoanDetailsProps {
  paymentLookupResponse: PaymentLookupResponse;
  loan: IPaymentOption;
}

class LoanDetails extends HtmlNode {
  private props: LoanDetailsProps;
  private contexts: {
    loanDetailsMontlyCost?: LoanDetailsMonthlyCost;
    pieChart?: PieChart;
    loanDetailsBasic?: LoanDetailsBasic;
    loanDetailsDetailed?: LoanDetailsDetailed;
  } = {};

  constructor(element: HTMLElement | null | undefined, props: LoanDetailsProps) {
    super(element);
    this.props = props;

    this.render();
  }

  private extractProps() {
    const { monthlyCost, totalCreditCost } = this.props.paymentLookupResponse.getCosts();
    const { interest, effectiveInterest } = this.props.paymentLookupResponse.getInterests();

    const downPayment = this.props.paymentLookupResponse.getDownPaymentSpec().current;
    const duration = this.props.paymentLookupResponse.getDurationSpec().current;
    const { administrationFee, setupFee } = this.props.paymentLookupResponse.getFees();
    const creditAmount = this.props.paymentLookupResponse.getCreditAmount();

    const publicUrl = this.props.loan.loanDetails?.getPublicURL();

    const total = downPayment + creditAmount;
    const downPaymentPercentage = Math.round((downPayment / total) * 100);
    const creditAmountPercentage = Math.round((creditAmount / total) * 100);

    return {
      duration,
      downPayment,
      administrationFee,
      setupFee,
      totalCreditCost,
      interest,
      effectiveInterest,
      creditAmount,
      total,
      publicUrl,
      monthlyCost,
      loanOrgName: this.props.loan.name,
      downPaymentPercentage,
      creditAmountPercentage,
    };
  }

  update(props: LoanDetailsProps) {
    this.props = props;

    const {
      duration,
      downPayment,
      administrationFee,
      setupFee,
      monthlyCost,
      totalCreditCost,
      interest,
      effectiveInterest,
      creditAmount,
      publicUrl,
      loanOrgName,
      downPaymentPercentage,
      creditAmountPercentage,
    } = this.extractProps();

    this.contexts.loanDetailsMontlyCost?.update({ monthlyCost });
    this.contexts.pieChart?.update({ percentage: creditAmountPercentage });
    this.contexts.loanDetailsBasic?.update({
      downPayment,
      creditAmount,
      downPaymentPercentage,
      creditAmountPercentage,
    });
    this.contexts.loanDetailsDetailed?.update({
      duration,
      administrationFee,
      setupFee,
      totalCreditCost,
      interest,
      effectiveInterest,
      publicUrl,
      loanOrgName,
    });
  }

  render() {
    const {
      duration,
      downPayment,
      administrationFee,
      setupFee,
      totalCreditCost,
      interest,
      effectiveInterest,
      creditAmount,
      publicUrl,
      loanOrgName,
      monthlyCost,
      downPaymentPercentage,
      creditAmountPercentage,
    } = this.extractProps();

    const disclaimerText = `Beräknat på ${interest * 100} % ränta (effektivt ${
      effectiveInterest * 100
    } %). Den ränta du får sätts vid avtalskrivning.`;

    this.node.innerHTML = `
      <div class="waykeecom-stepper__break">
        <div class="waykeecom-shadow-box">
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--1">
              <h6 class="waykeecom-heading waykeecom-heading--5">${this.props.loan.name}</h6>
            </div>
            <div class="waykeecom-stack waykeecom-stack--1">
              <img src="${this.props.loan.logo}" alt="${this.props.loan.name} logotyp" class="waykeecom-image waykeecom-image--loan-logo" />
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--1" id="${LOAN_DETAILS_MONTHLY_COST_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--1">
              <div class="waykeecom-disclaimer-text">${disclaimerText}</div>
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--3" id="${LOAN_DETAILS_PIE_CHART_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--2" id="${LOAN_DETAILS_BASIC_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--2">
              <hr class="waykeecom-separator" />
            </div>
            <div class="waykeecom-stack waykeecom-stack--2" id="${LOAN_DETAILS_DETAILED_NODE}"></div>
          </div>
        </div>
      </div>
    `;

    this.contexts.loanDetailsMontlyCost = new LoanDetailsMonthlyCost(
      this.node.querySelector<HTMLElement>(`#${LOAN_DETAILS_MONTHLY_COST_NODE}`),
      {
        monthlyCost,
      }
    );

    this.contexts.pieChart = new PieChart(
      this.node.querySelector<HTMLElement>(`#${LOAN_DETAILS_PIE_CHART_NODE}`),
      {
        percentage: creditAmountPercentage,
      }
    );

    this.contexts.loanDetailsBasic = new LoanDetailsBasic(
      this.node.querySelector<HTMLElement>(`#${LOAN_DETAILS_BASIC_NODE}`),
      {
        downPayment,
        creditAmount,
        downPaymentPercentage,
        creditAmountPercentage,
      }
    );

    this.contexts.loanDetailsDetailed = new LoanDetailsDetailed(
      this.node.querySelector<HTMLElement>(`#${LOAN_DETAILS_DETAILED_NODE}`),
      {
        duration,
        administrationFee,
        setupFee,
        totalCreditCost,
        interest,
        effectiveInterest,
        publicUrl,
        loanOrgName,
      }
    );
  }
}

export default LoanDetails;
