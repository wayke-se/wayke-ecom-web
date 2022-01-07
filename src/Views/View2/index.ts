import { IAddress } from '@wayke-se/ecom';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';

import { Vehicle } from '../../App';
import ItemTileSmall from '../../Components/ItemTileSmall';
import Stage1 from './Stage1/index';
import Stage2 from './Stage2/index';
import Stage3 from './Stage3';
import Stage4 from './Stage4';
import Stage5 from './Stage5';
import Stage6 from './Stage6';
import Stage7 from './Stage7';

interface View2Props {
  root: HTMLElement;
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
  homeDelivery: boolean;
  address?: IAddress;
}

class View2 {
  private readonly props: View2Props;
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
      homeDelivery: false,
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

  stage2Next(homeDelivery: boolean) {
    this.state = {
      ...this.state,
      homeDelivery,
    };
    this.setStage(3);
  }

  render() {
    this.props.root.innerHTML = '';

    const aside = document.createElement('aside');
    aside.className = 'aside';
    aside.innerHTML = `
        ${ItemTileSmall({ vehicle: this.props.vehicle, order: this.props.order })}
      `;
    this.props.root.appendChild(aside);

    const node = document.createElement('div');
    node.className = 'stepper';
    this.props.root.appendChild(node);

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
      order: this.props.order,
      homeDelivery: this.state.homeDelivery,
      onThis: () => this.setStage(2),
      onNext: () => this.stage2Next.bind(this),
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

export default View2;
