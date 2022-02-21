import StackItem from '../View2/TradeIn/StackItem';

class ExecuteOrder {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const content = StackItem(this.element);

    content.innerHTML = `
      <button type="button" title="Genomför order" class="waykeecom-button waykeecom-button--full-width waykeecom-button--action">
        Genomför order
      </button>
    `;
  }
}

export default ExecuteOrder;
