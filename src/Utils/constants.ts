import { DrivingDistance } from '@wayke-se/ecom';
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

export const translateDrivingDistance = {
  [DrivingDistance.Between0And1000]: '0–1000 mil',
  [DrivingDistance.Between1000And1500]: '1000–1500 mil',
  [DrivingDistance.Between1500And2000]: '1500–2000 mil',
  [DrivingDistance.Between2000And2500]: '2000–2500 mil',
  [DrivingDistance.Over2500]: '2500+ mil',
};
