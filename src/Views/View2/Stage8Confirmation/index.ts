import ListItem from '../ListItem';

class Stage8Confirmation {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    ListItem(this.element, 'Orderbekräftelse');
  }
}

export default Stage8Confirmation;
