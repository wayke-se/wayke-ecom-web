import { payments } from '@wayke-se/ecom';

interface PaymentRequest {
  vehicleId: string;
  downPayment: number;
  duration: number;
  residual?: number;
  dealerId?: string;
}

export const getPayment = ({
  vehicleId,
  dealerId,
  downPayment,
  duration,
  residual,
}: PaymentRequest) => {
  const request = payments
    .newLookupRequest()
    .forVehicle(vehicleId)
    .withDownPayment(downPayment)
    .withDuration(duration);

  if (residual !== undefined) {
    request.withResidualValue(residual);
  }

  if (dealerId !== undefined) {
    request.forDealer(dealerId);
  }

  return payments.lookupPayment(request.build());
};
