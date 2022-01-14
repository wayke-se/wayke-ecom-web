import store from '../../../Redux/store';
import ListItem from '../ListItem';

class Stage2CentralStorage {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const centralStorage = store.getState().centralStorage;
    if (centralStorage) {
      ListItem(this.element, 'Centrallager');
    }
  }
}

export default Stage2CentralStorage;
