import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import StageCompleted from '../../../Components/StageCompleted';

import { goTo, completeStage } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import ListItem from '../../../Templates/ListItem';
import AccessoryList from './AccessoryList';

const PROCEED = 'button-accessories-proceed';
const PROCEED_NODE = `${PROCEED}-node`;
const ACCESSORY_GRID_LIST_NODE = 'accessory-grid-list-node';

interface AccessoriesProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class Accessories extends HtmlNode {
  private readonly props: AccessoriesProps;

  constructor(element: HTMLDivElement, props: AccessoriesProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.render();
  }

  private onProceed() {
    completeStage(this.props.lastStage)(this.props.store.dispatch);
  }

  private onEdit() {
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  render() {
    const { store, index } = this.props;
    const state = store.getState();

    const completed = state.topNavigation.stage > index;
    const content = ListItem(this.node, {
      completed,
      title: 'Tillbehör',
      active: state.navigation.stage === index,
      id: 'accessories',
    });

    const part = document.createElement('div');

    if (state.navigation.stage > index || (completed && state.navigation.stage !== index)) {
      new StageCompleted(content, {
        keyValueList: [
          {
            key: 'Tillbehör',
            value: state.accessories.length
              ? state.accessories.map((accessory) => accessory.name).join(', ')
              : 'Inga',
          },
        ],
        changeButtonTitle: 'Ändra tillbehör',
        onEdit: () => this.onEdit(),
      });
    } else if (state.navigation.stage === index) {
      const accessories = state.order?.getAccessories() || [];

      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--2">
            <h4 class="waykeecom-heading waykeecom-heading--4">Vill du köpa till ett tillbehör till din nya bil?</h4>
            <div class="waykeecom-content">
              <p>Här visar vi några av de tillbehör som passar din nya bil.</p>
            </div>
          </div>
        </div>

        <div class="waykeecom-stack waykeecom-stack--3" id="${ACCESSORY_GRID_LIST_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_NODE}"></div>
      `;

      new AccessoryList(part.querySelector<HTMLDivElement>(`#${ACCESSORY_GRID_LIST_NODE}`), {
        store,
        accessories,
      });

      new ButtonArrowRight(part.querySelector(`#${PROCEED_NODE}`), {
        id: PROCEED,
        title: 'Fortsätt',
        onClick: () => this.onProceed(),
      });
    }

    content.appendChild(part);
    if (state.navigation.stage === index) {
      content.parentElement?.scrollIntoView();
    }
  }
}

export default Accessories;
