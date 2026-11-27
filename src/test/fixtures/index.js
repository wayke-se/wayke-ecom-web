import {
  asArray,
  asBoolean,
  asConstant,
  asListOfFixtures,
  asNumber,
  fromFixture,
  pickFrom,
  create,
  define,
} from './factory.js';

define('IApiConfiguration', ['address']);

define('IOriginConfiguration', ['topic', 'channel']);

define('IConfiguration', [
  fromFixture('api', 'IApiConfiguration'),
  fromFixture('origin', 'IOriginConfiguration'),
  'bankIdThumbprint',
]);

define('IApiResponse', [asBoolean('successful'), 'response', 'requestForgeryToken']);

define('IApiErrorResponse', [asConstant('successful', false), asNumber('errorCode'), 'message']);

define('IDistance', [asNumber('value'), pickFrom('unit', ['m', 'km'])]);

const IAddress = [
  'city',
  'name',
  'postalCode',
  'street',
  'street2',
  fromFixture('distance', 'IDistance'),
];
define('IAddress', IAddress);

define('ICustomer', [
  'name',
  'personalNumber',
  'email',
  'phoneNumber',
  fromFixture('address', 'IAddress'),
]);

define('IOrderUrls', ['redirect', 'payment']);

define('IAddressLookupRequest', ['personalNumber']);
define('IAddressLookupResponse', [].concat(IAddress));

define('IInsuranceOptionsResponse.IInsuranceOption', [
  'name',
  asNumber('price'),
  'unit',
  asBoolean('includesFinancingInPrice'),
  asListOfFixtures('addons', 'IInsuranceOptionsResponse.AddOn', 3),
  'description',
  'branding',
  asListOfFixtures('insuranceItems', 'IInsuranceOptionsResponse.Item', 3),
  'legalUrl',
  'legalDescription',
]);

define('IInsuranceOptionsResponse.AddOn', [
  'title',
  'name',
  'description',
  asNumber('monthlyPrice'),
  asArray('exclude', 1),
]);

define('IInsuranceOptionsResponse.Item', ['name', 'description']);

define('IInsuranceOptionsRequest', [
  'id',
  'personalNumber',
  pickFrom('drivingDistance', [
    'Between0And1000',
    'Between1000And1500',
    'Between1500And2000',
    'Between2000And2500',
    'Over2500',
  ]),
]);

define('IInsuranceOptionsResponse', [
  asListOfFixtures('insurances', 'IInsuranceOptionsResponse.IInsuranceOption', 2),
]);

define('IContactInformation', ['address', 'city', 'email', 'homePage', 'name', 'phone', 'zip']);
define('IOrderDelivery', [
  pickFrom('type', ['Pickup', 'Delivery']),
  'deliveryTime',
  asNumber('startupCost'),
  asNumber('unitPrice'),
  pickFrom('unit', ['km']),
  asNumber('minQuantity'),
  asNumber('maxQuantity'),
]);
define('IOrderInsurance', ['description', 'logo', 'title', 'url', 'ecomInsuranceText']);

define('IOrderPayment', [
  fromFixture('loanDetails', 'IPaymentLookupResponse'),
  'logo',
  'name',
  asNumber('price'),
  pickFrom('type', ['Cash', 'Lease', 'Loan']),
  'unit',
  'externalId',
]);

define('IVehicleTrade', [
  'registrationNumber',
  asNumber('mileage'),
  pickFrom('condition', ['VeryGood', 'Good', 'Ok']),
  'comments',
]);
define('IOrderInsuranceRequest', [
  'personalNumber',
  pickFrom('drivingDistance', [
    'Between0And1000',
    'Between1000And1500',
    'Between1500And2000',
    'Between2000And2500',
    'Over2500',
  ]),
  asArray('addons', 2),
]);
define('IOrderCreditAssessment', ['scoreId', 'financialProductCode', 'recommendation', 'decision']);
define('IOrderPaymentRequest', [
  pickFrom('type', ['Cash', 'Lease', 'Loan']),
  asNumber('months'),
  asNumber('downPayment'),
  asNumber('residualValue'),
  'externalId',
  fromFixture('creditAssessment', 'IOrderCreditAssessment'),
]);
define('IOrderCreateRequest', [
  'id',
  fromFixture('tradein', 'IVehicleTrade'),
  fromFixture('insurance', 'IOrderInsuranceRequest'),
  fromFixture('payment', 'IOrderPaymentRequest'),
  pickFrom('deliveryType', 'Pickup', 'Delivery'),
  fromFixture('customer', 'ICustomer'),
  fromFixture('urls', 'IOrderUrls'),
]);
define('IOrderCreateResponse', ['id', fromFixture('payment', 'IPaymentResponse')]);

define('IOrderOptionsRequest', ['id', 'branchId']);
define('IOrderOptionsResponse', [
  'vehicle',
  asListOfFixtures('accessories', 'IAccessory', 2),
  asListOfFixtures('dealers', 'IDealerOption', 2),
  'conditions',
  'returnConditions',
  'conditionsPdfUri',
  fromFixture('contactInformation', 'IContactInformation'),
  asListOfFixtures('delivery', 'IOrderDelivery', 2),
  fromFixture('insurance', 'IOrderInsurance'),
  asListOfFixtures('payment', 'IOrderPayment', 2),
  asBoolean('tradeIn'),
  asBoolean('unavailable'),
  asBoolean('reserved'),
  asBoolean('paymentRequired'),
]);

define('IAccessory', [
  'id',
  'articleNumber',
  'logoUrl',
  'longDescription',
  'shortDescription',
  'manufacturer',
  'model',
  'name',
  asNumber('price'),
  asNumber('assemblyPrice'),
  asNumber('salePrice'),
  'productPageLink',
  'productPageLinkText',
  asListOfFixtures('media', 'IAccessoryMedia', 2),
]);

define('IAccessoryMedia', ['externalId', asNumber('sortOrder'), 'url']);

define('IDealerOption', ['id', 'name', fromFixture('location', 'ILocation')]);

define('ILocation', ['address', 'city', asNumber('latitude'), asNumber('longitude')]);

define('IPaymentCosts', [asNumber('monthlyCost'), asNumber('totalCreditCost')]);
define('IPaymentFees', [asNumber('setupFee'), asNumber('administrationFee')]);
define('IPaymentInterests', [asNumber('interest'), asNumber('effectiveInterest')]);
define('IPaymentRangeSpec', [
  asNumber('min'),
  asNumber('max'),
  asNumber('step'),
  asNumber('default'),
  asNumber('current'),
]);
define('IPaymentLookupRequest', [
  'id',
  'branchId',
  asNumber('duration'),
  asNumber('downPayment'),
  'financialOptionId',
]);
define('IPaymentLookupResponse', [
  asNumber('monthlyCost'),
  asNumber('interest'),
  asNumber('effectiveInterest'),
  asNumber('setupFee'),
  asNumber('administrationFee'),
  asNumber('totalCreditCost'),
  fromFixture('residual', 'IPaymentRangeSpec'),
  fromFixture('duration', 'IPaymentRangeSpec'),
  fromFixture('downPayment', 'IPaymentRangeSpec'),
  asNumber('totalResidualValue'),
  'link',
  asNumber('vehiclePrice'),
  asNumber('loanAmount'),
  asBoolean('useCreditScoring'),
  'financialProductCode',
  'privacyPolicyUrl',
  'moneyLaunderingInformationUrl',
  'financialOptionId',
]);

define('IVehicleLookupRequest', [
  'registrationNumber',
  asNumber('mileage'),
  pickFrom('condition', ['Ok', 'Good', 'VeryGood']),
]);
define('IVehicleLookupResponse', [
  'manufacturer',
  'modelName',
  'modelSeries',
  asNumber('modelYear'),
  asNumber('valuation'),
]);

define('IBankIdAuthRequest', [pickFrom('method', ['SameDevice', 'QrCode'])]);

define('IBankIdAuthApiResponse', [
  'orderRef',
  pickFrom('method', ['SameDevice', 'QrCode']),
  'qrCodeAsBase64',
  'autoLaunchUrl',
]);

define('IBankIdCollectRequest', ['orderRef']);

define('IBankIdCollectApiResponse', [
  'orderRef',
  pickFrom('status', ['pending', 'failed', 'complete']),
  pickFrom('hintCode', [
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
  fromFixture('completionData', 'IBankIdCompletionData'),
]);
define('IBankIdCompletionData', [
  'signature',
  'ocspResponse',
  'personalNumber',
  fromFixture('address', 'IAddress'),
]);

define('IBankIdCancelRequest', ['orderRef']);

define('IBankIdQrCodeRequest', ['orderRef']);

define('IBankIdQrCodeApiResponse', ['orderRef', 'qrCodeAsBase64']);

define('ICreditAssessmentCustomer', ['socialId', 'email', 'phone', 'signerIp']);

define('ICreditAssessmentLoan', [
  'financialProductId',
  asNumber('price'),
  asNumber('downPayment'),
  asNumber('credit'),
  asNumber('interestRate'),
  asNumber('monthlyCost'),
  'term',
]);

define('ICreditAssessmentDebtSpecification', [
  asNumber('privateLoan'),
  asNumber('vehicleLoan'),
  asNumber('leasingFees'),
  asNumber('cardCredits'),
  asNumber('collateral'),
]);

define('ICreditAssessmentHouseholdEconomy', [
  pickFrom('maritalStatus', ['married', 'commonLaw', 'single']),
  asNumber('income'),
  pickFrom('employment', [
    'other',
    'retired',
    'fullTimeEmployed',
    'student',
    'temporarilyEmployed',
    'selfEmployed',
  ]),
  asNumber('householdChildren'),
  pickFrom('housingType', ['singleFamily', 'condominium', 'apartment']),
  asNumber('housingCost'),
  fromFixture('debtSpecification', 'ICreditAssessmentDebtSpecification'),
]);

define('ICreditAssessmentInquiry', [
  'externalId',
  fromFixture('customer', 'ICreditAssessmentCustomer'),
  fromFixture('loan', 'ICreditAssessmentLoan'),
  fromFixture('householdEconomy', 'ICreditAssessmentHouseholdEconomy'),
]);

define('ICreditAssessmentCase', ['caseId']);

define('ICreditAssessmentStatusApiResponse', [
  pickFrom('status', [
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
define('ICreditAssessmentSignRequest', [pickFrom('method', ['SameDevice', 'QrCode']), 'caseId']);

define('ICreditAssessmentSignApiResponse', ['qrCodeAsBase64', 'autoLaunchUrl']);

define('IPaymentResponse', ['payment', 'url']);

export { create };
