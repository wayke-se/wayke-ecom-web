import store from '../../../Redux/store';
import ListItem from '../ListItem';

class Stage3 {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const state = store.getState();
    const _content = ListItem(this.element, 'Inbytesbil', state.stage === 3);
  }
}

export default Stage3;
