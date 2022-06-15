import { customers, DeliveryType, orders, PaymentType, vehicles } from '@wayke-se/ecom';
import { IOrderInsuranceRequest } from '@wayke-se/ecom/dist-types/orders/types';
import { WaykeStore } from '../Redux/store';

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

  const paymentBuilder = orders.newPayment().withType(state.paymentType);
  if (state.paymentType === PaymentType.Loan) {
    const loan = state.order?.paymentOptions.find((x) => x.type === PaymentType.Loan);

    const loanDetails = state.paymentLookupResponse || loan?.loanDetails;

    const duration = loanDetails?.durationSpec.current as number;
    const downPayment = loanDetails?.downPaymentSpec.current as number;
    const residual = loanDetails?.residualValueSpec?.current as number;
    const externalId = state.order?.paymentOptions.find(
      (x) => x.type === PaymentType.Loan
    )?.externalId;

    paymentBuilder
      .withDuration(duration) // months, only applicable when payment type === PaymentType.Loan
      .withDownPayment(downPayment); // only applicable when payment type === PaymentType.Loan
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

/*
const creditAssessment = orders
  .newCreditAssessment() // Only required for orders using credit assessment
  .withScoreId('score-id')
  .withFinancialProductCode('code')
  .withRecommendation('recommendation')
  .withDecision('decision')
  .build();

const payment = orders
  .newPayment()
  .withType(aPaymentOption.type)
  .withDuration(36) // months, only applicable when payment type === PaymentType.Loan
  .withDownPayment(25000) // only applicable when payment type === PaymentType.Loan
  .withResidualValue(20000) // only applicable when payment type === PaymentType.Loan
  .withExternalId('some-id') // only applicable when payment type === PaymentType.Loan
  .withCreditAssessment(creditAssessment) // only applicable for orders that should use credit assessment
  .build();

const insurance = orders
  .newInsurance()
  .withDrivingRange(2000)
  .withAddOns(['Add On 1', 'Add On 2']) // optional
  .build();

const tradein = vehicles
  .newVehicleTrade()
  .forVehicle('REGISTRATION-NUMBER')
  .withMileage(7600)
  .withCondition(VehicleCondition.VeryGood)
  .withComment('A very nice car for daily commute!') // optional
  .build();

const request = orders
  .newCreateRequest()
  .forVehicle('VEHICLE-ID-FROM-WAYKE')
  .withCustomer(customer)
  .withPayment(payment)
  .withDeliveryType(aDeliveryOption.type)
  .withInsurance(insurance) // optional
  .withTradeIn(tradein) // optional
  .build();

const response = await orders.create(request);
*/
