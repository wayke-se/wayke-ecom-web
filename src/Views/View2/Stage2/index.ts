import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import Li from '../Li';

interface Stage2Props {
  node: HTMLElement;
  active?: boolean;
  canActivate?: boolean;
  homeDelivery: boolean;
  order?: OrderOptionsResponse;
  onThis: () => void;
  onNext: () => void;
}

const ID = 'wayke-view-2-stage-2';

class Stage2 {
  private readonly props: Stage2Props;
  private homeDelivery: boolean;

  constructor(props: Stage2Props) {
    this.props = props;
    this.homeDelivery = this.props.homeDelivery;
    this.render();
  }

  render() {
    const {
      li: _li,
      activate,
      content,
      proceed,
    } = Li({
      node: this.props.node,
      id: ID,
      title: 'Leverans',
      active: this.props.active,
    });

    const contactInformation = this.props.order?.getContactInformation();

    content.innerHTML = `
      <div class="stack stack--3">
        <h4 class="heading heading--4">Hur vill du ha din bil levererad?</h4>
        <div class="content">
          <p>Välj ifall du vill ha bilen levererad hem till dig eller ifall du vill hämta 
          den hos ${contactInformation?.name}.</p>
        </div>
      </div>
      <div>
        <input type="radio" id="radio-homeDelivery-true" name="homeDelivery" value="true">
        <label for="radio-homeDelivery-true">Hämta hos handlaren</label>
      </div>
      <div>
        <input type="radio" id="radio-homeDelivery-false" name="homeDelivery" value="false">
        <label for="radio-homeDelivery-false">Hemleverans</label>
      </div>
    `;

    if (this.props.canActivate) {
      activate.addEventListener('click', () => this.props.onThis());
    } else {
      activate.setAttribute('disabled', '');
    }

    proceed.addEventListener('click', () => this.props.onNext());
  }
}

export default Stage2;
