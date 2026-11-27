import {
  ICreditAssessmentCustomer,
  ICreditAssessmentInquiry,
  ICreditAssessmentLoan,
  ICreditAssessmentHouseholdEconomy,
  HousingType,
} from './types';

export const validateHouseholdEconomy = (householdEconomy: ICreditAssessmentHouseholdEconomy) => {
  if (!householdEconomy) {
    throw new TypeError('Household economy can not be falsy');
  }

  if (!householdEconomy.employment) {
    throw new TypeError('Household economy must have employment');
  }

  if (!householdEconomy.maritalStatus) {
    throw new TypeError('Household economy must have marital status');
  }

  if (!householdEconomy.income && householdEconomy.income !== 0) {
    throw new TypeError('Household economy must have income');
  }

  if (!householdEconomy.householdChildren && householdEconomy.householdChildren !== 0) {
    throw new TypeError('Household economy must have household children');
  }

  if (
    householdEconomy.housingType === HousingType.SingleFamily &&
    householdEconomy.housingCost > 0
  ) {
    throw new TypeError('A single family housing type can not have separate costs');
  }

  if (!householdEconomy.housingType) {
    throw new TypeError('Household must be of a specific type');
  }
};

export const validateLoan = (loan: ICreditAssessmentLoan) => {
  if (!loan) {
    throw new TypeError('Loan can not be falsy');
  }

  if (!loan.financialProductId) {
    throw new TypeError('Loan must have financial product id');
  }

  if (!loan.credit && loan.credit !== 0) {
    throw new TypeError('Loan must have credit');
  }

  if (!loan.downPayment && loan.downPayment !== 0) {
    throw new TypeError('Loan must have down payment');
  }

  if (!loan.interestRate && loan.interestRate !== 0) {
    throw new TypeError('Loan must have interest rate');
  }

  if (!loan.monthlyCost && loan.monthlyCost !== 0) {
    throw new TypeError('Loan must have monthly cost');
  }

  if (!loan.price && loan.price !== 0) {
    throw new TypeError('Loan must have price');
  }
};

export const validateCustomer = (customer: ICreditAssessmentCustomer) => {
  if (!customer) {
    throw new TypeError('Customer can not be falsy');
  }

  if (!customer.socialId) {
    throw new TypeError('Customer must have social id');
  }

  if (!customer.email) {
    throw new TypeError('Customer must have email');
  }

  if (!customer.phone) {
    throw new TypeError('Customer must have phone');
  }
};

export const validateInquiry = (inquiry: ICreditAssessmentInquiry) => {
  if (!inquiry) {
    throw new TypeError('Inquiry can not be falsy');
  }

  if (!inquiry.externalId) {
    throw new TypeError('Inquiry must have external id');
  }

  validateHouseholdEconomy(inquiry.householdEconomy);
  validateLoan(inquiry.loan);
  validateCustomer(inquiry.customer);
};
