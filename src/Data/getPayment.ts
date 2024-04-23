import { payments } from '@wayke-se/ecom';

interface PaymentRequest {
  vehicleId: string;
  downPayment: number;
  duration: number;
  residual?: number;
  dealerId?: string;
  financialOptionId?: string;
}

export const getPayment = ({
  vehicleId,
  dealerId,
  downPayment,
  duration,
  residual,
  financialOptionId,
}: PaymentRequest) => {
  const request = payments
    .newLookupRequest()
    .forVehicle(vehicleId)
    .withDownPayment(downPayment)
    .withDuration(duration);

  if (financialOptionId) {
    request.withFinancialOptionId(financialOptionId);
  }

  if (residual !== undefined) {
    request.withResidualValue(residual);
  }

  if (dealerId !== undefined) {
    request.forDealer(dealerId);
  }

  return payments.lookupPayment(request.build());
};
