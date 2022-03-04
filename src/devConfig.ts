const baseVehicle = {
  title: 'Audi TT',
  shortDescription: 'S-Tronic Milltek 360hk 2500:-i månad',
  price: 369000,
  imageUrls: [
    'https://test-cdn.wayketech.se/media/987da0e9-2636-4c51-b003-1074279ec465/c76e8aff-97b3-486f-ab27-74693a3542ea/1170x',
    'https://test-cdn.wayketech.se/media/529887d4-20b2-44b4-ab0b-e7ab5c06c7c4/db216441-b3c7-42a2-9d85-8ddc0784b251/1170x',
    'https://test-cdn.wayketech.se/media/f72a6da1-a85f-470b-937d-022a7a0ed024/96f98fa5-30cf-4592-a105-e9c68d56f339/1170x',
    'https://test-cdn.wayketech.se/media/352b7f94-ec9c-4108-b021-62da7e3a03c3/2b668f55-84a2-4692-8865-4e1e0409a9e2/1170x',
  ],
  modelYear: 2013,
  milage: 4900,
  gearBox: 'Automat',
  fuelType: 'Bensin',
};

export const devConfig = {
  BANKID_TRADE_IN_HOME_DELIVERY: {
    id: 'f98cde44-ea7f-49af-a60b-4dcd7ad6d862',
    useBankid: true,
  },
  DEFAULT: {
    id: 'f71d0afb-02aa-4f79-a9bc-9632a7454ca6',
  },
  MULTIPLE_FINANCIAL: {
    id: 'b3cef88c-6b75-4bf6-8429-6af83dd52feb',
    useBankid: true,
  },
  INSURANCE: {
    id: 'c2a75c3c-58d7-4e46-adf4-07b61be0384d',
    vehicle: {
      ...baseVehicle,
    },
  },
  CREDIT_ASSESSMENT: {
    id: '66c573e4-ac81-4d68-b268-6d4f82b6bede',
  },
  LEASING: {
    id: '467a0c26-6540-417a-9904-f75b2beda9d5',
  },
};
