import HtmlNode from '../../../Components/Extension/HtmlNode';
import ListItem from '../ListItem';

class Confirmation extends HtmlNode {
  constructor(element: HTMLDivElement) {
    super(element);
    this.render();
  }

  render() {
    ListItem(this.node, { title: 'Orderbekräftelse', id: 'confirmation' });
  }
}

export default Confirmation;
