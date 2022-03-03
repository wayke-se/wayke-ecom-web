import watch from 'redux-watch';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import StageCompleted from '../../../Components/StageCompleted';
import { goTo } from '../../../Redux/action';
import store from '../../../Redux/store';
import { maskSSn, maskText } from '../../../Utils/mask';
import ListItem from '../../../Templates/ListItem';
import EmailAndPhone from './EmailAndPhone';
import FullAddress from './FullAddress';

class Customer extends HtmlNode {
  private index: number;
  private lastStage: boolean;

  constructor(element: HTMLDivElement, index: number, lastStage: boolean) {
    super(element);
    this.index = index;
    this.lastStage = lastStage;

    const w = watch(store.getState, 'navigation');
    store.subscribe(w(() => this.render()));
    const w2 = watch(store.getState, 'edit');
    store.subscribe(w2(() => this.render()));

    this.render();
  }

  onChange() {
    goTo('main', this.index);
  }

  render() {
    const state = store.getState();

    const completed = state.topNavigation.stage > this.index;
    const content = ListItem(this.node, {
      completed,
      title: 'Dina uppgifter',
      active: state.navigation.stage === this.index,
      id: 'customer',
    });
    content.innerHTML = '';

    const part1 = document.createElement('div');
    part1.className = 'waykeecom-stack waykeecom-stack--2';
    const part2 = document.createElement('div');
    part2.className = 'waykeecom-stack waykeecom-stack--2';

    if (
      state.navigation.stage > this.index ||
      (completed && state.navigation.stage !== this.index)
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
    } else if (state.navigation.stage === this.index) {
      new EmailAndPhone(content);
      if (state.navigation.subStage > 1) {
        new FullAddress(content, this.lastStage);
      }
    }
  }
}

export default Customer;
