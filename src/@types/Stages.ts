import AccessoriesStage from '../Views/Main/Accessories';
import CentralStorageStage from '../Views/Main/CentralStorage';
import CustomerStage from '../Views/Main/Customer';
import DeliveryStage from '../Views/Main/Delivery';
import FinancialStage from '../Views/Main/Financial';
import InsuranceStage from '../Views/Main/Insurance';
import TradeInStage from '../Views/Main/TradeIn';

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

interface Accessories {
  component: typeof AccessoriesStage;
  name: 'accessories';
}

export type StageTypes =
  | Customer
  | CentralStorage
  | Delivery
  | TradeIn
  | Financial
  | Insurance
  | Accessories;

export interface StageMapper {
  customer: Customer;
  centralStorage: CentralStorage;
  delivery: Delivery;
  tradeIn: TradeIn;
  financial: Financial;
  insurance: Insurance;
  accessories: Accessories;
}
