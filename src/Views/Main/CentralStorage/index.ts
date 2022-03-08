import HtmlNode from '../../../Components/Extension/HtmlNode';
import store from '../../../Redux/store';
import watch from '../../../Redux/watch';
import ListItem from '../../../Templates/ListItem';

class CentralStorage extends HtmlNode {
  constructor(element: HTMLDivElement) {
    super(element);

    watch('navigation', () => {
      this.render();
    });

    this.render();
  }

  render() {
    const centralStorage = store.getState().centralStorage;
    if (centralStorage) {
      ListItem(this.node, { title: 'Centrallager', id: 'central-storage' });
    }
  }
}

export default CentralStorage;
