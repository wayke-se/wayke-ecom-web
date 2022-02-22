import { customers, DeliveryType, orders, PaymentType, vehicles } from '@wayke-se/ecom';
import store from '../Redux/store';

export const createOrder = () => {
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
  if (state.paymentType === PaymentType.Cash) {
    const duration = state.paymentLookupResponse?.getDurationSpec().current as number;
    const downPayment = state.paymentLookupResponse?.getDownPaymentSpec().current as number;
    const residual = state.paymentLookupResponse?.getResidualValueSpec().current as number;

    paymentBuilder
      .withDuration(duration) // months, only applicable when payment type === PaymentType.Loan
      .withDownPayment(downPayment) // only applicable when payment type === PaymentType.Loan
      .withResidualValue(residual) // only applicable when payment type === PaymentType.Loan
      .withExternalId('some-id'); // only applicable when payment type === PaymentType.Loan
  }
  const payment = paymentBuilder.build();

  const requestBuilder = orders
    .newCreateRequest()
    .forVehicle(state.vehicle.id)
    .withCustomer(customer)
    .withPayment(payment)
    .withDeliveryType(state.homeDelivery ? DeliveryType.Delivery : DeliveryType.Pickup);
  //.withInsurance(insurance) // optional

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