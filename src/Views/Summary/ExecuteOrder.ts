import Button from '../../Components/Button/Button';
import StackNode from '../../Components/Extension/StackNode';
import { createOrder } from '../../Data/createOrder';
import { creditAssessmentAccept } from '../../Data/creditAssessmentAccept';
import { setCreatedOrderId } from '../../Redux/action';
import { WaykeStore } from '../../Redux/store';
import Alert from '../../Templates/Alert';

const CREATE_ORDER = 'create-order';
const CREATE_ORDER_NODE = `${CREATE_ORDER}-node`;

const CLOSE_ORDER = 'close-order';
const CLOSE_ORDER_NODE = `${CLOSE_ORDER}-node`;

interface ExecuteOrderProps {
  store: WaykeStore;
  createdOrderId?: string;
  onClose: () => void;
}

class ExecuteOrder extends StackNode {
  private props: ExecuteOrderProps;
  private contexts: { createOrderButton?: Button } = {};
  private requestError = false;

  constructor(element: HTMLElement, props: ExecuteOrderProps) {
    super(element);
    this.props = props;
    this.render();
  }

  async onCreateOrder() {
    this.requestError = false;
    try {
      this.contexts.createOrderButton?.loading(true);
      const response = await createOrder(this.props.store);
      setCreatedOrderId(response.getId())(this.props.store.dispatch);
      const state = this.props.store.getState();
      const caseId = state.caseId;
      if (caseId) {
        creditAssessmentAccept(caseId);
      }
    } catch (e) {
      this.requestError = true;

      this.render();
    } finally {
      this.contexts.createOrderButton?.loading(false);

      setCreatedOrderId('asdasd')(this.props.store.dispatch);
    }
  }

  render() {
    if (this.props.createdOrderId) {
      this.node.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3" id="${CLOSE_ORDER_NODE}"></div>
      `;
      this.contexts.createOrderButton = new Button(
        this.node.querySelector(`#${CLOSE_ORDER_NODE}`),
        {
          id: CLOSE_ORDER,
          title: 'Stäng',
          onClick: () => this.props.onClose(),
        }
      );
    } else {
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

      this.contexts.createOrderButton = new Button(
        this.node.querySelector(`#${CREATE_ORDER_NODE}`),
        {
          id: CREATE_ORDER,
          title: 'Genomför order',
          onClick: () => this.onCreateOrder(),
        }
      );
    }
  }
}

export default ExecuteOrder;
