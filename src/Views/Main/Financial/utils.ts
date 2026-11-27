import { PaymentOption } from '../../../@types/OrderOptions';
import { PaymentType } from '../../../sdk';

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
  if (index === -1) return s as PaymentType;
  return s.slice(0, index) as PaymentType;
};

export const extractLoanIndex = (s?: string): number | undefined => {
  if (!s) return undefined;
  const index = s.indexOf('-');
  return parseInt(s.slice(index + 1), 10);
};

/**
 * The loan option the customer picked. An ad can have several (one per financing packaging),
 * and the payment type carries the index of the chosen one ("Loan-1"). Counts the loans the
 * same way `createOrder` does, so what is shown is what is ordered.
 */
export const findSelectedLoan = (
  paymentOptions?: PaymentOption[],
  paymentType?: string
): PaymentOption | undefined => {
  const loans = paymentOptions?.filter((x) => x.type === PaymentType.Loan) ?? [];
  const index = extractLoanIndex(paymentType);
  return (index !== undefined ? loans[index] : undefined) ?? loans[0];
};
