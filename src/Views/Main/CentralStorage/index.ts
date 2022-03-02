import watch from 'redux-watch';
import Attach from '../../../Components/Extension/Attach';
import store from '../../../Redux/store';
import ListItem from '../ListItem';

class CentralStorage extends Attach {
  constructor(element: HTMLDivElement) {
    super(element);
    const w = watch(store.getState, 'navigation');
    store.subscribe(w(() => this.render()));
    const w2 = watch(store.getState, 'edit');
    store.subscribe(w2(() => this.render()));

    this.render();
  }

  render() {
    const centralStorage = store.getState().centralStorage;
    if (centralStorage) {
      ListItem(this.element, { title: 'Centrallager', id: 'central-storage' });
    }
  }
}

export default CentralStorage;
