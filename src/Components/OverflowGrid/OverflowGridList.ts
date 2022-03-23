import HtmlNode from '../Extension/HtmlNode';
import Arrow from './Arrow';

class OverflowGridList extends HtmlNode {
  private readonly id: string;
  overflowElement?: HTMLUListElement | null;
  private timeout?: NodeJS.Timeout;
  private contexts: {
    left?: Arrow;
    right?: Arrow;
  } = {};

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
        this.contexts.right?.hide(false);
        const left = scrollLeft - itemWidth;
        listRef.scroll({
          left,
          behavior: 'smooth',
        });
        if (left <= 0) {
          this.contexts.left?.hide(true);
        }
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
        this.contexts.left?.hide(false);
        const left = scrollLeft + itemWidth;
        listRef.scroll({
          left,
          behavior: 'smooth',
        });
        if (left >= overflowElementScrollWidth) {
          this.contexts.right?.hide(true);
        }
      }
    }
  }

  scrollHandler() {
    clearTimeout(this.timeout as unknown as number);
    this.timeout = setTimeout(() => {
      const listRef = this.overflowElement;
      if (listRef) {
        const scrollWidth = listRef.scrollWidth || 0;
        if (scrollWidth <= listRef.offsetWidth) return;

        const scrollLeft = listRef.scrollLeft || 0;
        this.contexts.left?.hide(scrollLeft <= 0);

        const overflowElementWidth = listRef.offsetWidth || 0;
        const overflowElementScrollWidth = scrollWidth - overflowElementWidth;
        this.contexts.right?.hide(overflowElementScrollWidth === scrollLeft);
      }
    }, 50);
  }

  render() {
    const PREV_ID = `${this.id}-prev`;
    const NEXT_ID = `${this.id}-next`;

    this.node.innerHTML = `
      <div class="waykeecom-overflow-grid__nav waykeecom-overflow-grid__nav--prev" id="${PREV_ID}"></div>
      <div class="waykeecom-overflow-grid__nav waykeecom-overflow-grid__nav--next" id="${NEXT_ID}"></div>
      <div class="waykeecom-overflow-grid__list-wrapper">
        <ul class="waykeecom-overflow-grid__list" id="${this.id}"></ul>
      </div>
    `;

    this.overflowElement = this.node.querySelector<HTMLUListElement>(`#${this.id}`) || undefined;
    this.overflowElement?.addEventListener('scroll', () => this.scrollHandler());

    this.contexts.left = new Arrow(this.node.querySelector<HTMLUListElement>(`#${PREV_ID}`), {
      direction: 'left',
      hide: true,
      onClick: () => this.onPrev(),
    });

    this.contexts.right = new Arrow(this.node.querySelector<HTMLUListElement>(`#${NEXT_ID}`), {
      direction: 'right',
      onClick: () => this.onNext(),
    });
  }
}

export default OverflowGridList;
