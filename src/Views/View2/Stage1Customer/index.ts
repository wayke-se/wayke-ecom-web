import watch from 'redux-watch';
import store from '../../../Redux/store';
import ListItem from '../ListItem';
import Part1EmailAndPhone from './Part1EmailAndPhone';
import Part2SocialId from './Part2SocialId';
import Part3CustomerSummary from './Part3CustomerSummary';

const STAGE = 1;
class Stage1Customer {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;

    const w = watch(store.getState, 'navigation');
    store.subscribe(w(() => this.render()));
    const w2 = watch(store.getState, 'edit');
    store.subscribe(w2(() => this.render()));

    this.render();
  }

  render() {
    const state = store.getState();
    const { navigation, topNavigation } = state;

    const content = ListItem(this.element, {
      title: 'Dina uppgifter',
      active: navigation.stage === STAGE,
      completed: topNavigation.stage > STAGE,
      id: 'customer',
    });
    content.innerHTML = '';

    const part1 = document.createElement('div');
    part1.className = 'stack stack--2';
    const part2 = document.createElement('div');
    part2.className = 'stack stack--2';

    if (navigation.stage > 1 || (navigation.stage === 1 && navigation.subStage > 2)) {
      new Part3CustomerSummary(part1);
      content.appendChild(part1);
    } else if (navigation.stage === 1) {
      new Part1EmailAndPhone(part1);
      content.appendChild(part1);
      if (navigation.subStage > 1) {
        new Part2SocialId(part2);
        content.appendChild(part2);
      }
    }
  }
}

export default Stage1Customer;
