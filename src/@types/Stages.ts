import Stage1Customer from '../Views/View2/Stage1Customer';
import Stage2CentralStorage from '../Views/View2/Stage2CentralStorage';
import Stage3Delivery from '../Views/View2/Stage3Delivery';
import Stage4TradeIn from '../Views/View2/Stage4TradeIn';
import Stage5Financial from '../Views/View2/Stage5Financial';
import Stage6Insurance from '../Views/View2/Stage6Insurance';

interface Customer {
  component: typeof Stage1Customer;
  name: 'customer';
}

interface CentralStorage {
  component: typeof Stage2CentralStorage;
  name: 'centralStorage';
}

interface Delivery {
  component: typeof Stage3Delivery;
  name: 'delivery';
}

interface TradeIn {
  component: typeof Stage4TradeIn;
  name: 'tradeIn';
}

interface Financial {
  component: typeof Stage5Financial;
  name: 'financial';
}

interface Insurance {
  component: typeof Stage6Insurance;
  name: 'insurance';
}

export type StageTypes = Customer | CentralStorage | Delivery | TradeIn | Financial | Insurance;

export interface StageMapper {
  customer: Customer;
  centralStorage: CentralStorage;
  delivery: Delivery;
  tradeIn: TradeIn;
  financial: Financial;
  insurance: Insurance;
}
