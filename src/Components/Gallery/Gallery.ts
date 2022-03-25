import HtmlNode from '../Extension/HtmlNode';
import Arrow from './Arrow';

interface Media {
  url: string;
  alt: string;
}

interface GalleryProps {
  id: string;
  media: Media[];
}

const getRightVariables = (ref: HTMLUListElement | undefined) => {
  const itemWidth = ref?.children?.[0]?.clientWidth || 0;
  const scrollWidth = ref?.scrollWidth || 0;
  const scrollLeft = ref?.scrollLeft || 0;
  const overflowElementWidth = ref?.offsetWidth || 0;
  const overflowElementScrollWidth = scrollWidth - overflowElementWidth;
  return {
    itemWidth,
    scrollWidth,
    scrollLeft,
    overflowElementWidth,
    overflowElementScrollWidth,
  };
};

class Gallery extends HtmlNode {
  private readonly props: GalleryProps;
  private timeout?: NodeJS.Timeout;
  private contexts: {
    overflowElement?: HTMLUListElement;
    left?: Arrow;
    right?: Arrow;
  } = {};

  constructor(element: HTMLElement | null, props: GalleryProps) {
    super(element, { htmlTag: 'div', className: 'waykeecom-overflow-gallery' });
    this.props = props;
    this.render();
  }

  onPrev() {
    const listRef = this.contexts.overflowElement;
    if (listRef) {
      const itemWidth = listRef?.clientWidth || 0;
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
    const listRef = this.contexts.overflowElement;
    if (listRef) {
      const { itemWidth, scrollLeft, overflowElementScrollWidth } = getRightVariables(listRef);
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
      const listRef = this.contexts.overflowElement;
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
    const PREV_ID = `${this.props.id}-prev`;
    const NEXT_ID = `${this.props.id}-next`;

    this.node.innerHTML = `
      <div class="waykeecom-overflow-gallery__nav waykeecom-overflow-gallery__nav--prev" id="${PREV_ID}"></div>
      <div class="waykeecom-overflow-gallery__nav waykeecom-overflow-gallery__nav--next" id="${NEXT_ID}"></div>
      <ul class="waykeecom-overflow-gallery__list" id="${this.props.id}">
      ${this.props.media
        .map(
          (m) => `
            <li class="waykeecom-overflow-gallery__item">
              <img src="${m.url}" alt="${m.alt}" class="waykeecom-overflow-gallery__image" />
            </li>
          `
        )
        .join('')}
      </ul>
    `;

    this.contexts.overflowElement =
      this.node.querySelector<HTMLUListElement>(`#${this.props.id}`) || undefined;
    this.contexts.overflowElement?.addEventListener('scroll', () => this.scrollHandler());

    this.contexts.left = new Arrow(this.node.querySelector<HTMLUListElement>(`#${PREV_ID}`), {
      direction: 'left',
      hide: true,
      onClick: () => this.onPrev(),
    });

    this.contexts.right = new Arrow(this.node.querySelector<HTMLUListElement>(`#${NEXT_ID}`), {
      direction: 'right',
      hide: true,
      onClick: () => this.onNext(),
    });

    setTimeout(() => {
      const { itemWidth, scrollLeft, overflowElementScrollWidth } = getRightVariables(
        this.contexts.overflowElement
      );
      const left = scrollLeft + itemWidth;
      const rightHide =
        overflowElementScrollWidth === scrollLeft && left >= overflowElementScrollWidth;
      this.contexts.right?.hide(rightHide);
    }, 50);
  }
}

export default Gallery;
