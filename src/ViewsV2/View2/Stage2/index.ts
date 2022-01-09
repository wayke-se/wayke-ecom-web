import store from '../../../Redux/store';
import ListItem from '../ListItem';

class Stage2 {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const state = store.getState();
    const _content = ListItem(this.element, 'Leverans', state.stage === 2);
  }
}

export default Stage2;
