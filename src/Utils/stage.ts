import { StageMapper } from '../@types/Stages';
import Accessories from '../Views/View2/Accessories';
import CentralStorage from '../Views/View2/CentralStorage';
import Customer from '../Views/View2/Customer';
import Delivery from '../Views/View2/Delivery';
import Financial from '../Views/View2/Financial';
import Insurance from '../Views/View2/Insurance';
import TradeIn from '../Views/View2/TradeIn';

export const stageMap: StageMapper = {
  customer: { component: Customer, name: 'customer' },
  centralStorage: { component: CentralStorage, name: 'centralStorage' },
  delivery: { component: Delivery, name: 'delivery' },
  tradeIn: { component: TradeIn, name: 'tradeIn' },
  financial: { component: Financial, name: 'financial' },
  insurance: { component: Insurance, name: 'insurance' },
  accessories: { component: Accessories, name: 'accessories' },
};

export type StageMapKeys = keyof typeof stageMap;
