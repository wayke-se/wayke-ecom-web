import ButtonAddRemove from '../Button/ButtonAddRemove';
import ButtonAsLink from '../Button/ButtonAsLink';
import HtmlNode from '../Extension/HtmlNode';

const BUTTON_ADD_REMOVE = 'button-add-remove';
const BUTTON_ADD_REMOVE_NODE = `${BUTTON_ADD_REMOVE}-node`;

const READ_MORE = 'read-more';
const READ_MORE_NODE = `${READ_MORE}-node`;

interface GridItemProps {
  readonly id?: string;
  readonly title: string;
  readonly image?: string;
  readonly logo?: string;
  readonly price?: string;
  readonly priceDetails?: { key: string; value: string }[];
  readonly description?: string;
  readonly selected?: boolean;
  readonly onClick: () => void;
  readonly onInfo?: () => void;
  readonly inViewPort?: () => void;
}

class GridItem extends HtmlNode {
  private readonly props: GridItemProps;
  private hasBeenInViewPort = false;

  constructor(element: HTMLElement, props: GridItemProps, id: string) {
    super(element, { htmlTag: 'li', className: 'waykeecom-overflow-grid__item', id });
    this.props = props;
    this.render();
    this.attachInViewportTrigger();
  }

  private attachInViewportTrigger() {
    if (this.props.inViewPort && !this.hasBeenInViewPort) {
      const observer = new IntersectionObserver(
        (changes) => {
          if (!this.hasBeenInViewPort) {
            for (const change of changes) {
              if (change.intersectionRatio === 1) {
                this.hasBeenInViewPort = true;
                if (this.props.inViewPort) {
                  this.props.inViewPort();
                }
              }
            }
          }
        },
        { threshold: [1] }
      );
      observer.observe(this.node);
    }
  }

  render() {
    const { id, title, image, logo, price, priceDetails, description, selected, onClick, onInfo } =
      this.props;

    const onInfoId = id && onInfo ? `${READ_MORE_NODE}-${id}` : undefined;
    const addRemoveButtonNodeId = id ? `${BUTTON_ADD_REMOVE_NODE}-${id}` : undefined;

    this.node.innerHTML = `
      <div class="waykeecom-tile">
        ${image ? `<img src="${image}" alt="${title}" class="waykeecom-tile__hero" />` : ''}
        <div class="waykeecom-tile__body">
          <div class="waykeecom-tile__header">
            <div class="waykeecom-tile__title">${title}</div>
            <div class="waykeecom-tile__image">
              <div class="waykeecom-logo">
                <img src="${logo}" alt="" class="waykeecom-logo__image waykeecom-logo__image--right" />
              </div>
            </div>
          </div>
          <div class="waykeecom-tile__price">${price}</div>
          ${
            priceDetails?.length
              ? `<div class="waykeecom-tile__price-disclaimer">+ ${priceDetails
                  .map((d) => `${d.key} (${d.value})`)
                  .join(', ')}</div>`
              : ''
          }
          <div class="waykeecom-tile__description">
            ${description || ''}
          </div>
          ${
            onInfoId
              ? `
                <div class="waykeecom-tile__read-more" id="${onInfoId}"></div>`
              : ''
          }
        </div>
        <div class="waykeecom-tile__footer" id="${addRemoveButtonNodeId}"></div>
      </div>
    `;

    if (onInfo) {
      new ButtonAsLink(this.node.querySelector(`#${onInfoId}`), {
        title: 'Läs mer',
        onClick: () => onInfo(),
      });
    }

    new ButtonAddRemove(this.node.querySelector(`#${addRemoveButtonNodeId}`), {
      selected,
      onClick: () => onClick(),
    });
  }
}

export default GridItem;
