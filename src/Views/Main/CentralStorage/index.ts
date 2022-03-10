import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import ListItem from '../../../Templates/ListItem';

interface CentralStorageProps {
  store: WaykeStore;
}

class CentralStorage extends HtmlNode {
  private props: CentralStorageProps;

  constructor(element: HTMLDivElement, props: CentralStorageProps) {
    super(element);
    this.props = props;
    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.render();
  }

  render() {
    const centralStorage = this.props.store.getState().centralStorage;
    if (centralStorage) {
      ListItem(this.node, { title: 'Centrallager', id: 'central-storage' });
    }
  }
}

export default CentralStorage;
