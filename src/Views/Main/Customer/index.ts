import HtmlNode from '../../../Components/Extension/HtmlNode';
import StageCompleted from '../../../Components/StageCompleted';
import { goTo } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import { maskSSn, maskText } from '../../../Utils/mask';
import ListItem from '../../../Templates/ListItem';
import EmailAndPhone from './EmailAndPhone';
import FullAddress from './FullAddress';
import watch from '../../../Redux/watch';

interface CustomerProps {
  store: WaykeStore;
  index: number;
  lastStage: boolean;
}

class Customer extends HtmlNode {
  private props: CustomerProps;

  constructor(element: HTMLDivElement, props: CustomerProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.render();
  }

  onChange() {
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  render() {
    const state = this.props.store.getState();

    const completed = state.topNavigation.stage > this.props.index;
    const content = ListItem(this.node, {
      completed,
      title: 'Dina uppgifter',
      active: state.navigation.stage === this.props.index,
      id: 'customer',
    });
    content.innerHTML = '';

    const part1 = document.createElement('div');
    part1.className = 'waykeecom-stack waykeecom-stack--2';
    const part2 = document.createElement('div');
    part2.className = 'waykeecom-stack waykeecom-stack--2';

    if (
      state.navigation.stage > this.props.index ||
      (completed && state.navigation.stage !== this.props.index)
    ) {
      const keyValueList: { key: string; value: string }[] = [
        { key: 'E-post', value: state.customer.email },
        { key: 'Telefonnummer', value: state.customer.phone },
        { key: 'Personnummer', value: maskSSn(state.customer.socialId) },
        ...(state.address
          ? [
              {
                key: 'Namn',
                value: `${maskText(state.address.givenName)} ${maskText(state.address.surname)}`,
              },
              { key: 'Adress', value: state.address.street },
              { key: 'Postnummer', value: state.address.postalCode },
              { key: 'Stad', value: state.address.city },
            ]
          : []),
      ];
      new StageCompleted(content, {
        keyValueList,
        changeButtonTitle: 'Ändra dina uppgifter',
        onEdit: () => this.onChange(),
      });
    } else if (state.navigation.stage === this.props.index) {
      new EmailAndPhone(content, { store: this.props.store });
      if (state.navigation.subStage > 1) {
        new FullAddress(content, { store: this.props.store, lastStage: this.props.lastStage });
      }
    }
    if (state.navigation.stage === this.props.index) {
      content.parentElement?.scrollIntoView();
    }
  }
}

export default Customer;
