import Attach from '../../../Components/Extension/Attach';
import ListItem from '../ListItem';

class Summary extends Attach {
  constructor(element: HTMLDivElement) {
    super(element);
    this.render();
  }

  render() {
    ListItem(this.element, { title: 'Sammanställning', id: 'summary' });
  }
}

export default Summary;
