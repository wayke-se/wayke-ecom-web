import { DeliveryType, PaymentType, customers, orders, vehicles } from '@wayke-se/ecom';
import { IOrderInsuranceRequest } from '@wayke-se/ecom/dist-types/orders/types';
import { WaykeStore } from '../Redux/store';
import { extractLoanIndex, extractPaymentType } from '../Views/Main/Financial/utils';

export const createOrder = (store: WaykeStore) => {
  const state = store.getState();
  if (!state.address) throw 'Missing address';
  if (!state.paymentType) throw 'Missing paymentType';
  if (!state.vehicle) throw 'Missing vehicle';

  const customer = customers
    .newCustomer()
    .withAddress(state.address)
    .withPersonalNumber(state.customer.socialId)
    .withEmail(state.customer.email)
    .withPhoneNumber(state.customer.phone)
    .build();

  const paymentType = extractPaymentType(state.paymentType)!;
  const paymentBuilder = orders.newPayment().withType(paymentType);
  if (paymentType === PaymentType.Loan) {
    const index = extractLoanIndex(state.paymentType)!;
    const loan = state.order?.paymentOptions.filter((x) => x.type === PaymentType.Loan)?.[index];

    const loanDetails = state.paymentLookupResponse || loan?.loanDetails;

    const duration = loanDetails?.durationSpec.current as number;
    const downPayment = loanDetails?.downPaymentSpec.current as number;
    const residual = loanDetails?.residualValueSpec?.current as number;
    const externalId = state.order?.paymentOptions.find(
      (x) => x.type === PaymentType.Loan
    )?.externalId;

    paymentBuilder
      .withDuration(duration) // months, only applicable when payment type === PaymentType.Loan
      .withDownPayment(Math.round(downPayment)); // only applicable when payment type === PaymentType.Loan
    if (residual) {
      paymentBuilder.withResidualValue(residual); // only applicable when payment type === PaymentType.Loan
    }

    if (externalId) {
      paymentBuilder.withExternalId(externalId); // only applicable when payment type === PaymentType.Loan
    }

    if (state.creditAssessmentResponse) {
      const scoreId = state.creditAssessmentResponse.scoringId;
      const recommendation = state.creditAssessmentResponse.recommendation;
      const decision = state.creditAssessmentResponse.decision;
      const financialProductCode = loanDetails?.financialProductCode;
      if (!scoreId || !recommendation || !decision || !financialProductCode)
        throw 'Missing credit assessment data';

      const creditAssessment = orders
        .newCreditAssessment() // Only required for orders using credit assessment
        .withScoreId(scoreId)
        .withFinancialProductCode(financialProductCode)
        .withRecommendation(recommendation)
        .withDecision(decision)
        .build();
      paymentBuilder.withCreditAssessment(creditAssessment);
    }
  }
  const payment = paymentBuilder.build();

  const params = new URLSearchParams(window.location.search);
  params.set('wayke-ecom-web-id', state.id);

  const callbackUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}${
    window.location.hash
  }`;

  params.set('wayke-ecom-web-payment', 'true');
  const paymentUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}${
    window.location.hash
  }`;

  const requestBuilder = orders
    .newCreateRequest()
    .forVehicle(state.id)
    .withCustomer(customer)
    .withPayment(payment)
    .withUrls(callbackUrl, paymentUrl)
    .withDeliveryType(state.homeDelivery ? DeliveryType.Delivery : DeliveryType.Pickup);

  if (state.insurance) {
    const insuranceBuilder = orders.newInsurance().withDrivingDistance(state.drivingDistance);
    if (
      state.insuranceAddOns?.addOns.length &&
      state.insuranceAddOns.insurance === state.insurance.name
    ) {
      insuranceBuilder.withAddOns(state.insuranceAddOns.addOns.map((x) => x.name));
    }

    const insurance = insuranceBuilder.build();

    requestBuilder.withInsurance(insurance);
  } else if (state.freeInsurance) {
    requestBuilder.withInsurance({} as IOrderInsuranceRequest);
  }

  if (state.accessories.length) {
    requestBuilder.withAccessories(state.accessories);
  }

  if (state.tradeIn && state.tradeInVehicle && state.tradeIn.condition) {
    const tradeIn = vehicles
      .newVehicleTrade()
      .forVehicle(state.tradeIn.registrationNumber)
      .withMileage(parseInt(state.tradeIn.mileage, 10))
      .withCondition(state.tradeIn.condition)
      .withComment(state.tradeIn.description)
      .build();

    requestBuilder.withTradeIn(tradeIn);
  }

  return orders.create(requestBuilder.build());
};
