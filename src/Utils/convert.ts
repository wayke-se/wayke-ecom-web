import { ICreditAssessmentStatusResponse } from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import { VehicleLookupResponse } from '@wayke-se/ecom/dist-types/vehicles/vehicle-lookup-response';
import { ICreditAssessmentStatus } from '../@types/CreditAssessmentStatus';
import { OrderOptions } from '../@types/OrderOptions';
import { PaymentLookup } from '../@types/PaymentLookup';
import { VehicleLookup } from '../@types/VehicleLookup';

export const convertPaymentLookupResponse = (plr: PaymentLookupResponse): PaymentLookup => {
  const response: PaymentLookup = {
    costs: plr.getCosts(),
    fees: plr.getFees(),
    interests: plr.getInterests(),
    durationSpec: plr.getDurationSpec(),
    downPaymentSpec: plr.getDownPaymentSpec(),
    residualValueSpec: plr.getResidualValueSpec(),
    totalResidualValue: plr.getTotalResidualValue(),
    publicURL: plr.getPublicURL(),
    shouldUseCreditScoring: plr.shouldUseCreditScoring(),
    financialProductCode: plr.getFinancialProductCode(),
    price: plr.getPrice(),
    creditAmount: plr.getCreditAmount(),
    hasPrivacyPolicy: plr.hasPrivacyPolicy(),
    privacyPolicyUrl: plr.getPrivacyPolicyUrl(),
    kalpUrl: plr.getKALPURL(),
  };
  return response;
};

export const convertCreditAssessmentStatusResponse = (cCAr: ICreditAssessmentStatusResponse) => {
  const response: ICreditAssessmentStatus = {
    status: cCAr.getStatus(),
    hasPendingSigning: cCAr.hasPendingSigning(),
    hintCode: cCAr.getHintCode(),
    signingMessage: cCAr.getSigningMessage(),
    shouldRenewSigning: cCAr.shouldRenewSigning(),
    isSigned: cCAr.isSigned(),
    address: undefined, // cCAr.getAddress(),
    pendingScoring: cCAr.hasPendingScoring(),
    isScored: cCAr.isScored(),
    hasScoringError: cCAr.hasScoringError(),
    scoringId: cCAr.getScoringId(),
    recommendation: cCAr.getRecommendation(),
    decision: cCAr.getDecision(),
    isAccepted: cCAr.isAccepted(),
  };
  return response;
};

export const convertOrderOptionsResponse = (cOOR: OrderOptionsResponse) => {
  const response: OrderOptions = {
    orderVehicle: cOOR.getOrderVehicle(),
    accessories: cOOR.getAccessories(),
    requiresDealerSelection: cOOR.requiresDealerSelection(),
    dealerSites: cOOR.getDealerSites(),
    paymentOptions: cOOR.getPaymentOptions().map((option) => ({
      ...option,
      loanDetails: option.loanDetails
        ? convertPaymentLookupResponse(option.loanDetails)
        : undefined,
    })),
    deliveryOptions: cOOR.getDeliveryOptions(),
    insuranceOption: cOOR.getInsuranceOption(),
    orderConditions: cOOR.getOrderConditions(),
    orderReturnConditions: cOOR.getOrderReturnConditions(),
    conditionsPdfUri: cOOR.getConditionsPdfUri(),
    contactInformation: cOOR.getContactInformation(),
    allowsTradeIn: cOOR.allowsTradeIn(),
    isUnavailable: cOOR.isUnavailable(),
    isPaymentRequired: cOOR.isPaymentRequired(),
  };
  return response;
};

export const convertVehicleLookupResponse = (cVLR: VehicleLookupResponse): VehicleLookup => {
  const response: VehicleLookup = {
    vehicle: cVLR.getVehicle(),
  };

  return response;
};
