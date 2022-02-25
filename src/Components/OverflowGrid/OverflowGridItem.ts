import { renderConditional } from '../../Utils/render';
import AppendChild from '../Extension/AppendChild';

interface GridItemProps {
  title: string;
  image?: string;
  logo?: string;
  price?: string;
  description: string;
  selected?: boolean;
  onClick: () => void;
}

class GridItem extends AppendChild {
  private props: GridItemProps;

  constructor(element: HTMLUListElement, props: GridItemProps, key: string) {
    super(element, { htmlTag: 'li', className: 'waykeecom-overflow-grid__item' }, key);
    this.props = props;
    this.render();
  }

  render() {
    const { title, image, logo, price, description, selected, onClick } = this.props;

    this.content.innerHTML = `
      <div class="waykeecom-tile">
        ${renderConditional(!!image, `<img src="${image}" alt="" class="waykeecom-tile__hero" />`)}
        <div class="waykeecom-tile__body">
          <div class="waykeecom-tile__header">
            <div class="waykeecom-tile__title">${title}</div>
            <div class="waykeecom-tile__image">
              <div class="waykeecom-logo">
                <img src="${logo}" alt="" class="waykeecom-logo__image" />
              </div>
            </div>
          </div>
          <div class="waykeecom-tile__price">${price}</div>
          <div class="waykeecom-tile__description">${description}</div>
          <div class="waykeecom-tile__read-more">
            <button type="button" title="" class="waykeecom-link">Läs mer</button>
          </div>
        </div>
        <div class="waykeecom-tile__footer">
          <button
            type="button"
            title="${selected ? 'Vald' : 'Lägg till'}"
            class="waykeecom-button waykeecom-button--action-alt waykeecom-button--size-small"
          >
            <span class="waykeecom-button__content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                class="waykeecom-icon"
              >
                <title>Ikon: ${selected ? 'bock' : 'plus'}</title>
                ${
                  selected
                    ? '<path d="M14 7v2H9v5H7V9H2V7h5V2h2v5h5z" />'
                    : '<path d="M12.3 3.3 6 9.6 3.7 7.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l3 3c.4.4 1 .4 1.4 0l7-7c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z"/>'
                }
              </svg>
            </span>
            <span class="waykeecom-button__content">${selected ? 'Vald' : 'Lägg till'}</span>
          </button>
        </div>
      </div>
    `;

    this.content
      .querySelector('.waykeecom-tile__footer button')
      ?.addEventListener('click', () => onClick());
  }
}

export default GridItem;
