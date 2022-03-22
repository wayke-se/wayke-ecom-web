import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputRadioGroup, { RadioItem } from '../../../Components/Input/InputRadioGroup';
import StageCompleted from '../../../Components/StageCompleted';
import { getOrder } from '../../../Data/getOrder';
import { goTo, setDealer, setOrder } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import Alert from '../../../Templates/Alert';
import ListItem from '../../../Templates/ListItem';
import { convertOrderOptionsResponse } from '../../../Utils/convert';

const PROCEED = 'button-central-storage-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

const CENTRAL_STORAGE_BRANCH = 'central-storage-branch';
const CENTRAL_STORAGE_BRANCH_NODE = `${CENTRAL_STORAGE_BRANCH}-node`;

interface CentralStorageProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class CentralStorage extends HtmlNode {
  private readonly props: CentralStorageProps;
  private selectedDealer?: string;
  private requestError = false;
  private contexts: {
    proceedButton?: ButtonArrowRight;
  } = {};

  constructor(element: HTMLDivElement, props: CentralStorageProps) {
    super(element);
    this.props = props;
    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.selectedDealer = this.props.store.getState().dealer;

    this.render();
  }

  private async updateOrder(selectedDealer: string) {
    if (this.requestError) {
      this.requestError = false;
      this.render();
    }
    const { id, vehicle } = this.props.store.getState();
    try {
      this.contexts.proceedButton?.loading(true);

      const order = await getOrder(id, selectedDealer);
      setOrder(convertOrderOptionsResponse(order), vehicle);
      setDealer(selectedDealer, this.props.lastStage)(this.props.store.dispatch);

      this.contexts.proceedButton?.loading(false);
    } catch (e) {
      this.contexts.proceedButton?.loading(false);
      this.requestError = true;
      this.render();
    }
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const value = currentTarget.value;
    this.selectedDealer = value;
    this.contexts.proceedButton?.disabled(false);
  }

  private onEdit() {
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  private onProceed() {
    if (this.selectedDealer) {
      this.updateOrder(this.selectedDealer);
    }
  }

  render() {
    const { order, navigation, topNavigation } = this.props.store.getState();
    const { index } = this.props;
    const dealers = order?.dealerSites || [];

    const completed = topNavigation.stage > index;
    const active = navigation.stage === index;
    const content = ListItem(this.node, {
      completed,
      active,
      title: 'Centrallager',
      id: 'central-storage',
    });

    if (
      (navigation.stage > index || (completed && navigation.stage !== index)) &&
      this.selectedDealer
    ) {
      const dealer = dealers.find((x) => x.id === this.selectedDealer);
      new StageCompleted(content, {
        keyValueList: [
          {
            key: 'Val av anläggning',
            value: dealer?.name || '',
          },
        ],
        changeButtonTitle: 'Ändra',
        onEdit: () => this.onEdit(),
      });
    } else if (navigation.stage === index) {
      content.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <h4 class="waykeecom-heading waykeecom-heading--4">Vilken anläggning vill du köpa ifrån?</h4>
        <div class="waykeecom-content">
          <p>Detta fordon är en centrallagerbil och finns tillgängligt från flera anläggningar. Välj den anläggning du vill handla ifrån.</p>
        </div>
      </div>

      <div class="waykeecom-stack waykeecom-stack--3" id="${CENTRAL_STORAGE_BRANCH_NODE}"></div>

      ${
        this.requestError
          ? `<div class="waykeecom-stack waykeecom-stack--3">${Alert({
              tone: 'error',
              children: `<p>Ett fel uppstod och det gick inte att välja ovanstående anläggning. Försök igen.</p>`,
            })}</div>`
          : ''
      }

      <div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_NODE}"></div>
    `;

      const options: RadioItem[] = dealers.map((dealer) => {
        const address =
          !dealer.location?.address || !dealer.location?.city
            ? 'Adress saknas'
            : `${dealer.location?.address}, ${dealer.location?.city}`;

        return {
          id: `central-storage-${dealer.id}`,
          value: dealer.id,
          title: dealer.name,
          description: `
            <div class="waykeecom-box">
              <div class="waykeecom-icon-content">
                <div class="waykeecom-icon-content__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    class="waykeecom-icon"
                    data-icon="Location pin"
                  >
                    <path d="M12.2 2C11.1.9 9.6.3 8 .3S4.9.9 3.8 2C2.6 3.2 2 4.7 2 6.3 2 9 5.3 12.9 7.3 15l.7.7.7-.7c2-2.1 5.3-6 5.3-8.7 0-1.6-.6-3.1-1.8-4.3zM8 12.8C5.5 10 4 7.6 4 6.3c0-1.1.4-2.1 1.2-2.9.7-.7 1.7-1.1 2.8-1.1 1.1 0 2.1.4 2.8 1.2.8.7 1.2 1.7 1.2 2.8 0 1.3-1.5 3.7-4 6.5zm2-6.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                  </svg>
                </div>
                <div class="waykeecom-icon-content__content">
                  <div class="waykeecom-icon-content__meta">
                    ${address}
                  </div>
                </div>
              </div>
            </div>`,
        } as RadioItem;
      });

      new InputRadioGroup(
        content.querySelector<HTMLDivElement>(`#${CENTRAL_STORAGE_BRANCH_NODE}`),
        {
          checked: this.selectedDealer,
          name: 'dealer',
          options,
          onClick: (e) => this.onChange(e),
        }
      );

      this.contexts.proceedButton = new ButtonArrowRight(
        content.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`),
        {
          title: 'Gå vidare',
          id: PROCEED,
          disabled: !this.selectedDealer,
          onClick: () => this.onProceed(),
        }
      );
    }

    if (navigation.stage === index) {
      content.parentElement?.scrollIntoView();
    }
  }
}

export default CentralStorage;
