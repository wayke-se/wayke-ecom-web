import HtmlNode from '../../../Components/Extension/HtmlNode';
import ListItem from '../ListItem';

class Summary extends HtmlNode {
  constructor(element: HTMLDivElement) {
    super(element);
    this.render();
  }

  render() {
    ListItem(this.node, { title: 'Sammanställning', id: 'summary' });
  }
}

export default Summary;
