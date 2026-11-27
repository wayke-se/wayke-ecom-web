const factory = require('autofixture');

factory.define('IApiConfiguration', ['address']);

factory.define('IOriginConfiguration', ['topic', 'channel']);

factory.define('IConfiguration', [
  'api'.fromFixture('IApiConfiguration'),
  'origin'.fromFixture('IOriginConfiguration'),
  'bankIdThumbprint',
]);

factory.define('IApiResponse', ['successful'.asBoolean(), 'response', 'requestForgeryToken']);

factory.define('IApiErrorResponse', [
  'successful'.asConstant(false),
  'errorCode'.asNumber(),
  'message',
]);

factory.define('IDistance', ['value'.asNumber(), 'unit'.pickFrom(['m', 'km'])]);

const IAddress = [
  'city',
  'name',
  'postalCode',
  'street',
  'street2',
  'distance'.fromFixture('IDistance'),
];
factory.define('IAddress', IAddress);

factory.define('ICustomer', [
  'name',
  'personalNumber',
  'email',
  'phoneNumber',
  'address'.fromFixture('IAddress'),
]);

factory.define('IOrderUrls', ['redirect', 'payment']);

factory.define('IAddressLookupRequest', ['personalNumber']);
factory.define('IAddressLookupResponse', [].concat(IAddress));

factory.define('IInsuranceOptionsResponse.IInsuranceOption', [
  'name',
  'price'.asNumber(),
  'unit',
  'includesFinancingInPrice'.asBoolean(),
  'addons'.asListOfFixtures('IInsuranceOptionsResponse.AddOn', 3),
  'description',
  'branding',
  'insuranceItems'.asListOfFixtures('IInsuranceOptionsResponse.Item', 3),
  'legalUrl',
  'legalDescription',
]);

factory.define('IInsuranceOptionsResponse.AddOn', [
  'title',
  'name',
  'description',
  'monthlyPrice'.asNumber(),
  'exclude'.asArray(1),
]);

factory.define('IInsuranceOptionsResponse.Item', ['name', 'description']);

factory.define('IInsuranceOptionsRequest', [
  'id',
  'personalNumber',
  'drivingDistance'.pickFrom([
    'Between0And1000',
    'Between1000And1500',
    'Between1500And2000',
    'Between2000And2500',
    'Over2500',
  ]),
]);

factory.define('IInsuranceOptionsResponse', [
  'insurances'.asListOfFixtures('IInsuranceOptionsResponse.IInsuranceOption', 2),
]);

factory.define('IContactInformation', [
  'address',
  'city',
  'email',
  'homePage',
  'name',
  'phone',
  'zip',
]);
factory.define('IOrderDelivery', [
  'type'.pickFrom(['Pickup', 'Delivery']),
  'deliveryTime',
  'startupCost'.asNumber(),
  'unitPrice'.asNumber(),
  'unit'.pickFrom(['km']),
  'minQuantity'.asNumber(),
  'maxQuantity'.asNumber(),
]);
factory.define('IOrderInsurance', ['description', 'logo', 'title', 'url', 'ecomInsuranceText']);

factory.define('IOrderPayment', [
  'loanDetails'.fromFixture('IPaymentLookupResponse'),
  'logo',
  'name',
  'price'.asNumber(),
  'type'.pickFrom(['Cash', 'Lease', 'Loan']),
  'unit',
  'externalId',
]);

factory.define('IVehicleTrade', [
  'registrationNumber',
  'mileage'.asNumber(),
  'condition'.pickFrom(['VeryGood', 'Good', 'Ok']),
  'comments',
]);
factory.define('IOrderInsuranceRequest', [
  'personalNumber',
  'drivingDistance'.pickFrom([
    'Between0And1000',
    'Between1000And1500',
    'Between1500And2000',
    'Between2000And2500',
    'Over2500',
  ]),
  'addons'.asArray(2),
]);
factory.define('IOrderCreditAssessment', [
  'scoreId',
  'financialProductCode',
  'recommendation',
  'decision',
]);
factory.define('IOrderPaymentRequest', [
  'type'.pickFrom(['Cash', 'Lease', 'Loan']),
  'months'.asNumber(),
  'downPayment'.asNumber(),
  'residualValue'.asNumber(),
  'externalId',
  'creditAssessment'.fromFixture('IOrderCreditAssessment'),
]);
factory.define('IOrderCreateRequest', [
  'id',
  'tradein'.fromFixture('IVehicleTrade'),
  'insurance'.fromFixture('IOrderInsuranceRequest'),
  'payment'.fromFixture('IOrderPaymentRequest'),
  'deliveryType'.pickFrom('Pickup', 'Delivery'),
  'customer'.fromFixture('ICustomer'),
  'urls'.fromFixture('IOrderUrls'),
]);
factory.define('IOrderCreateResponse', ['id', 'payment'.fromFixture('IPaymentResponse')]);

factory.define('IOrderOptionsRequest', ['id', 'branchId']);
factory.define('IOrderOptionsResponse', [
  'vehicle',
  'accessories'.asListOfFixtures('IAccessory', 2),
  'dealers'.asListOfFixtures('IDealerOption', 2),
  'conditions',
  'returnConditions',
  'conditionsPdfUri',
  'contactInformation'.fromFixture('IContactInformation'),
  'delivery'.asListOfFixtures('IOrderDelivery', 2),
  'insurance'.fromFixture('IOrderInsurance'),
  'payment'.asListOfFixtures('IOrderPayment', 2),
  'tradeIn'.asBoolean(),
  'unavailable'.asBoolean(),
  'reserved'.asBoolean(),
  'paymentRequired'.asBoolean(),
]);

factory.define('IAccessory', [
  'id',
  'articleNumber',
  'logoUrl',
  'longDescription',
  'shortDescription',
  'manufacturer',
  'model',
  'name',
  'price'.asNumber(),
  'assemblyPrice'.asNumber(),
  'salePrice'.asNumber(),
  'productPageLink',
  'productPageLinkText',
  'media'.asListOfFixtures('IAccessoryMedia', 2),
]);

factory.define('IAccessoryMedia', ['externalId', 'sortOrder'.asNumber(), 'url']);

factory.define('IDealerOption', ['id', 'name', 'location'.fromFixture('ILocation')]);

factory.define('ILocation', ['address', 'city', 'latitude'.asNumber(), 'longitude'.asNumber()]);

factory.define('IPaymentCosts', ['monthlyCost'.asNumber(), 'totalCreditCost'.asNumber()]);
factory.define('IPaymentFees', ['setupFee'.asNumber(), 'administrationFee'.asNumber()]);
factory.define('IPaymentInterests', ['interest'.asNumber(), 'effectiveInterest'.asNumber()]);
factory.define('IPaymentRangeSpec', [
  'min'.asNumber(),
  'max'.asNumber(),
  'step'.asNumber(),
  'default'.asNumber(),
  'current'.asNumber(),
]);
factory.define('IPaymentLookupRequest', [
  'id',
  'branchId',
  'duration'.asNumber(),
  'downPayment'.asNumber(),
  'financialOptionId',
]);
factory.define('IPaymentLookupResponse', [
  'monthlyCost'.asNumber(),
  'interest'.asNumber(),
  'effectiveInterest'.asNumber(),
  'setupFee'.asNumber(),
  'administrationFee'.asNumber(),
  'totalCreditCost'.asNumber(),
  'residual'.fromFixture('IPaymentRangeSpec'),
  'duration'.fromFixture('IPaymentRangeSpec'),
  'downPayment'.fromFixture('IPaymentRangeSpec'),
  'totalResidualValue'.asNumber(),
  'link',
  'vehiclePrice'.asNumber(),
  'loanAmount'.asNumber(),
  'useCreditScoring'.asBoolean(),
  'financialProductCode',
  'privacyPolicyUrl',
  'moneyLaunderingInformationUrl',
  'financialOptionId',
]);

factory.define('IVehicleLookupRequest', [
  'registrationNumber',
  'mileage'.asNumber(),
  'condition'.pickFrom(['Ok', 'Good', 'VeryGood']),
]);
factory.define('IVehicleLookupResponse', [
  'manufacturer',
  'modelName',
  'modelSeries',
  'modelYear'.asNumber(),
  'valuation'.asNumber(),
]);

factory.define('IBankIdAuthRequest', ['method'.pickFrom(['SameDevice', 'QrCode'])]);

factory.define('IBankIdAuthApiResponse', [
  'orderRef',
  'method'.pickFrom(['SameDevice', 'QrCode']),
  'qrCodeAsBase64',
  'autoLaunchUrl',
]);

factory.define('IBankIdCollectRequest', ['orderRef']);

factory.define('IBankIdCollectApiResponse', [
  'orderRef',
  'status'.pickFrom(['pending', 'failed', 'complete']),
  'hintCode'.pickFrom([
    'outstandingTransaction',
    'noClient',
    'started',
    'userSign',
    'expiredTransaction',
    'certificateErr',
    'userCancel',
    'cancelled',
    'startFailed',
    '',
  ]),
  'completionData'.fromFixture('IBankIdCompletionData'),
]);
factory.define('IBankIdCompletionData', [
  'signature',
  'ocspResponse',
  'personalNumber',
  'address'.fromFixture('IAddress'),
]);

factory.define('IBankIdCancelRequest', ['orderRef']);

factory.define('IBankIdQrCodeRequest', ['orderRef']);

factory.define('IBankIdQrCodeApiResponse', ['orderRef', 'qrCodeAsBase64']);

factory.define('ICreditAssessmentCustomer', ['socialId', 'email', 'phone', 'signerIp']);

factory.define('ICreditAssessmentLoan', [
  'financialProductId',
  'price'.asNumber(),
  'downPayment'.asNumber(),
  'credit'.asNumber(),
  'interestRate'.asNumber(),
  'monthlyCost'.asNumber(),
  'term',
]);

factory.define('ICreditAssessmentDebtSpecification', [
  'privateLoan'.asNumber(),
  'vehicleLoan'.asNumber(),
  'leasingFees'.asNumber(),
  'cardCredits'.asNumber(),
  'collateral'.asNumber(),
]);

factory.define('ICreditAssessmentHouseholdEconomy', [
  'maritalStatus'.pickFrom(['married', 'commonLaw', 'single']),
  'income'.asNumber(),
  'employment'.pickFrom([
    'other',
    'retired',
    'fullTimeEmployed',
    'student',
    'temporarilyEmployed',
    'selfEmployed',
  ]),
  'householdChildren'.asNumber(),
  'housingType'.pickFrom(['singleFamily', 'condominium', 'apartment']),
  'housingCost'.asNumber(),
  'debtSpecification'.fromFixture('ICreditAssessmentDebtSpecification'),
]);

factory.define('ICreditAssessmentInquiry', [
  'externalId',
  'customer'.fromFixture('ICreditAssessmentCustomer'),
  'loan'.fromFixture('ICreditAssessmentLoan'),
  'householdEconomy'.fromFixture('ICreditAssessmentHouseholdEconomy'),
]);

factory.define('ICreditAssessmentCase', ['caseId']);

factory.define('ICreditAssessmentStatusApiResponse', [
  'status'.pickFrom([
    'received',
    'signingInitiated',
    'signingFailed',
    'signed',
    'scoringInitiated',
    'scored',
    'notScored',
    'accepted',
    'declined',
    'unknown',
  ]),
  'bankIdHintCode',
  'vfScoreCaseId',
  'recommendation',
  'decision',
  'qrCode',
]);
factory.define('ICreditAssessmentSignRequest', [
  'method'.pickFrom(['SameDevice', 'QrCode']),
  'caseId',
]);

factory.define('ICreditAssessmentSignApiResponse', ['qrCodeAsBase64', 'autoLaunchUrl']);

factory.define('IPaymentResponse', ['payment', 'url']);

module.exports = factory;
