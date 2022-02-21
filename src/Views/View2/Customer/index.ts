import watch from 'redux-watch';
import store from '../../../Redux/store';
import ListItem from '../ListItem';
import Part1EmailAndPhone from './Part1EmailAndPhone';
import Part2SocialId from './Part2SocialId';
import Part3CustomerSummary from './Part3CustomerSummary';

class Customer {
  private element: HTMLDivElement;
  private index: number;
  private lastStage: boolean;

  constructor(element: HTMLDivElement, index: number, lastStage: boolean) {
    this.element = element;
    this.index = index;
    this.lastStage = lastStage;

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
      active: navigation.stage === this.index,
      completed: topNavigation.stage > this.index,
      id: 'customer',
    });
    content.innerHTML = '';

    const part1 = document.createElement('div');
    part1.className = 'waykeecom-stack waykeecom-stack--2';
    const part2 = document.createElement('div');
    part2.className = 'waykeecom-stack waykeecom-stack--2';

    if (navigation.stage > this.index) {
      new Part3CustomerSummary(part1, this.index);
      content.appendChild(part1);
    } else if (navigation.stage === this.index) {
      new Part1EmailAndPhone(part1);
      content.appendChild(part1);
      if (navigation.subStage > 1) {
        new Part2SocialId(part2, this.lastStage);
        content.appendChild(part2);
      }
    }
  }
}

export default Customer;
