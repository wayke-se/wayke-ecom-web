import { PaymentOption } from '../../../@types/OrderOptions';
import { PaymentLookup } from '../../../@types/PaymentLookup';
import PieChart from '../../../Components/Chart/PieChart';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { prettyNumber } from '../../../Utils/format';
import LoanDetailsBasic from './LoanDetailsBasic';
import LoanDetailsDetailed from './LoanDetailsDetailed';
import LoanDetailsMonthlyCost from './LoanDetailsMonthlyCost';

const LOAN_DETAILS_MONTHLY_COST_NODE = 'finance-details-monthly-cost';
const LOAN_DETAILS_PIE_CHART_NODE = 'finance-details-pie-chart-node';
const LOAN_DETAILS_BASIC_NODE = 'finance-details-basic';
const LOAN_DETAILS_DETAILED_NODE = 'finance-details-detailed';

interface LoanDetailsProps {
  paymentLookupResponse: PaymentLookup;
  loan: PaymentOption;
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
    const { loan, paymentLookupResponse } = this.props;
    const { monthlyCost, totalCreditCost } = paymentLookupResponse.costs;
    const { interest, effectiveInterest } = paymentLookupResponse.interests;

    const downPayment = paymentLookupResponse.downPaymentSpec.current;
    const duration = paymentLookupResponse.durationSpec.current;
    const { administrationFee, setupFee } = paymentLookupResponse.fees;
    const creditAmount = paymentLookupResponse.creditAmount;

    const publicUrl = paymentLookupResponse.publicURL;

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
      loanOrgName: loan.name,
      loanOrgLogo: loan.logo,
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
      loanOrgLogo,
      monthlyCost,
      downPaymentPercentage,
      creditAmountPercentage,
    } = this.extractProps();

    const disclaimerText = `*Beräknat på ${prettyNumber(interest * 100, {
      decimals: 2,
    })} % ränta (effektivt ${prettyNumber(effectiveInterest * 100, {
      decimals: 2,
    })} %). Den ränta du får sätts vid avtalskrivning.`;

    this.node.innerHTML = `
      <div class="waykeecom-stepper__break">
        <div class="waykeecom-shadow-box">
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--1">
              <h6 class="waykeecom-heading waykeecom-heading--5">${loanOrgName}</h6>
            </div>
            <div class="waykeecom-stack waykeecom-stack--1">
              <img src="${loanOrgLogo}" alt="${loanOrgName} logotyp" class="waykeecom-image waykeecom-image--loan-logo" />
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
