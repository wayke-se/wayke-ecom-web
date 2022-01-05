import { IAddress } from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';

import { Vehicle } from '../../App';
import ItemTileSmall from '../../Components/ItemTileSmall';
import Stage1 from './Stage1/index';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import Stage4 from './Stage4';
import Stage5 from './Stage5';
import Stage6 from './Stage6';
import Stage7 from './Stage7';

interface View2Props {
  vehicle: Vehicle;
  order?: OrderOptionsResponse;
  onNext: () => void;
}

export interface Customer {
  givenName: string;
  surname: string;
  email: string;
  phone: string;
  socialId: string;
}

export interface View2State {
  stage: number;
  maxStage: number;
  customer: Customer;
  address?: IAddress;
}

class View2 {
  private props: View2Props;
  private state: View2State;

  constructor(props: View2Props) {
    this.props = props;
    this.state = {
      stage: 1,
      maxStage: 1,
      customer: {
        givenName: '',
        surname: '',
        email: '',
        phone: '',
        socialId: '',
      },
    };

    this.render();
  }

  setStage(nextStage: number) {
    this.state = {
      ...this.state,
      stage: nextStage,
      maxStage: this.state.maxStage < nextStage ? nextStage : this.state.maxStage,
    };
    this.render();
  }

  stage1Next(customer: Customer, address?: IAddress) {
    this.state = {
      ...this.state,
      customer: { ...customer },
      address,
    };
    this.setStage(2);
  }

  render() {
    const container = document.querySelector('#wayke-ecom');
    if (container) {
      container.innerHTML = '';

      const aside = document.createElement('aside');
      aside.className = 'aside';
      aside.innerHTML = `
        <div>
          ${ItemTileSmall({ vehicle: this.props.vehicle, order: this.props.order })}
        </div>
      `;
      container.appendChild(aside);

      const node = document.createElement('div');
      node.className = 'stepper';
      container.appendChild(node);

      if (!node) return;

      new Stage1({
        node,
        canActivate: this.state.maxStage > 0,
        active: this.state.stage === 1,
        customer: this.state.customer,
        address: this.state.address,
        onThis: () => this.setStage(1),
        onNext: this.stage1Next.bind(this),
      });
      new Stage2({
        node,
        canActivate: this.state.maxStage > 1,
        active: this.state.stage === 2,
        onThis: () => this.setStage(2),
        onNext: () => this.setStage(3),
      });
      new Stage3({
        node,
        canActivate: this.state.maxStage > 2,
        active: this.state.stage === 3,
        onThis: () => this.setStage(3),
        onNext: () => this.setStage(4),
      });
      new Stage4({
        node,
        canActivate: this.state.maxStage > 3,
        active: this.state.stage === 4,
        onThis: () => this.setStage(4),
        onNext: () => this.setStage(5),
      });
      new Stage5({
        node,
        canActivate: this.state.maxStage > 4,
        active: this.state.stage === 5,
        onThis: () => this.setStage(5),
        onNext: () => this.setStage(6),
      });
      new Stage6({
        node,
        canActivate: this.state.maxStage > 5,
        active: this.state.stage === 6,
        onThis: () => this.setStage(6),
        onNext: () => this.setStage(7),
      });
      new Stage7({
        node,
        canActivate: this.state.maxStage > 6,
        active: this.state.stage === 7,
        onThis: () => this.setStage(7),
        onNext: () => this.setStage(8),
      });
    }
  }
}

export default View2;
