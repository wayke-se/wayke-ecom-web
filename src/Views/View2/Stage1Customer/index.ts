import watch from 'redux-watch';
import store from '../../../Redux/store';
import ListItem from '../ListItem';
import Part1EmailAndPhone from './Part1EmailAndPhone';
import Part2SocialId from './Part2SocialId';
import Part3CustomerSummary from './Part3CustomerSummary';

class Stage1Customer {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;

    const w = watch(store.getState, 'navigation.subStage');
    store.subscribe(
      w(() => {
        const view = store.getState().navigation.view;
        if (view === 2) {
          this.render();
        }
      })
    );

    this.render();
  }

  render() {
    const state = store.getState();
    const { navigation } = state;

    const content = ListItem(this.element, 'Dina uppgifter', navigation.stage === 1);
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
