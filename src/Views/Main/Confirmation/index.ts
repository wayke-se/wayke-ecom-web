import Attach from '../../../Components/Extension/Attach';
import ListItem from '../ListItem';

class Confirmation extends Attach {
  constructor(element: HTMLDivElement) {
    super(element);
    this.render();
  }

  render() {
    ListItem(this.element, { title: 'Orderbekräftelse', id: 'confirmation' });
  }
}

export default Confirmation;
