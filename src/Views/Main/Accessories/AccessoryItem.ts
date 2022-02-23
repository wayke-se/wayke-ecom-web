import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import GridItem from './GridItem';

class AccessoryItem {
  private element: HTMLUListElement;
  private accessory: IAccessory;

  constructor(element: HTMLUListElement, accessory: IAccessory) {
    this.element = element;
    this.accessory = accessory;
    this.render();
  }

  render() {
    const content = GridItem(this.element);

    const media = this.accessory.media?.[0]?.url;
    const { name, logoUrl, price } = this.accessory;

    content.innerHTML = `
      <div class="waykeecom-tile">
        <img src="${media}" alt="" class="waykeecom-tile__hero" />
        <div class="waykeecom-tile__body">
          <div class="waykeecom-tile__header">
            <div class="waykeecom-tile__title">${name}</div>
            <div class="waykeecom-tile__image">
              <div class="waykeecom-logo">
                <img src="${logoUrl}" alt="" class="waykeecom-logo__image" />
              </div>
            </div>
          </div>
          <div class="waykeecom-tile__price">${price} kr/mån</div>
          <div class="waykeecom-tile__description">Med finansering via Volvofinans Bank</div>
          <div class="waykeecom-tile__read-more">
            <button type="button" title="" class="waykeecom-link">Läs mer</button>
          </div>
        </div>
        <div class="waykeecom-tile__footer">
          <button type="button" title="Lägg till" class="waykeecom-button waykeecom-button--action-alt waykeecom-button--size-small">
            <span class="waykeecom-button__content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                class="waykeecom-icon"
              >
                <title>Ikon: bock</title>
                <path d="M12.3 3.3 6 9.6 3.7 7.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l3 3c.4.4 1 .4 1.4 0l7-7c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z"/>
              </svg>
            </span>
            <span class="waykeecom-button__content">Vald</span>
          </button>
        </div>
      </div>
    `;
  }
}

export default AccessoryItem;
