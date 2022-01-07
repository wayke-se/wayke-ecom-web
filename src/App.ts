import View1 from './Views/View1/index';
import View2 from './Views/View2/index';

import './styles/styles.scss';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';

export interface AppState {
  stage: number;
  order?: OrderOptionsResponse;
}

export interface Vehicle {
  id: string;
  title: string;
  shortDescription: string;
  price: number;
  imageUrls: string[];
  modelYear: number;
  milage: number;
  gearBox: string;
  fuelType: string;
}

interface AppProps {
  vehicle: Vehicle;
}

const initalState = (): AppState => ({
  stage: 1,
});

class App {
  private props: AppProps;
  private state: AppState;
  private root: HTMLElement;

  constructor(props: AppProps) {
    this.props = props;
    this.state = initalState();
    const root = document.getElementById('wayke-ecom');
    if (!root) {
      throw 'Missing node';
    }
    this.root = root;
    this.render();
  }

  updateOrder(order: OrderOptionsResponse) {
    this.state = {
      ...this.state,
      order,
    };
    this.setStage(1);
  }

  setStage(nextStage: number) {
    this.state = {
      ...this.state,
      stage: nextStage,
    };
    this.render();
  }

  render() {
    switch (this.state.stage) {
      case 1:
        new View1({
          root: this.root,
          vehicle: this.props.vehicle,
          order: this.state.order,
          onNext: () => this.setStage(2),
          updateOrder: this.updateOrder.bind(this),
        });
        break;

      case 2:
        new View2({
          root: this.root,
          vehicle: this.props.vehicle,
          order: this.state.order,
          onNext: () => this.setStage(3),
        });
        break;

      default:
        break;
    }
  }
}

export default App;
