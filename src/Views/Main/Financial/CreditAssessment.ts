import {
  AuthMethod,
  Employment,
  MaritalStatus,
  ICreditAssessmentInquiry,
  PaymentType,
  HousingType,
  ICreditAssessmentHouseholdEconomy,
} from '@wayke-se/ecom';
import Accordion from '../../../Components/Accordion';
import BankIdSign from '../../../Components/BankId/BankIdSign';
import ButtonBankId from '../../../Components/Button/ButtonBankId';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputField from '../../../Components/Input/InputField';
import InputRadioGroup from '../../../Components/Input/InputRadioGroup';
import Disclaimer from '../../../Components/Disclaimer/Disclaimer';
import DisclaimerPadlock from '../../../Components/Disclaimer/DisclaimerPadlock';
import { creditAssessmentCancelSigning } from '../../../Data/creditAssessmentCancelSigning';
import { creditAssessmentGetStatus } from '../../../Data/creditAssessmentGetStatus';
import { creditAssessmentNewCase } from '../../../Data/creditAssessmentNewCase';
import { creditAssessmentSignCase } from '../../../Data/creditAssessmentSignCase';
import { setCreditAssessmentResponse } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import Alert from '../../../Templates/Alert';
import { prettyNumber } from '../../../Utils/format';
import { isMobile } from '../../../Utils/isMobile';
import { createPortal, destroyPortal } from '../../../Utils/portal';
import { scrollTop } from '../../../Utils/scroll';
import { validationMethods } from '../../../Utils/validationMethods';
import CreditAssessmentResult from './CreditAssessmentResult';
import createTerm from './utils';
import { PaymentLookup } from '../../../@types/PaymentLookup';
import { ICreditAssessmentStatus } from '../../../@types/CreditAssessmentStatus';
import { convertCreditAssessmentStatusResponse } from '../../../Utils/convert';
import { PaymentOption } from '../../../@types/OrderOptions';
import ecomEvent, { EcomStep, EcomEvent, EcomView } from '../../../Utils/ecomEvent';
import { registerInterval } from '../../../Utils/intervals';
import { creditAssessmentDecline } from '../../../Data/creditAssessmentDecline';
import InputSelect from '../../../Components/Input/InputSelect';

const MARITAL_STATUS = `credit-assessment-martial-status`;
const MARITAL_STATUS_NODE = `${MARITAL_STATUS}-node`;

const INCOME = `credit-assessment-income`;
const INCOME_NODE = `${INCOME}-node`;

const EMPLOYMENT = `credit-assessment-employment`;
const EMPLOYMENT_NODE = `${EMPLOYMENT}-node`;

const HOUSEHOLD_CHILDREN = `credit-assessment-household-children`;
const HOUSEHOLD_CHILDREN_NODE = `${HOUSEHOLD_CHILDREN}-node`;

const HOUSING_COST = `credit-assessment-housing-cost`;
const HOUSING_COST_NODE = `${HOUSING_COST}-node`;

const DEBT_SPECIFICATION_CARD_CREDIT = `credit-assessment-debt-specification-card-credit`;
const DEBT_SPECIFICATION_CARD_CREDIT_NODE = `${DEBT_SPECIFICATION_CARD_CREDIT}-node`;

const DEBT_SPECIFICATION_CAR_LOAN = `credit-assessment-debt-specification-car-loan`;
const DEBT_SPECIFICATION_CAR_LOAN_NODE = `${DEBT_SPECIFICATION_CAR_LOAN}-node`;

const DEBT_SPECIFICATION_COLLATERAL = `credit-assessment-debt-specification-collateral`;
const DEBT_SPECIFICATION_COLLATERAL_NODE = `${DEBT_SPECIFICATION_COLLATERAL}-node`;

const DEBT_SPECIFICATION_LEASING_FEES = `credit-assessment-debt-specification-leasing-fees`;
const DEBT_SPECIFICATION_LEASING_FEES_NODE = `${DEBT_SPECIFICATION_LEASING_FEES}-node`;

const DEBT_SPECIFICATION_PRIVATE_LOAN = `credit-assessment-debt-specification-private-loan`;
const DEBT_SPECIFICATION_PRIVATE_LOAN_NODE = `${DEBT_SPECIFICATION_PRIVATE_LOAN}-node`;

const HOUSING_TYPE = `credit-assessment-housing-type`;
const HOUSING_TYPE_NODE = `${HOUSING_TYPE}-node`;

const PERFORM_APPLICATION = `credit-assessment-perform-application`;
const PERFORM_APPLICATION_NODE = `${PERFORM_APPLICATION}-node`;

const DISCLAIMER_NODE = `disclaimer-node`;
const DISCLAIMER_SAFE_NODE = `disclaimer-safe-node`;

const WHY_DESCRIPTION = `why-description-node`;

export interface CreditAssessmentHouseholdEconomyValidation {
  maritalStatus: boolean;
  income: boolean;
  employment: boolean;
  householdChildren: boolean;
  housingCost: boolean;
  'debtSpecification.cardCredits': boolean;
  'debtSpecification.carLoan': boolean;
  'debtSpecification.collateral': boolean;
  'debtSpecification.leasingFees': boolean;
  'debtSpecification.privateLoan': boolean;
  housingType: boolean;
}

interface CreditAssessmentHouseholdEconomy {
  maritalStatus: string;
  income: string;
  employment: string;
  householdChildren: string;
  housingCost: string;
  'debtSpecification.cardCredits': string;
  'debtSpecification.carLoan': string;
  'debtSpecification.collateral': string;
  'debtSpecification.leasingFees': string;
  'debtSpecification.privateLoan': string;
  housingType: string;
}

interface CreditAssessmentHouseholdEconomyState {
  value: CreditAssessmentHouseholdEconomy;
  validation: CreditAssessmentHouseholdEconomyValidation;
  interact: CreditAssessmentHouseholdEconomyValidation;
}

const validation = {
  maritalStatus: validationMethods.requiredAssessmentMaritalStatus,
  income: validationMethods.requiredNumber,
  employment: validationMethods.requiredAssessmentEmplyment,
  householdChildren: validationMethods.requiredNumber,
  housingCost: validationMethods.requiredNumber,
  'debtSpecification.cardCredits': validationMethods.optionalNumber,
  'debtSpecification.carLoan': validationMethods.optionalNumber,
  'debtSpecification.collateral': validationMethods.optionalNumber,
  'debtSpecification.leasingFees': validationMethods.optionalNumber,
  'debtSpecification.privateLoan': validationMethods.optionalNumber,
  housingType: validationMethods.requiredHousingType,
};

const mock: ICreditAssessmentHouseholdEconomy = {
  maritalStatus: MaritalStatus.Married,
  income: 50000,
  employment: Employment.FullTimeEmployed,
  householdChildren: 0,
  housingCost: 2000,
  debtSpecification: {
    cardCredits: 0,
    carLoan: 0,
    collateral: 0,
    leasingFees: 0,
    privateLoan: 0,
  },
  housingType: HousingType.Apartment,
};

const getMock = (): ICreditAssessmentHouseholdEconomy | undefined => {
  return location.hostname === 'localhost' ? { ...mock } : undefined;
};

const initalState = (
  creditAssessmentHouseholdEconomy?: ICreditAssessmentHouseholdEconomy
): CreditAssessmentHouseholdEconomyState => {
  const value: CreditAssessmentHouseholdEconomy = {
    maritalStatus: creditAssessmentHouseholdEconomy?.maritalStatus || '',
    income: creditAssessmentHouseholdEconomy?.income.toString() || '',
    employment: creditAssessmentHouseholdEconomy?.employment.toString() || '',
    householdChildren: creditAssessmentHouseholdEconomy?.householdChildren.toString() || '',
    housingCost: creditAssessmentHouseholdEconomy?.housingCost.toString() || '',
    'debtSpecification.cardCredits':
      creditAssessmentHouseholdEconomy?.debtSpecification.cardCredits.toString() || '',
    'debtSpecification.carLoan':
      creditAssessmentHouseholdEconomy?.debtSpecification.carLoan.toString() || '',
    'debtSpecification.collateral':
      creditAssessmentHouseholdEconomy?.debtSpecification.collateral.toString() || '',
    'debtSpecification.leasingFees':
      creditAssessmentHouseholdEconomy?.debtSpecification.leasingFees.toString() || '',
    'debtSpecification.privateLoan':
      creditAssessmentHouseholdEconomy?.debtSpecification.privateLoan.toString() || '',
    housingType: creditAssessmentHouseholdEconomy?.housingType.toString() || '',
  };
  return {
    value,
    validation: {
      maritalStatus: validation.maritalStatus(value.maritalStatus),
      income: validation.income(value.income),
      employment: validation.employment(value.employment),
      householdChildren: validation.householdChildren(value.householdChildren),
      housingCost: validation.housingCost(value.housingCost),
      'debtSpecification.cardCredits': validation['debtSpecification.cardCredits'](
        value['debtSpecification.cardCredits']
      ),
      'debtSpecification.carLoan': validation['debtSpecification.carLoan'](
        value['debtSpecification.carLoan']
      ),
      'debtSpecification.collateral': validation['debtSpecification.collateral'](
        value['debtSpecification.collateral']
      ),
      'debtSpecification.leasingFees': validation['debtSpecification.leasingFees'](
        value['debtSpecification.leasingFees']
      ),
      'debtSpecification.privateLoan': validation['debtSpecification.privateLoan'](
        value['debtSpecification.privateLoan']
      ),
      housingType: validation.housingType(value.housingType),
    },
    interact: {
      maritalStatus: false,
      income: false,
      employment: false,
      householdChildren: false,
      housingCost: false,
      'debtSpecification.cardCredits': false,
      'debtSpecification.carLoan': false,
      'debtSpecification.collateral': false,
      'debtSpecification.leasingFees': false,
      'debtSpecification.privateLoan': false,
      housingType: false,
    },
  };
};

interface CreditAssessmentProps {
  readonly store: WaykeStore;
  readonly loan: PaymentOption;
  readonly paymentLookupResponse: PaymentLookup;
  readonly onProceed: () => void;
}

class CreditAssessment extends HtmlNode {
  private readonly props: CreditAssessmentProps;
  private state: CreditAssessmentHouseholdEconomyState;
  private bankidStatusInterval?: NodeJS.Timer;
  private view: number = 1;
  private contexts: {
    maritalStatus?: InputRadioGroup;
    income?: InputField;
    employment?: InputRadioGroup;
    householdChildren?: InputSelect;
    householdIncome?: InputField;
    housingCost?: InputField;
    'debtSpecification.cardCredits'?: InputField;
    'debtSpecification.carLoan'?: InputField;
    'debtSpecification.collateral'?: InputField;
    'debtSpecification.leasingFees'?: InputField;
    'debtSpecification.privateLoan'?: InputField;
    housingType?: InputRadioGroup;
    performApplicationButton?: ButtonBankId;
    bankId?: BankIdSign;
  } = {};
  private caseError?: string;
  private bankidError = false;
  private signed = false;
  private creditAssessmentResponse?: ICreditAssessmentStatus;

  constructor(element: HTMLDivElement | undefined | null, props: CreditAssessmentProps) {
    super(element);
    this.props = props;
    this.state = initalState(getMock());

    this.render();
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof CreditAssessmentHouseholdEconomyValidation;

    const value = currentTarget.value;
    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);

    this.updateUiError(name);
    this.updateProceedButton();
  }

  private onBlur(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof CreditAssessmentHouseholdEconomyValidation;

    this.state.interact[name] = true;
    this.state.validation[name] = validation[name](this.state.value[name]);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  private onChangeSelect(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as 'householdChildren';

    const value = currentTarget.value;
    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);

    this.updateProceedButton();
  }

  private onChangeRadio(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof Omit<
      CreditAssessmentHouseholdEconomyValidation,
      | 'income'
      | 'householdIncome'
      | 'housingCost'
      | 'householdChildren'
      | 'debtSpecification.cardCredits'
      | 'debtSpecification.carLoan'
      | 'debtSpecification.collateral'
      | 'debtSpecification.leasingFees'
      | 'debtSpecification.privateLoan'
    >;

    const value = currentTarget.value;
    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);

    if (name === 'housingType') {
      if ((currentTarget.value as HousingType) === HousingType.SingleFamily) {
        this.state.value.housingCost = '0';
        this.state.validation.housingCost = validation.housingCost(this.state.value.housingCost);
        this.render();
      }
      this.render();
    }

    this.updateProceedButton();
  }

  private updateUiError(name: keyof CreditAssessmentHouseholdEconomyValidation) {
    this.contexts[name]?.setError(this.state.interact[name] && !this.state.validation[name]);
  }

  private updateProceedButton() {
    this.contexts.performApplicationButton?.disabled(
      !this.state.validation.maritalStatus ||
        !this.state.validation.income ||
        !this.state.validation.employment ||
        !this.state.validation.householdChildren ||
        !this.state.validation.housingCost ||
        !this.state.validation['debtSpecification.cardCredits'] ||
        !this.state.validation['debtSpecification.carLoan'] ||
        !this.state.validation['debtSpecification.collateral'] ||
        !this.state.validation['debtSpecification.leasingFees'] ||
        !this.state.validation['debtSpecification.privateLoan'] ||
        !this.state.validation.housingType
    );
  }

  private async onAbort() {
    ecomEvent(
      EcomView.MAIN,
      EcomEvent.FINANCIAL_CREDIT_SCORING_ABORTED,
      EcomStep.FINANCIAL_CREDIT_SCORING
    );
    const { store } = this.props;
    this.view = 1;
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }

    const caseId = store.getState().caseId;
    if (caseId) {
      await creditAssessmentCancelSigning(caseId);
      await creditAssessmentDecline(caseId);
      setCreditAssessmentResponse()(store.dispatch);
    }
    destroyPortal();
    this.creditAssessmentResponse = undefined;
    this.render(true);
  }

  private bankIdStatus(caseId: string, method: AuthMethod, supressTracking = false) {
    if (!supressTracking) {
      ecomEvent(
        EcomView.MAIN,
        method === AuthMethod.SameDevice
          ? EcomEvent.FINANCIAL_CREDIT_SCORING_BANKID_STATUS_SAME_DEVICE_REQUESTED
          : EcomEvent.FINANCIAL_CREDIT_SCORING_BANKID_STATUS_QR_REQUESTED,
        EcomStep.FINANCIAL_CREDIT_SCORING
      );
    }
    const loan = this.props.store
      .getState()
      .order?.paymentOptions.find((x) => x.type === PaymentType.Loan);
    this.bankidStatusInterval = setInterval(async () => {
      try {
        const response = await creditAssessmentGetStatus(caseId);
        const status = response.getStatus();
        if (!this.signed && status === 'signed') {
          ecomEvent(
            EcomView.MAIN,
            method === AuthMethod.SameDevice
              ? EcomEvent.FINANCIAL_CREDIT_SCORING_BANKID_STATUS_SAME_DEVICE_SUCCEEDED
              : EcomEvent.FINANCIAL_CREDIT_SCORING_BANKID_STATUS_QR_SUCCEEDED,
            EcomStep.FINANCIAL_CREDIT_SCORING
          );

          this.signed = true;
          this.contexts.bankId?.setTitle(`Väntar på ${loan?.name}...`);
          this.contexts.bankId?.setDescription(
            `Hämtar uppgifter från ${loan?.name}. Vänta kvar det kan ta några sekunder.`
          );
          this.contexts.bankId?.setFinalizing(true);
          ecomEvent(
            EcomView.MAIN,
            EcomEvent.FINANCIAL_CREDIT_SCORING_SIGNING_SIGNED,
            EcomStep.FINANCIAL_CREDIT_SCORING
          );
        }

        if (status === 'signingFailed') {
          clearInterval(this.bankidStatusInterval as NodeJS.Timer);
          this.contexts.bankId?.setFinalizing(false);
          this.contexts.bankId?.setErrorMessage('Ett fel uppstod');
          return;
        }

        if (response.isScored()) {
          ecomEvent(
            EcomView.MAIN,
            EcomEvent.FINANCIAL_CREDIT_SCORING_SIGNING_SCORED,
            EcomStep.FINANCIAL_CREDIT_SCORING
          );
          if (this.bankidStatusInterval) {
            clearInterval(this.bankidStatusInterval);
          }
          this.view = 3;
          this.creditAssessmentResponse = convertCreditAssessmentStatusResponse(response);
          setCreditAssessmentResponse(
            caseId,
            this.creditAssessmentResponse
          )(this.props.store.dispatch);
          destroyPortal();
          this.render();
        } else if (response.hasScoringError()) {
          clearInterval(this.bankidStatusInterval as NodeJS.Timer);
          this.contexts.bankId?.setFinalizing(false);
          this.contexts.bankId?.setErrorMessage(`Ett fel uppstod`);
        }
        if (!this.signed && method === AuthMethod.QrCode) {
          const qrCode = response.getQrCode() as string;
          this.contexts.bankId?.update(method, qrCode);
        }
      } catch (e) {
        clearInterval(this.bankidStatusInterval as NodeJS.Timer);
        this.contexts.bankId?.setFinalizing(false);
        this.contexts.bankId?.setErrorMessage(
          'Det gick inte att hämta status kring nuvanrade BankId signering'
        );
      }
    }, 1000);
    registerInterval('bankidStatusInterval-credit', this.bankidStatusInterval as unknown as number);
  }

  private async onStartBankIdAuth(method: AuthMethod, supressTracking = false) {
    const caseId = this.props.store.getState().caseId;
    if (!caseId) throw 'Missing caseID';
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }

    try {
      if (!supressTracking) {
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.FINANCIAL_CREDIT_SCORING_BANKID_INIT_REQUESTED,
          EcomStep.FINANCIAL_CREDIT_SCORING
        );
      }
      this.contexts.bankId?.update(method);
      const response = await creditAssessmentSignCase({ caseId, method });
      if (!supressTracking) {
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.FINANCIAL_CREDIT_SCORING_BANKID_INIT_SUCCEEDED,
          EcomStep.FINANCIAL_CREDIT_SCORING
        );
      }
      this.bankIdStatus(caseId, method, supressTracking);

      if (method === AuthMethod.SameDevice) {
        const autoLaunchUrl = response.getAutoLaunchUrl() as string;
        this.contexts.bankId?.update(method, autoLaunchUrl);
      } else {
        const qrCode = response.getQrCode() as string;
        this.contexts.bankId?.update(method, qrCode);
      }
    } catch (e) {
      ecomEvent(
        EcomView.MAIN,
        EcomEvent.FINANCIAL_CREDIT_SCORING_BANKID_INIT_FAILED,
        EcomStep.FINANCIAL_CREDIT_SCORING
      );
      if (this.bankidStatusInterval) {
        clearInterval(this.bankidStatusInterval);
      }
      this.bankidError = true;
      this.view = 1;
      destroyPortal();
      this.render(true);
    }
  }

  private async startBankId(method: AuthMethod) {
    const { store } = this.props;
    this.caseError = undefined;
    this.bankidError = false;
    this.signed = false;
    const currentCaseId = store.getState().caseId;
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
      if (currentCaseId) {
        await creditAssessmentCancelSigning(currentCaseId);
        await creditAssessmentDecline(currentCaseId);
        setCreditAssessmentResponse()(store.dispatch);
      }
    }

    if (currentCaseId) {
      const caseId = await this.newCreditAssessmentCase();
      setCreditAssessmentResponse(caseId)(store.dispatch);
      this.onStartBankIdAuth(method);
    } else {
      try {
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.FINANCIAL_CREDIT_SCORING_CREATE_CASE_REQUESTED,
          EcomStep.FINANCIAL_CREDIT_SCORING
        );
        const caseId = await this.newCreditAssessmentCase();
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.FINANCIAL_CREDIT_SCORING_CREATE_CASE_SUCCEEDED,
          EcomStep.FINANCIAL_CREDIT_SCORING
        );
        if (caseId) {
          setCreditAssessmentResponse(caseId)(store.dispatch);
          this.onStartBankIdAuth(method);
        }
      } catch (e) {
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.FINANCIAL_CREDIT_SCORING_CREATE_CASE_FAILED,
          EcomStep.FINANCIAL_CREDIT_SCORING
        );
      }
    }
  }

  private async newCreditAssessmentCase() {
    try {
      const { store, loan, paymentLookupResponse } = this.props;

      this.contexts.performApplicationButton?.disabled(true);
      const { customer } = store.getState();

      const { monthlyCost } = paymentLookupResponse.costs;
      const { interest } = paymentLookupResponse.interests;

      const downPayment = paymentLookupResponse.downPaymentSpec.current;
      const duration = paymentLookupResponse.durationSpec.current;
      const creditAmount = paymentLookupResponse.creditAmount;
      const price = paymentLookupResponse.price;
      const financialProductId = paymentLookupResponse.financialProductCode as string;

      const householdEconomy: ICreditAssessmentHouseholdEconomy = {
        employment: this.state.value.employment as Employment,
        householdChildren: parseInt(this.state.value.householdChildren, 10),
        housingCost: parseInt(this.state.value.housingCost || '0', 10),
        housingType: this.state.value.housingType as HousingType,
        income: parseInt(this.state.value.income || '0', 10),
        maritalStatus: this.state.value.maritalStatus as MaritalStatus,
        debtSpecification: {
          cardCredits: parseInt(this.state.value['debtSpecification.cardCredits'] || '0', 10),
          carLoan: parseInt(this.state.value['debtSpecification.carLoan'] || '0', 10),
          collateral: parseInt(this.state.value['debtSpecification.collateral'] || '0', 10),
          leasingFees: parseInt(this.state.value['debtSpecification.leasingFees'] || '0', 10),
          privateLoan: parseInt(this.state.value['debtSpecification.privateLoan'] || '0', 10),
        },
      };

      const assessmentCase: ICreditAssessmentInquiry = {
        customer: {
          ...customer,
        },
        householdEconomy,
        externalId: loan.externalId as string,
        loan: {
          downPayment,
          interestRate: interest,
          credit: creditAmount,
          financialProductId,
          monthlyCost,
          price,
          term: createTerm(duration),
        },
      };

      const response = await creditAssessmentNewCase(assessmentCase);
      return response.caseId;
    } catch (e) {
      if (this.bankidStatusInterval) {
        clearInterval(this.bankidStatusInterval);
      }
      this.caseError = (e as { message?: string })?.message || '';
      this.view = 1;
      this.render(true);
      return;
    } finally {
      this.contexts.performApplicationButton?.disabled(false);
    }
  }

  private render(scrollIntoView?: boolean) {
    const { store, paymentLookupResponse, onProceed } = this.props;

    const mobile = isMobile();
    const { order } = store.getState();

    const loan = order?.paymentOptions.find((x) => x.type === PaymentType.Loan);
    const creditAmount = paymentLookupResponse.creditAmount;
    const branchName = order?.contactInformation?.name;

    if (this.view === 3 && this.creditAssessmentResponse) {
      new CreditAssessmentResult(createPortal(), {
        store,
        creditAssessmentResponse: this.creditAssessmentResponse,
        onProceed: () => {
          destroyPortal();
          onProceed();
        },
        onGoBack: () => this.onAbort(),
      });
    } else if (this.view === 2) {
      this.contexts.bankId = new BankIdSign(createPortal(), {
        method: mobile ? AuthMethod.SameDevice : AuthMethod.QrCode,
        descriptionQrCode:
          'För att hämta dina uppgifter, starta din BankID applikation på din andra enhet.',
        descriptionSameDevice: 'För att hämta dina uppgifter, starta din BankID-applikation.',
        onAbort: () => this.onAbort(),
        onStart: (method: AuthMethod) => this.startBankId(method),
      });
      scrollTop();
    } else {
      this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <h5 class="waykeecom-heading waykeecom-heading--4">Låneansökan</h5>
        <div class="waykeecom-content">
          <p class="waykeecom-content__p">För att besvara din förfrågan om billån behöver ${
            loan?.name
          } några fler uppgifter om dig och ditt hushåll. Frågorna tar bara någon minut att besvara. Bekräfta och signera sedan med BankID – därefter får du ditt lånebesked direkt på skärmen och kan gå vidare med ditt bilköp. Blir du godkänd så gäller lånebeskedet genom hela köpet så länge inga tillägg görs – men din ansökan är inte bindande.</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-balloon waykeecom-balloon--info" id="${WHY_DESCRIPTION}"></div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2">
          <h5 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Civilstatus</h5>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${MARITAL_STATUS_NODE}"></div>
      </div>

      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2">
          <h5 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Sysselsättning</h5>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${EMPLOYMENT_NODE}"></div>
      </div>

      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2">
          <h5 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Barn</h5>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${HOUSEHOLD_CHILDREN_NODE}"></div>
      </div>

      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2">
          <h5 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Inkomst</h5>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${INCOME_NODE}"></div>
      </div>

      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2">
          <h5 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Boendeform</h5>
          <div class="waykeecom-content">
            <p class="waykeecom-content__p">Ange typ av boende.</p>
          </div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${HOUSING_TYPE_NODE}"></div>
      </div>

      ${
        this.state.value.housingType !== HousingType.SingleFamily
          ? `
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--2">
              <h5 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Boendekostnad</h5>
            </div>
            <div class="waykeecom-stack waykeecom-stack--2" id="${HOUSING_COST_NODE}"></div>
          </div>
          `
          : ''
      }

      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2">
          <h5 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Skulder och Ansvarsförbindelser</h5>
          <div class="waykeecom-content">
            <p class="waykeecom-content__p">Ange eventuella skulder och ansvarsförbindelser inom respektive kategori.</p>
          </div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${DEBT_SPECIFICATION_PRIVATE_LOAN_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${DEBT_SPECIFICATION_CAR_LOAN_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${DEBT_SPECIFICATION_LEASING_FEES_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${DEBT_SPECIFICATION_CARD_CREDIT_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${DEBT_SPECIFICATION_COLLATERAL_NODE}"></div>
      </div>

      <div class="waykeecom-stack waykeecom-stack--3">
        <hr class="waykeecom-separator" />
      </div>

      <div class="waykeecom-stack waykeecom-stack--3 waykeecom-text waykeecom-text--align-center">
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-text waykeecom-text--tone-alt waykeecom-text--size-small">Totalt lånebelopp</div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-heading waykeecom-heading--2 waykeecom-no-margin">
            ${prettyNumber(creditAmount, { postfix: 'kr' })}
          </div>
        </div>
      </div>

      <div class="waykeecom-stack waykeecom-stack--3">
        ${Alert({
          tone: 'info',
          children: `Du betalar inget i detta steg, detta är bara en låneansökan. Köpet slutförs sedan vid möte med ${branchName}.`,
        })}
      </div>

      ${
        this.caseError
          ? `
            <div class="waykeecom-stack waykeecom-stack--3">
              ${Alert({
                tone: 'error',
                children: `Det gick inte att starta en låneansökan, försök igen.${
                  this.caseError !== undefined ? this.caseError : ''
                }`,
              })}
            </div>
          `
          : ''
      }

      ${
        this.bankidError
          ? `
          <div class="waykeecom-stack waykeecom-stack--3">
            ${Alert({
              tone: 'error',
              children: `Ett fel uppstod med BankId, försök igen.`,
            })}
          </div>
          `
          : ''
      }
      
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2" id="${PERFORM_APPLICATION_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-stack waykeecom-stack--1" id="${DISCLAIMER_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--1" id="${DISCLAIMER_SAFE_NODE}"></div>
        </div>
      </div>
    `;

      this.contexts.maritalStatus = new InputRadioGroup(
        this.node.querySelector<HTMLDivElement>(`#${MARITAL_STATUS_NODE}`),
        {
          title: 'Civilstånd',
          checked: this.state.value.maritalStatus as string,
          name: 'maritalStatus',
          options: [
            {
              id: `maritalStatus-${1}`,
              value: MaritalStatus.Married,
              title: 'Gift/partnerskap',
            },
            {
              id: `maritalStatus-${2}`,
              value: MaritalStatus.CommonLaw,
              title: 'Sambo',
            },
            {
              id: `maritalStatus-${3}`,
              value: MaritalStatus.Single,
              title: 'Ensamstående',
            },
          ],
          onClick: (e) => this.onChangeRadio(e),
        }
      );

      this.contexts.income = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${INCOME_NODE}`),
        {
          title: 'Inkomst per månad före skatt',
          value: this.state.value.income,
          id: INCOME,
          error: this.state.interact.income && !this.state.validation.income,
          errorMessage: 'Ange din inkomst per år före skatt',
          name: 'income',
          autocomplete: 'off',
          unit: 'kr',
          placeholder: '',
          type: 'number',
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.employment = new InputRadioGroup(
        this.node.querySelector<HTMLDivElement>(`#${EMPLOYMENT_NODE}`),
        {
          title: 'Sysselsättning',
          checked: this.state.value.employment as string,
          name: 'employment',
          options: [
            {
              id: `employment-${1}`,
              value: Employment.FullTimeEmployed,
              title: 'Fast eller tillsvidareanställd',
            },
            {
              id: `employment-${2}`,
              value: Employment.TemporarilyEmployed,
              title: 'Visstidsanställd',
            },
            {
              id: `employment-${3}`,
              value: Employment.SelfEmployed,
              title: 'Egen företagare',
            },
            {
              id: `employment-${4}`,
              value: Employment.Retired,
              title: 'Pensionär',
            },
            {
              id: `employment-${5}`,
              value: Employment.Student,
              title: 'Student',
            },
            {
              id: `employment-${6}`,
              value: Employment.Other,
              title: 'Annan',
            },
          ],
          onClick: (e) => this.onChangeRadio(e),
        }
      );

      this.contexts.housingType = new InputRadioGroup(
        this.node.querySelector<HTMLDivElement>(`#${HOUSING_TYPE_NODE}`),
        {
          title: 'Boendeform',
          checked: this.state.value.housingType as string,
          name: 'housingType',
          options: [
            {
              id: `housingType-${1}`,
              value: HousingType.SingleFamily,
              title: 'Villa',
            },
            {
              id: `housingType-${2}`,
              value: HousingType.Condominium,
              title: 'Bostadsrätt',
            },
            {
              id: `housingType-${3}`,
              value: HousingType.Apartment,
              title: 'Hyresrätt',
            },
          ],
          onClick: (e) => this.onChangeRadio(e),
        }
      );

      this.contexts.income = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${INCOME_NODE}`),
        {
          title: 'Inkomst per månad före skatt',
          value: this.state.value.income,
          id: INCOME,
          error: this.state.interact.income && !this.state.validation.income,
          errorMessage: 'Ange din inkomst per år före skatt',
          name: 'income',
          autocomplete: 'off',
          placeholder: '',
          unit: 'kr',
          type: 'number',
          information: `
          <div class="waykeecom-content waykeecom-content--inherit-size">
            <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">Inkomst per månad före skatt</span></p>
            <p class="waykeecom-content__p">Lön och/eller pension, inte bidrag  eller studielån.</p>
          </div>
        `,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.householdChildren = new InputSelect(
        this.node.querySelector<HTMLDivElement>(`#${HOUSEHOLD_CHILDREN_NODE}`),
        {
          title: 'Antal barn under 18 år',
          value: this.state.value.householdChildren,
          name: 'householdChildren',
          options: [
            {
              value: '0',
            },
            {
              value: '1',
            },
            {
              value: '2',
            },
            {
              value: '3',
            },
            {
              value: '4',
            },
            {
              value: '5',
            },
            {
              value: '6',
            },
            {
              value: '7',
            },
            {
              value: '8',
            },
            {
              value: '9',
            },
            {
              value: '10',
              title: '10 eller fler',
            },
          ],
          onChange: (e) => this.onChangeSelect(e),
        }
      );

      const housingCostNode = this.node.querySelector<HTMLDivElement>(`#${HOUSING_COST_NODE}`);
      if (housingCostNode) {
        this.contexts.housingCost = new InputField(housingCostNode, {
          title: 'Boendekostnad',
          value: this.state.value.housingCost,
          id: HOUSING_COST,
          error: this.state.interact.housingCost && !this.state.validation.housingCost,
          errorMessage: 'Ange boendekostnader per månad',
          name: 'housingCost',
          autocomplete: 'off',
          placeholder: '',
          unit: 'kr',
          type: 'number',
          information: `
            <div class="waykeecom-content waykeecom-content--inherit-size">
              <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">Boendekostnad</span></p>
              <p class="waykeecom-content__p">Exklusive ränta och amortering</p>
            </div>
          `,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
          onClickInformation: () => {
            ecomEvent(
              EcomView.MAIN,
              EcomEvent.FINANCIAL_LOAN_HOUSEHOLD_DEBT_INFORMATION_TOGGLE,
              EcomStep.FINANCIAL
            );
          },
        });
      }

      this.contexts['debtSpecification.cardCredits'] = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${DEBT_SPECIFICATION_CARD_CREDIT_NODE}`),
        {
          title: 'Kortkrediter',
          value: this.state.value['debtSpecification.cardCredits'],
          id: DEBT_SPECIFICATION_CARD_CREDIT,
          error:
            this.state.interact['debtSpecification.cardCredits'] &&
            !this.state.validation['debtSpecification.cardCredits'],
          errorMessage: 'Ange kortkrediter eller lämna tomt',
          name: 'debtSpecification.cardCredits',
          autocomplete: 'off',
          placeholder: '',
          unit: 'kr',
          type: 'number',
          information: `
            <div class="waykeecom-content waykeecom-content--inherit-size">
              <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">Kortkrediter</span></p>
              <p class="waykeecom-content__p">Total skuld</p>
            </div>
          `,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
          onClickInformation: () => {
            ecomEvent(
              EcomView.MAIN,
              EcomEvent.FINANCIAL_LOAN_DEBT_SPECIFICATION_CARD_CREDIT_INFORMATION_TOGGLE,
              EcomStep.FINANCIAL
            );
          },
        }
      );

      this.contexts['debtSpecification.carLoan'] = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${DEBT_SPECIFICATION_CAR_LOAN_NODE}`),
        {
          title: 'Billån',
          value: this.state.value['debtSpecification.carLoan'],
          id: DEBT_SPECIFICATION_CAR_LOAN,
          error:
            this.state.interact['debtSpecification.carLoan'] &&
            !this.state.validation['debtSpecification.carLoan'],
          errorMessage: 'Ange billån eller lämna tomt',
          name: 'debtSpecification.carLoan',
          autocomplete: 'off',
          placeholder: '',
          unit: 'kr',
          type: 'number',
          information: `
            <div class="waykeecom-content waykeecom-content--inherit-size">
              <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">Billån</span></p>
              <p class="waykeecom-content__p">Total skuld. Ange inte skuld för bil som ska ersättas.</p>
            </div>
          `,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
          onClickInformation: () => {
            ecomEvent(
              EcomView.MAIN,
              EcomEvent.FINANCIAL_LOAN_DEBT_SPECIFICATION_CAR_LOAN_INFORMATION_TOGGLE,
              EcomStep.FINANCIAL
            );
          },
        }
      );

      this.contexts['debtSpecification.collateral'] = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${DEBT_SPECIFICATION_COLLATERAL_NODE}`),
        {
          title: 'Borgensåtagande ',
          value: this.state.value['debtSpecification.collateral'],
          id: DEBT_SPECIFICATION_COLLATERAL,
          error:
            this.state.interact['debtSpecification.collateral'] &&
            !this.state.validation['debtSpecification.collateral'],
          errorMessage: 'Ange borgensåtagande eller lämna tomt',
          name: 'debtSpecification.collateral',
          autocomplete: 'off',
          placeholder: '',
          unit: 'kr',
          type: 'number',
          information: `
          <div class="waykeecom-content waykeecom-content--inherit-size">
            <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">Borgensåtagande</span></p>
            <p class="waykeecom-content__p">Totalt belopp.</p>
          </div>
          `,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
          onClickInformation: () => {
            ecomEvent(
              EcomView.MAIN,
              EcomEvent.FINANCIAL_LOAN_DEBT_SPECIFICATION_COLLATERAL_INFORMATION_TOGGLE,
              EcomStep.FINANCIAL
            );
          },
        }
      );

      this.contexts['debtSpecification.leasingFees'] = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${DEBT_SPECIFICATION_LEASING_FEES_NODE}`),
        {
          title: 'Billeasing ',
          value: this.state.value['debtSpecification.leasingFees'],
          id: DEBT_SPECIFICATION_LEASING_FEES,
          error:
            this.state.interact['debtSpecification.leasingFees'] &&
            !this.state.validation['debtSpecification.leasingFees'],
          errorMessage: 'Ang billeasingkostnader eller lämna tomt',
          name: 'debtSpecification.leasingFees',
          autocomplete: 'off',
          placeholder: '',
          unit: 'kr',
          type: 'number',
          information: `
          <div class="waykeecom-content waykeecom-content--inherit-size">
            <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">Billeasing</span></p>
            <p class="waykeecom-content__p">Ange inte månadskostnad för bil som skall ersättas</p>
          </div>
          `,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
          onClickInformation: () => {
            ecomEvent(
              EcomView.MAIN,
              EcomEvent.FINANCIAL_LOAN_DEBT_SPECIFICATION_LEASING_FEES_INFORMATION_TOGGLE,
              EcomStep.FINANCIAL
            );
          },
        }
      );

      this.contexts['debtSpecification.privateLoan'] = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${DEBT_SPECIFICATION_PRIVATE_LOAN_NODE}`),
        {
          title: 'Privatlån (ej bolån)',
          value: this.state.value['debtSpecification.privateLoan'],
          id: DEBT_SPECIFICATION_PRIVATE_LOAN,
          error:
            this.state.interact['debtSpecification.privateLoan'] &&
            !this.state.validation['debtSpecification.privateLoan'],
          errorMessage: 'Ange privatlån eller lämna tomt',
          name: 'debtSpecification.privateLoan',
          autocomplete: 'off',
          placeholder: '',
          unit: 'kr',
          type: 'number',
          information: `
          <div class="waykeecom-content waykeecom-content--inherit-size">
            <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">Privatlån (ej bolån)</span></p>
            <p class="waykeecom-content__p">Total skuld, t.ex. blancolån och sms-lån</p>
          </div>
          `,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
          onClickInformation: () => {
            ecomEvent(
              EcomView.MAIN,
              EcomEvent.FINANCIAL_LOAN_DEBT_SPECIFICATION_PRIVATE_LOAN_INFORMATION_TOGGLE,
              EcomStep.FINANCIAL
            );
          },
        }
      );

      this.contexts.performApplicationButton = new ButtonBankId(
        this.node.querySelector<HTMLDivElement>(`#${PERFORM_APPLICATION_NODE}`),
        {
          title: 'Genomför låneansökan',
          id: PERFORM_APPLICATION,
          disabled: !(
            this.state.validation.maritalStatus &&
            this.state.validation.income &&
            this.state.validation.employment &&
            this.state.validation.householdChildren &&
            this.state.validation.housingCost
          ),
          onClick: () => {
            this.view = 2;
            this.render();
          },
        }
      );

      new Disclaimer(this.node.querySelector<HTMLDivElement>(`#${DISCLAIMER_NODE}`), {
        text: `Genom att klicka på ”Genomför låneansökan” godkänner jag att ${loan?.name} gör en kreditupplysning på mig baserat på informationen ovan och jag bekräftar att jag läst <a href="#" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">${loan?.name} dataskyddspolicy</a>.`,
      });

      new DisclaimerPadlock(this.node.querySelector<HTMLDivElement>(`#${DISCLAIMER_SAFE_NODE}`), {
        text: 'Dina uppgifter lagras och sparas säkert.',
      });

      new Accordion(this.node.querySelector<HTMLDivElement>(`#${WHY_DESCRIPTION}`), {
        id: 'accordion-why-description',
        title: `
          <div class="waykeecom-hstack waykeecom-hstack--align-center waykeecom-hstack--spacing-1">
            <div class="waykeecom-hstack__item waykeecom-hstack__item--no-shrink" aria-hidden="true">
              <div class="waykeecom-icon-backdrop waykeecom-icon-backdrop--info-alt">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  class="waykeecom-icon"
                  data-icon="Info"
                >
                 <path d="M7 6h2v8H7V6zm0-4v2h2V2H7z" />
                </svg>
              </div>
            </div>
            <div class="waykeecom-hstack__item">Varför måste jag svara på allt detta?</div>
          </div>`,
        description: `<div class="waykeecom-content">
            <p class="waykeecom-content__p">${loan?.name}, liksom alla banker i Sverige, är enligt lagen om åtgärder mot penningtvätt och finansiering av terrorism skyldiga att ha god kännedom om sina kunder. Därför måste vi ställa frågor om dig som kund. Den information vi får om dig behandlas konfidentiellt och omfattas av banksekretessen och GDPR.</p>
            <p class="waykeecom-content__p"><a href="#" title="" target="_blank" rel="noopener norefferer" class="waykeecom-link">Läs mer om detta här</a></p>
          </div>`,
        onClick: () => {
          ecomEvent(
            EcomView.MAIN,
            EcomEvent.FINANCIAL_LOAN_KYC_INFORMATION_TOGGLE,
            EcomStep.FINANCIAL
          );
        },
      });

      if (scrollIntoView || this.caseError || this.bankidError) {
        this.node.querySelector(`#${PERFORM_APPLICATION_NODE}`)?.scrollIntoView();
      }
    }
  }
}

export default CreditAssessment;
