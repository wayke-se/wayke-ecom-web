import Button from '../../Components/Button/Button';
import StackNode from '../../Components/Extension/StackNode';
import { createOrder } from '../../Data/createOrder';
import { creditAssessmentAccept } from '../../Data/creditAssessmentAccept';
import { setCreatedOrderId } from '../../Redux/action';
import { WaykeStore } from '../../Redux/store';
import Alert from '../../Templates/Alert';
import { scrollTop } from '../../Utils/scroll';

const CREATE_ORDER = 'create-order';
const CREATE_ORDER_NODE = `${CREATE_ORDER}-node`;

const CLOSE_ORDER = 'close-order';
const CLOSE_ORDER_NODE = `${CLOSE_ORDER}-node`;

interface ExecuteOrderProps {
  readonly store: WaykeStore;
  readonly createdOrderId?: string;
  onClose: () => void;
}

class ExecuteOrder extends StackNode {
  private readonly props: ExecuteOrderProps;
  private contexts: { createOrderButton?: Button } = {};
  private requestError = false;

  constructor(element: HTMLElement, props: ExecuteOrderProps) {
    super(element);
    this.props = props;
    this.render();
  }

  async onCreateOrder() {
    const { store } = this.props;
    this.requestError = false;
    try {
      this.contexts.createOrderButton?.loading(true);
      const response = await createOrder(store);
      setCreatedOrderId(response.getId())(store.dispatch);
      const state = store.getState();
      const caseId = state.caseId;
      if (caseId) {
        creditAssessmentAccept(caseId);
      }
      scrollTop();
    } catch (e) {
      this.requestError = true;
      this.render();
    } finally {
      this.contexts.createOrderButton?.loading(false);
    }
  }

  render() {
    const { createdOrderId, onClose } = this.props;
    if (createdOrderId) {
      this.node.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3" id="${CLOSE_ORDER_NODE}"></div>
      `;
      this.contexts.createOrderButton = new Button(
        this.node.querySelector(`#${CLOSE_ORDER_NODE}`),
        {
          id: CLOSE_ORDER,
          title: 'Stäng',
          onClick: () => onClose(),
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
