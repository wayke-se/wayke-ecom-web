import InsuranceCardBase from './InsuranceCardBase';

class InsuranceCard {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const content = InsuranceCardBase(this.element);

    content.innerHTML = `
      <div>ehhehe</div>
    `;
  }
}

export default InsuranceCard;
