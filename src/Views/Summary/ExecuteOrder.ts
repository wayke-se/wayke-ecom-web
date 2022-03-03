import HtmlNode from '../../Components/Extension/HtmlNode';
import { createOrder } from '../../Data/createOrder';
import Alert from '../../Templates/Alert';
import StackItem from '../Main/TradeIn/StackItem';

const CREATE_ORDER = 'create-order';
const CREATE_ORDER_REQUEST_ERROR = `${CREATE_ORDER}-request-error`;
const CREATE_ORDER_REQUEST_ERROR_CONTAINER = `${CREATE_ORDER_REQUEST_ERROR}-container`;

class ExecuteOrder extends HtmlNode {
  constructor(element: HTMLElement) {
    super(element);
    this.render();
  }

  async onCreateOrder() {
    const button = this.node.querySelector<HTMLButtonElement>(`#${CREATE_ORDER}`);
    const errorContainer = document.querySelector<HTMLDivElement>(
      `#${CREATE_ORDER_REQUEST_ERROR_CONTAINER}`
    );
    const errorAlert = document.querySelector<HTMLDivElement>(`#${CREATE_ORDER_REQUEST_ERROR}`);

    if (!button || !errorContainer || !errorAlert) return;
    errorAlert.innerHTML = '';
    errorContainer.style.display = 'none';

    try {
      button.setAttribute('disabled', '');
      const _response = await createOrder();
      button.removeAttribute('disabled');
    } catch (e) {
      errorAlert.innerHTML = Alert({
        tone: 'error',
        children: '<p>Det gick inte att skapa ordern. Försök igen.',
      });
      errorContainer.style.display = '';
    }
  }

  render() {
    const content = StackItem(this.node);

    content.innerHTML = `
      <button
        id="${CREATE_ORDER}"
        type="button"
        title="Genomför order"
        class="waykeecom-button waykeecom-button--full-width waykeecom-button--action"
      >
        Genomför order
      </button>
      <div id="${CREATE_ORDER_REQUEST_ERROR_CONTAINER}" class="waykeecom-stack waykeecom-stack--3" style="display:none;">
        <div id="${CREATE_ORDER_REQUEST_ERROR}"></div>
      </div>
    `;

    content
      .querySelector<HTMLButtonElement>(`#${CREATE_ORDER}`)
      ?.addEventListener('click', () => this.onCreateOrder());
  }
}

export default ExecuteOrder;
