import Button from '../../Components/Button/Button';
import StackNode from '../../Components/Extension/StackNode';
import { createOrder } from '../../Data/createOrder';
import { setCreatedOrderId } from '../../Redux/action';
import Alert from '../../Templates/Alert';

const CREATE_ORDER = 'create-order';
const CREATE_ORDER_NODE = `${CREATE_ORDER}-node`;

class ExecuteOrder extends StackNode {
  private contexts: { createOrderButton?: Button } = {};
  private requestError = false;

  constructor(element: HTMLElement) {
    super(element);
    this.render();
  }

  async onCreateOrder() {
    this.requestError = false;
    try {
      this.contexts.createOrderButton?.loading(true);
      const response = await createOrder();
      setCreatedOrderId(response.getId());
    } catch (e) {
      this.requestError = true;
      this.render();
    } finally {
      this.contexts.createOrderButton?.loading(false);
    }
  }

  render() {
    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3" id="${CREATE_ORDER_NODE}"></div>
      ${
        this.requestError
          ? `
            <div class="waykeecom-stack waykeecom-stack--3">
              ${Alert({
                tone: 'error',
                children: '<p>Det gick inte att skapa ordern. Försök igen.',
              })}
            </div>`
          : ''
      }
    `;

    this.contexts.createOrderButton = new Button(this.node.querySelector(`#${CREATE_ORDER_NODE}`), {
      id: CREATE_ORDER,
      title: 'Genomför order',
      onClick: () => this.onCreateOrder(),
    });
  }
}

export default ExecuteOrder;
