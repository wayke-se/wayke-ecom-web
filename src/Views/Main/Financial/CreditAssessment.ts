import { AuthMethod, Employment, MaritalStatus, ICreditAssessmentInquiry } from '@wayke-se/ecom';
import { ICreditAssessmentHouseholdEconomy } from '@wayke-se/ecom/dist-types/credit-assessment/types';
import Accordion from '../../../Components/Accordion';
import BankIdSign from '../../../Components/BankId/BankIdSign';
import ButtonBankId from '../../../Components/Button/ButtonBankId';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputField from '../../../Components/Input/InputField';
import InputRadioGroup from '../../../Components/Input/InputRadioGroup';
import Disclaimer from '../../../Components/Disclaimer/Disclaimer';
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

const MARITAL_STATUS = `credit-assessment-martial-status`;
const MARITAL_STATUS_NODE = `${MARITAL_STATUS}-node`;

const INCOME = `credit-assessment-income`;
const INCOME_NODE = `${INCOME}-node`;

const EMPLOYMENT = `credit-assessment-employment`;
const EMPLOYMENT_NODE = `${EMPLOYMENT}-node`;

const HOUSEHOLD_CHILDREN = `credit-assessment-household-children`;
const HOUSEHOLD_CHILDREN_NODE = `${HOUSEHOLD_CHILDREN}-node`;

const HOUSEHOLD_INCOME = `credit-assessment-household-income`;
const HOUSEHOLD_INCOME_NODE = `${HOUSEHOLD_INCOME}-node`;

const HOUSEHOLD_HOUSING_COST = `credit-assessment-household-housing-cost`;
const HOUSEHOLD_HOUSING_COST_NODE = `${HOUSEHOLD_HOUSING_COST}-node`;

const HOUSEHOLD_DEBT = `credit-assessment-household-debt`;
const HOUSEHOLD_DEBT_NODE = `${HOUSEHOLD_DEBT}-node`;

const PERFORM_APPLICATION = `credit-assessment-perform-application`;
const PERFORM_APPLICATION_NODE = `${PERFORM_APPLICATION}-node`;

const DISCLAIMER_NODE = `disclaimer-node`;

const WHY_DESCRIPTION = `why-description-node`;

export interface CreditAssessmentHouseholdEconomyValidation {
  maritalStatus: boolean;
  income: boolean;
  employment: boolean;
  householdChildren: boolean;
  householdIncome: boolean;
  householdHousingCost: boolean;
  householdDebt: boolean;
}

interface CreditAssessmentHouseholdEconomy {
  maritalStatus: string;
  income: string;
  employment: string;
  householdChildren: string;
  householdIncome: string;
  householdHousingCost: string;
  householdDebt: string;
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
  householdIncome: validationMethods.requiredNumber,
  householdHousingCost: validationMethods.requiredNumber,
  householdDebt: validationMethods.requiredNumber,
};

const initalState = (
  creditAssessmentHouseholdEconomy?: ICreditAssessmentHouseholdEconomy
): CreditAssessmentHouseholdEconomyState => {
  const value: CreditAssessmentHouseholdEconomy = {
    maritalStatus: creditAssessmentHouseholdEconomy?.maritalStatus || '',
    income: creditAssessmentHouseholdEconomy?.income.toString() || '',
    employment: creditAssessmentHouseholdEconomy?.employment.toString() || '',
    householdChildren: creditAssessmentHouseholdEconomy?.householdChildren.toString() || '',
    householdIncome: creditAssessmentHouseholdEconomy?.householdIncome.toString() || '',
    householdHousingCost: creditAssessmentHouseholdEconomy?.householdHousingCost.toString() || '',
    householdDebt: creditAssessmentHouseholdEconomy?.householdDebt.toString() || '',
  };
  return {
    value,
    validation: {
      maritalStatus: validation.maritalStatus(value.maritalStatus),
      income: validation.income(value.income),
      employment: validation.employment(value.employment),
      householdChildren: validation.householdChildren(value.householdChildren),
      householdIncome: validation.householdIncome(value.householdIncome),
      householdHousingCost: validation.householdHousingCost(value.householdHousingCost),
      householdDebt: validation.householdDebt(value.householdDebt),
    },
    interact: {
      maritalStatus: false,
      income: false,
      employment: false,
      householdChildren: false,
      householdIncome: false,
      householdHousingCost: false,
      householdDebt: false,
    },
  };
};

const mock: ICreditAssessmentHouseholdEconomy = {
  employment: Employment.FullTimeEmployed,
  householdChildren: 0,
  householdDebt: 0,
  householdHousingCost: 6000,
  householdIncome: 80000,
  income: 40000,
  maritalStatus: MaritalStatus.Married,
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
    householdChildren?: InputField;
    householdIncome?: InputField;
    householdHousingCost?: InputField;
    householdDebt?: InputField;
    performApplicationButton?: ButtonBankId;
    bankId?: BankIdSign;
  } = {};
  private caseError?: string;
  private bankidError = false;
  private creditAssessmentResponse?: ICreditAssessmentStatus;

  constructor(element: HTMLDivElement | undefined | null, props: CreditAssessmentProps) {
    super(element);
    this.props = props;
    this.state = initalState(mock);

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

  private onChangeRadio(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof Omit<
      CreditAssessmentHouseholdEconomyValidation,
      'income' | 'householdChildren' | 'householdIncome' | 'householdHousingCost' | 'householdDebt'
    >;

    const value = currentTarget.value;
    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);

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
        !this.state.validation.householdIncome ||
        !this.state.validation.householdHousingCost ||
        !this.state.validation.householdDebt
    );
  }

  private onAbort() {
    const { store } = this.props;
    this.view = 1;
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }

    const caseId = store.getState().caseId;
    if (caseId) {
      creditAssessmentCancelSigning(caseId);
      setCreditAssessmentResponse()(store.dispatch);
    }
    destroyPortal();
    this.creditAssessmentResponse = undefined;
    this.render(true);
  }

  private bankIdStatus(caseId: string, method: AuthMethod) {
    this.bankidStatusInterval = setInterval(async () => {
      try {
        const response = await creditAssessmentGetStatus(caseId);

        const status = response.getStatus();
        if (status === 'signed') {
          this.contexts.bankId?.setTitle('Väntar på Volvofinans Bank...');
          this.contexts.bankId?.setDescription(
            'Hämtar uppgifter från Volvofinans Bank. Vänta kvar det kan ta några sekunder.'
          );
          this.contexts.bankId?.setFinalizing(true);
        }

        if (response.isScored()) {
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
        }

        if (response.shouldRenewSigning()) {
          this.onStartBankIdAuth(method);
        }
      } catch (e) {
        clearInterval(this.bankidStatusInterval as NodeJS.Timer);
        this.contexts.bankId?.setErrorMessage(
          '<p>Det gick inte att hämta status kring nuvanrade BankId signering. Nytt försök sker igenom om 2 sekunder</p>'
        );
      }
    }, 2000);
  }

  private async onStartBankIdAuth(method: AuthMethod) {
    const caseId = this.props.store.getState().caseId;
    if (!caseId) throw 'Missing caseID';
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }

    try {
      this.contexts.bankId?.update(method);
      const response = await creditAssessmentSignCase({ caseId, method });
      this.bankIdStatus(caseId, method);
      if (method === AuthMethod.SameDevice) {
        const autoLaunchUrl = response.getAutoLaunchUrl() as string;
        this.contexts.bankId?.update(method, autoLaunchUrl);
      } else {
        const qrCode = response.getQrCode() as string;
        this.contexts.bankId?.update(method, qrCode);
      }
    } catch (e) {
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
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
      const caseId = store.getState().caseId;
      if (caseId) {
        creditAssessmentCancelSigning(caseId);
        setCreditAssessmentResponse()(store.dispatch);
      }
    }

    const caseId = await this.newCreditAssessmentCase();
    if (caseId) {
      setCreditAssessmentResponse(caseId)(store.dispatch);
      this.onStartBankIdAuth(method);
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

      const assessmentCase: ICreditAssessmentInquiry = {
        customer: {
          ...customer,
        },
        householdEconomy: this.state.value as unknown as ICreditAssessmentHouseholdEconomy,
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
        <p class="waykeecom-content">För att besvara din förfrågan om billån behöver Volvofinans Bank några fler uppgifter om dig och ditt hushåll. Frågorna tar bara någon minut att besvara. Bekräfta och signera sedan med BankID – därefter får du ditt lånebesked direkt på skärmen och kan gå vidare med ditt bilköp. Blir du godkänd så gäller lånebeskedet genom hela köpet så länge inga tillägg görs – men din ansökan är inte bindande.</p>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-balloon waykeecom-balloon--info" id="${WHY_DESCRIPTION}"></div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2">
          <h5 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Uppgifter om dig</h5>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${MARITAL_STATUS_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${INCOME_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${EMPLOYMENT_NODE}"></div>
      </div>

      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2">
          <h5 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Uppgifter om ditt hushåll</h5>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${HOUSEHOLD_CHILDREN_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${HOUSEHOLD_INCOME_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${HOUSEHOLD_HOUSING_COST_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${HOUSEHOLD_DEBT_NODE}"></div>
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
          children: `<p>Du betalar inget i detta steg, detta är bara en låneansökan. Köpet slutförs sedan vid möte med ${branchName}.</p>`,
        })}
      </div>

      ${
        this.caseError
          ? `
            <div class="waykeecom-stack waykeecom-stack--3">
              ${Alert({
                tone: 'error',
                children: `<p>Det gick inte att starta en låneansökan, försök igen.${
                  this.caseError !== undefined ? this.caseError : ''
                }</p>`,
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
              children: `<p>Ett fel uppstod med BankId, försök igen.</p>`,
            })}
          </div>
          `
          : ''
      }
      
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2" id="${PERFORM_APPLICATION_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--2" id="${DISCLAIMER_NODE}"></div>
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
              title: 'Gift eller sambo',
            },
            {
              id: `maritalStatus-${2}`,
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
              title: 'Fast- eller tillsvidareanställd',
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
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.householdChildren = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${HOUSEHOLD_CHILDREN_NODE}`),
        {
          title: 'Antal hemmavarande barn',
          value: this.state.value.householdChildren,
          id: HOUSEHOLD_CHILDREN,
          error: this.state.interact.householdChildren && !this.state.validation.householdChildren,
          errorMessage: 'Ange antal hemmavarande barn',
          name: 'householdChildren',
          autocomplete: 'off',
          placeholder: '',
          type: 'number',
          information: `
            <p><span class="waykeecom-text waykeecom-text--font-medium">Hur många barn försörjer du?</span></p>
            <p>Fyll i antal barn som får barn- eller studiebidrag och som du försörjer. Barn som bor hemma och arbetar och kan försörja sig själva behöver inte räknas med.</p>
            <p>För dig som har delad vårdnad: ange samtliga barn som bor minst 50 % i hushållet.</p>
          `,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.householdIncome = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${HOUSEHOLD_INCOME_NODE}`),
        {
          title: 'Hushållets inkomst per månad före skatt',
          value: this.state.value.householdIncome,
          id: HOUSEHOLD_INCOME,
          error: this.state.interact.householdIncome && !this.state.validation.householdIncome,
          errorMessage: 'Ange hushållets inkomst per månad före skatt',
          name: 'householdIncome',
          autocomplete: 'off',
          placeholder: '',
          unit: 'kr',
          type: 'number',
          information: `
            <p><span class="waykeecom-text waykeecom-text--font-medium">Hur stor inkomst har ert hushåll per månad före skatt?</span></p>
            <p>Ange hur stor hushållets totala inkomst är. Exempel på inkomster kan vara:</p>
            <ul>
              <li>Lön</li>
              <li>Pension</li>
              <li>Kapitalinkomst</li>
            </ul>
          `,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.householdHousingCost = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${HOUSEHOLD_HOUSING_COST_NODE}`),
        {
          title: 'Hushållets ungefärliga boendekostnader per månad',
          value: this.state.value.householdHousingCost,
          id: HOUSEHOLD_HOUSING_COST,
          error:
            this.state.interact.householdHousingCost && !this.state.validation.householdHousingCost,
          errorMessage: 'Ange hushållets ungefärliga boendekostnader per månad',
          name: 'householdHousingCost',
          autocomplete: 'off',
          placeholder: '',
          unit: 'kr',
          type: 'number',
          information: `
            <p><span class="waykeecom-text waykeecom-text--font-medium">Hur stora utgifter för ert boende har ditt hushåll varje månad?</span></p>
            <p>Ange hur stor hushållets ungefärliga boendekostnader är. Exempel på kostnader kan vara:</p>
            <ul>
              <li>Hyra</li>
              <li>Avgift till förening</li>
              <li>Driftkostnader</li>
              <li>Räntekostnader</li>
            </ul>
            <p><span class="waykeecom-text waykeecom-text--italic">Amorteringskostnader ingår inte i beräkningen.</span></p>
          `,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
        }
      );

      this.contexts.householdDebt = new InputField(
        this.node.querySelector<HTMLDivElement>(`#${HOUSEHOLD_DEBT_NODE}`),
        {
          title: 'Hushållets totala skulder',
          value: this.state.value.householdDebt,
          id: HOUSEHOLD_DEBT,
          error: this.state.interact.householdDebt && !this.state.validation.householdDebt,
          errorMessage: 'Ange hushållets totala skulder',
          name: 'householdDebt',
          autocomplete: 'off',
          placeholder: '',
          unit: 'kr',
          type: 'number',
          information: `
            <p><span class="waykeecom-text waykeecom-text--font-medium">Hur mycket andra skulder har ert hushåll?</span></p>
            <p>Ange kostnaden för samtliga övriga lån och skulder som hushållet har. Exempel på andra lån och skulder kan vara:</p>
            <ul>
              <li>Andra billån</li>
              <li>Bostadslån</li>
              <li>Studielån</li>
              <li>Blanco/privatlån</li>
              <li>Kortkredit</li>
            </ul>
          `,
          onChange: (e) => this.onChange(e),
          onBlur: (e) => this.onBlur(e),
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
            this.state.validation.householdIncome &&
            this.state.validation.householdHousingCost &&
            this.state.validation.householdDebt
          ),
          onClick: () => {
            this.view = 2;
            this.render();
          },
        }
      );

      new Disclaimer(this.node.querySelector<HTMLDivElement>(`#${DISCLAIMER_NODE}`), {
        text: `Genom att klicka på ”Genomför låneansökan” godkänner jag att Volvofinans Bank gör en kreditupplysning på mig baserat på informationen ovan och jag bekräftar att jag läst <a href="#" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">Volvofinans Banks dataskyddspolicy</a>. Dina uppgifter lagras och sparas säkert.`,
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
            <p>Volvofinans Bank, liksom alla banker i Sverige, är enligt lagen om åtgärder mot penningtvätt och finansiering av terrorism skyldiga att ha god kännedom om sina kunder. Därför måste vi ställa frågor om dig som kund. Den information vi får om dig behandlas konfidentiellt och omfattas av banksekretessen och GDPR.<p>
            <p><a href="#" title="" target="_blank" rel="noopener norefferer" class="waykeecom-link">Läs mer om detta här</a></p>
          </div>`,
      });

      if (scrollIntoView || this.caseError || this.bankidError) {
        this.node.querySelector(`#${PERFORM_APPLICATION_NODE}`)?.scrollIntoView();
      }
    }
  }
}

export default CreditAssessment;
