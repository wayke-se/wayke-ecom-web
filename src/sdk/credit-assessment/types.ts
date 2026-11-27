import { AuthMethod } from '../bankid/types';
import { IAddress } from '../customers/types';

export enum MaritalStatus {
  Married = 'married',
  Single = 'single',
  CommonLaw = 'commonLaw',
}

export enum Employment {
  Other = 'other',
  Retired = 'retired',
  FullTimeEmployed = 'fullTimeEmployed',
  Student = 'student',
  TemporarilyEmployed = 'temporarilyEmployed',
  SelfEmployed = 'selfEmployed',
}

export enum HousingType {
  SingleFamily = 'singleFamily',
  Condominium = 'condominium',
  Apartment = 'apartment',
}

export interface ICreditAssessmentCustomer {
  socialId: string;
  email: string;
  phone: string;
  signerIp?: string;
}

export interface IDebtSpecification {
  privateLoan: number;
  vehicleLoan: number;
  leasingFees: number;
  cardCredits: number;
  collateral: number;
}

export interface ICreditAssessmentLoan {
  financialProductId: string;
  price: number;
  downPayment: number;
  credit: number;
  interestRate: number;
  monthlyCost: number;
  term: string;
}

export interface ICreditAssessmentHouseholdEconomy {
  maritalStatus: MaritalStatus;
  income: number;
  employment: Employment;
  householdChildren: number;
  housingType: HousingType;
  housingCost: number;
  debtSpecification: IDebtSpecification;
}

export interface ICreditAssessmentInquiry {
  externalId: string;
  customer: ICreditAssessmentCustomer;
  loan: ICreditAssessmentLoan;
  householdEconomy: ICreditAssessmentHouseholdEconomy;
}

export interface ICreditAssessmentCase {
  caseId: string;
}

export interface ICreditAssessmentStatusApiResponse {
  status: string;
  bankIdHintCode?: string;
  vfScoreCaseId?: string;
  recommendation?: string;
  decision?: string;
  qrCode?: string;
}

export interface ICreditAssessmentStatusResponse {
  getStatus: () => CreditAssessmentStatus;
  hasPendingSigning: () => boolean;
  getHintCode: () => string | undefined;
  getSigningMessage(): string;
  shouldRenewSigning(): boolean;
  isSigned(): boolean;
  getAddress(): IAddress | undefined;
  hasPendingScoring: () => boolean;
  isScored: () => boolean;
  hasScoringError: () => boolean;
  getScoringId: () => string | undefined;
  getRecommendation: () => CreditAssessmentRecommendation;
  getDecision: () => CreditAssessmentDecision;
  getQrCode: () => string | undefined;
  isAccepted: () => boolean;
}

export enum CreditAssessmentStatus {
  Received = 'received',
  SigningInitiated = 'signingInitiated',
  SigningFailed = 'signingFailed',
  Signed = 'signed',
  ScoringInitiated = 'scoringInitiated',
  Scored = 'scored',
  NotScored = 'notScored',
  Accepted = 'accepted',
  Declined = 'declined',
  Unknown = 'unknown',
}

export enum CreditAssessmentDecision {
  Approved = 'approved',
  Rejected = 'rejected',
  Unknown = 'unknown',
}

export enum CreditAssessmentRecommendation {
  Approve = 'approve',
  AssessManually = 'assessManually',
  Reject = 'reject',
  Unknown = 'unknown',
}

export interface ICreditAssessmentSignRequest {
  caseId: string;
  method: AuthMethod;
}

export interface ICreditAssessmentSignApiResponse {
  qrCodeAsBase64?: string;
  autoLaunchUrl?: string;
}

export interface ICreditAssessmentSignResponse {
  isQrCode: () => boolean;
  isSameDevice: () => boolean;
  getQrCode: () => string | undefined;
  getAutoLaunchUrl: () => string | undefined;
  getMethod: () => AuthMethod;
  getCaseId: () => string;
}
