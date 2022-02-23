import { StageMapper } from '../@types/Stages';
import Accessories from '../Views/Main/Accessories';
import CentralStorage from '../Views/Main/CentralStorage';
import Customer from '../Views/Main/Customer';
import Delivery from '../Views/Main/Delivery';
import Financial from '../Views/Main/Financial';
import Insurance from '../Views/Main/Insurance';
import TradeIn from '../Views/Main/TradeIn';

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
