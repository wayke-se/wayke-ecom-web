import store from '../../../Redux/store';
import ListItem from '../ListItem';
import Part1 from './Part1';

class Stage1 {
  private element: HTMLDivElement;
  private localStage: number = 1;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const state = store.getState();
    const content = ListItem(this.element, 'Dina uppgifter', state.stage === 1);
    const part1 = document.createElement('div');
    const part2 = document.createElement('div');
    const part3 = document.createElement('div');

    new Part1(part1);

    content.appendChild(part1);
    if (this.localStage > 1) {
      content.appendChild(part2);
    }
    content.appendChild(part3);
  }
}

export default Stage1;
