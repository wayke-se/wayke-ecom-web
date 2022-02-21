import CustomerStage from '../Views/View2/Customer';
import CentralStorageStage from '../Views/View2/CentralStorage';
import DeliveryStage from '../Views/View2/Delivery';
import TradeInStage from '../Views/View2/TradeIn';
import FinancialStage from '../Views/View2/Financial';
import InsuranceStage from '../Views/View2/Insurance';

interface Customer {
  component: typeof CustomerStage;
  name: 'customer';
}

interface CentralStorage {
  component: typeof CentralStorageStage;
  name: 'centralStorage';
}

interface Delivery {
  component: typeof DeliveryStage;
  name: 'delivery';
}

interface TradeIn {
  component: typeof TradeInStage;
  name: 'tradeIn';
}

interface Financial {
  component: typeof FinancialStage;
  name: 'financial';
}

interface Insurance {
  component: typeof InsuranceStage;
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
