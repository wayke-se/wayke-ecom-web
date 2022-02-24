import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import AppendChild from '../../../Components/AppendChild';
import GridItem from './GridItem';

const ACCESSORY_LIST = 'accessory-list';
const ACCESSORY_LIST_PREV = `${ACCESSORY_LIST}-prev`;
const ACCESSORY_LIST_NEXT = `${ACCESSORY_LIST}-next`;

class GridList extends AppendChild {
  private accessories: IAccessory[];
  private overflowElement?: HTMLUListElement | null;

  constructor(element: HTMLDivElement, accessories: IAccessory[]) {
    super(element, { htmlTag: 'div', className: 'waykeecom-overflow-grid' });
    this.accessories = accessories;
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
    this.content.innerHTML = `
      <div class="waykeecom-overflow-grid__list-wrapper">
        <ul class="waykeecom-overflow-grid__list" id="${ACCESSORY_LIST}"></ul>
      </div>
      <div class="waykeecom-overflow-grid__nav waykeecom-overflow-grid__nav--prev">
        <button type="button" title="Visa föregående försäkring" class="waykeecom-icon-button" id="${ACCESSORY_LIST_PREV}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="waykeecom-icon"
          >
            <title>Ikon: vinkel vänster</title>
            <path d="m5.4 7 5.2-5 1 1-5.2 5 5.2 5-1.1 1-5.2-5-1-1 1.1-1z" />
          </svg>
        </button>
      </div>
      <div class="waykeecom-overflow-grid__nav waykeecom-overflow-grid__nav--next">
        <button type="button" title="Visa nästa försäkring" class="waykeecom-icon-button" id="${ACCESSORY_LIST_NEXT}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="waykeecom-icon"
          >
            <title>Ikon: vinkel höger</title>
            <path d="m10.5 9-5.2 5-1-1 5.2-5-5.2-5 1.1-1 5.2 5 1 1-1.1 1z" />
          </svg>
        </button>
      </div>
    `;

    const listRef = (this.overflowElement =
      this.content.querySelector<HTMLUListElement>(`#${ACCESSORY_LIST}`) || undefined);
    if (listRef) {
      this.accessories.forEach((accessory) => new GridItem(listRef, accessory));
    }

    this.content
      .querySelector<HTMLUListElement>(`#${ACCESSORY_LIST_PREV}`)
      ?.addEventListener('click', () => this.onPrev());

    this.content
      .querySelector<HTMLUListElement>(`#${ACCESSORY_LIST_NEXT}`)
      ?.addEventListener('click', () => this.onNext());
  }
}

export default GridList;
