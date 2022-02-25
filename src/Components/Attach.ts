class Attach {
  element: HTMLElement;

  constructor(element: HTMLElement | null | undefined) {
    if (!element) throw 'Missing element';
    this.element = element;
  }
}

export default Attach;
