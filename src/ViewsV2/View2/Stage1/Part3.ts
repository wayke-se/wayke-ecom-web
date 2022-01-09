import store from '../../../Redux/store';

class Part3 {
  private element: HTMLDivElement;
  private localStage: number = 1;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const _state = store.getState();
    this.element.innerHTML = `part3`;
  }
}

export default Part3;
