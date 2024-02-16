import { PaymentType } from '@wayke-se/ecom';

const createTerm = (months: number) => {
  const isPositive = months > 0;
  const factorOf12 = months % 12 === 0;

  const isInvalid = !isPositive || !factorOf12;
  if (isInvalid) {
    throw new TypeError('Invalid months for creating creidt assessment term');
  }

  return `${months}months`;
};

export default createTerm;

export const extractPaymentType = (s?: string): PaymentType | undefined => {
  if (!s) return undefined;
  const index = s.indexOf('-');
  return s.slice(0, index) as PaymentType;
};

export const extractLoanIndex = (s?: string): number | undefined => {
  if (!s) return undefined;
  const index = s.indexOf('-');
  return parseInt(s.slice(index + 1), 10);
};
