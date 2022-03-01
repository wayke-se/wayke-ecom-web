import { VehicleCondition } from '../@types/TradeIn';

export const Image = {
  bankid: 'https://cdn.wayke.se/public-assets/bankid-logo.svg',
  carfax: {
    cl70x13: 'https://cdn.wayke.se/public-assets/carfax-logo-70x13.png',
    cl70x13_2x: 'https://cdn.wayke.se/public-assets/carfax-logo-70x13@2x.png',
    cl43x8: 'https://cdn.wayke.se/public-assets/carfax-logo-43x8.png',
    cl43x8_2x: 'https://cdn.wayke.se/public-assets/carfax-logo-43x8@2x.png',
  },
  illustrations: {
    payment: 'https://cdn.wayke.se/public-assets/payment.svg',
  },
};

export const translateTradeInCondition = {
  [VehicleCondition.VeryGood]: 'Mycket bra',
  [VehicleCondition.Good]: 'Bra',
  [VehicleCondition.Ok]: 'Ok',
};
