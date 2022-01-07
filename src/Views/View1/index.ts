import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Vehicle } from '../../App';
import { getOrder } from '../../Data/getOrder';
import HowTo from './HowTo';
import ItemTileLarge from '../../Components/ItemTileLarge';

interface View1Props {
  vehicle: Vehicle;
  order?: OrderOptionsResponse;
  onNext: () => void;
  updateOrder: (order: OrderOptionsResponse) => void;
}

const PROCEED_BUTTON = 'wayke-view-1-proceed';

class View1 {
  private props: View1Props;

  constructor(props: View1Props) {
    this.props = props;
    this.render();
    this.init();
  }

  async init() {
    if (this.props.order) {
      this.render();
      return;
    }
    const container = document.getElementById('wayke-ecom');
    if (container) {
      const button = document.querySelector<HTMLButtonElement>(`#${PROCEED_BUTTON}`);
      const loader = document.querySelector<HTMLDivElement>(`#${PROCEED_BUTTON}-loader`);

      if (button && loader) {
        try {
          button.setAttribute('disabled', '');
          loader.style.display = '';
          const order = await getOrder(this.props.vehicle.id);
          this.props.updateOrder(order);
          button.removeAttribute('disabled');
        } catch (e) {
          throw e;
        } finally {
          loader.style.display = 'none';
        }
      }
    }
  }

  render() {
    const container = document.getElementById('wayke-ecom');
    if (container) {
      container.innerHTML = `
        <div class="page">
          <div class="page__body">
            <div class="stack stack--3">
              <h3 class="heading heading--3 no-margin">Vad roligt att du vill köpa denna bil!</h3>
            </div>
            <div class="stack stack--3" id="${PROCEED_BUTTON}-loader" style="display:none">
              <div>Laddar...</div>
            </div>
            ${ItemTileLarge({ vehicle: this.props.vehicle, order: this.props.order })}
            ${HowTo({ order: this.props.order })}
            <div class="stack stack--3">
              <button type="button" id="${PROCEED_BUTTON}" title="Gå vidare" class="button button--full-width button--action">
                <span class="button__content">Gå vidare</span>
                <span class="button__content">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    class="icon"
                  >
                    <title>Ikon: pil höger</title>
                    <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <footer class="page__footer">
            FOOTER...
          </footer>
        </div>
      `;
      container
        .querySelector(`#${PROCEED_BUTTON}`)
        ?.addEventListener('click', () => this.props.onNext());
    }
  }
}

export default View1;
