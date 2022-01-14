import ListItem from '../ListItem';

class Stage7Summary {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    ListItem(this.element, 'Sammanställning');
  }
}

export default Stage7Summary;
