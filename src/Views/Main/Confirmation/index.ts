import ListItem from '../ListItem';

class Confirmation {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    ListItem(this.element, { title: 'Orderbekräftelse', id: 'confirmation' });
  }
}

export default Confirmation;