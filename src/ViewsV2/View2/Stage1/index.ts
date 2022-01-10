import watch from 'redux-watch';
import store from '../../../Redux/store';
import ListItem from '../ListItem';
import Part1 from './Part1';
import Part2 from './Part2';
import Part3 from './Part3';

class Stage1 {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;

    const w = watch(store.getState, 'subStage');
    store.subscribe(
      w(() => {
        this.render();
      })
    );

    this.render();
  }

  render() {
    const state = store.getState();
    const { stage, subStage } = state;

    const content = ListItem(this.element, 'Dina uppgifter', state.stage === 1);
    content.innerHTML = '';

    const part1 = document.createElement('div');
    const part2 = document.createElement('div');

    if (stage > 1 || (stage === 1 && subStage > 2)) {
      new Part3(part1);
      content.appendChild(part1);
    } else if (stage === 1) {
      new Part1(part1);
      content.appendChild(part1);
      if (subStage > 1) {
        new Part2(part2);
        content.appendChild(part2);
      }
    }
  }
}

export default Stage1;
