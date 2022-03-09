import HtmlNode from '../Extension/HtmlNode';

class OverflowGridList extends HtmlNode {
  overflowElement?: HTMLUListElement | null;
  id: string;

  constructor(element: HTMLElement, id: string) {
    super(element, { htmlTag: 'div', className: 'waykeecom-overflow-grid' });
    this.id = id;
    this.render();
  }

  onPrev() {
    const listRef = this.overflowElement;
    if (listRef) {
      const itemWidth = listRef.children?.[0]?.clientWidth || 0;
      const scrollLeft = listRef.scrollLeft || 0;
      if (scrollLeft > 0) {
        listRef.scroll({
          left: scrollLeft - itemWidth,
          behavior: 'smooth',
        });
      }
    }
  }

  onNext() {
    const listRef = this.overflowElement;
    if (listRef) {
      const itemWidth = listRef.children?.[0]?.clientWidth || 0;
      const scrollWidth = listRef.scrollWidth || 0;
      const scrollLeft = listRef.scrollLeft || 0;
      const overflowElementWidth = listRef.offsetWidth || 0;
      const overflowElementScrollWidth = scrollWidth - overflowElementWidth;

      if (overflowElementScrollWidth !== scrollLeft) {
        listRef.scroll({
          left: scrollLeft + itemWidth,
          behavior: 'smooth',
        });
      }
    }
  }

  render() {
    const PREV_ID = `${this.id}-prev`;
    const NEXT_ID = `${this.id}-next`;

    this.node.innerHTML = `
      <div class="waykeecom-overflow-grid__nav waykeecom-overflow-grid__nav--prev">
        <button type="button" title="Visa föregående" class="waykeecom-icon-button" id="${PREV_ID}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="waykeecom-icon"
            data-icon="Chevron left"
          >
            <path d="m5.4 7 5.2-5 1 1-5.2 5 5.2 5-1.1 1-5.2-5-1-1 1.1-1z" />
          </svg>
        </button>
      </div>
      <div class="waykeecom-overflow-grid__nav waykeecom-overflow-grid__nav--next">
        <button type="button" title="Visa nästa" class="waykeecom-icon-button" id="${NEXT_ID}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="waykeecom-icon"
            data-icon="Chevron right"
          >
            <path d="m10.5 9-5.2 5-1-1 5.2-5-5.2-5 1.1-1 5.2 5 1 1-1.1 1z" />
          </svg>
        </button>
      </div>
      <div class="waykeecom-overflow-grid__list-wrapper">
        <ul class="waykeecom-overflow-grid__list" id="${this.id}"></ul>
      </div>
    `;

    this.overflowElement = this.node.querySelector<HTMLUListElement>(`#${this.id}`) || undefined;

    this.node
      .querySelector<HTMLUListElement>(`#${PREV_ID}`)
      ?.addEventListener('click', () => this.onPrev());

    this.node
      .querySelector<HTMLUListElement>(`#${NEXT_ID}`)
      ?.addEventListener('click', () => this.onNext());
  }
}

export default OverflowGridList;
