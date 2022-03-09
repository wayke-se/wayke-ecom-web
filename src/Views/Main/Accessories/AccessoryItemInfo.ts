import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { prettyNumber } from '../../../Utils/format';

interface AccessoryItemInfoProps {
  accessory: IAccessory;
  onClose: () => void;
}

class AccessoryItemInfo extends HtmlNode {
  private props: AccessoryItemInfoProps;

  constructor(element: HTMLElement, props: AccessoryItemInfoProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { accessory, onClose } = this.props;
    const { name, media, logoUrl, price, shortDescription, longDescription, salePrice } = accessory;
    const image = media?.[0]?.url;

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <button type="button" class="waykeecom-link waykeecom-link--has-content" title="Tillbaka">
          <span class="waykeecom-link__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="waykeecom-icon"
              data-icon="Arrow left"
            >
              <path d="m.8 7.2 4.8-4.8 1.7 1.7-2.7 2.7h10.2c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2H4.6l2.7 2.7-1.7 1.7L.8 8.8 0 8l.8-.8z"/>
            </svg>
          </span>
          <span class="waykeecom-link__content">Tillbaka</span>
        </button>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">

        <div class="waykeecom-hstack waykeecom-hstack--align-center waykeecom-hstack--spacing-3">
          <div class="waykeecom-hstack__item waykeecom-hstack__item--grow">
            <h3 class="waykeecom-heading waykeecom-heading--3 waykeecom-no-margin">${name}</h3>
          </div>
          <div class="waykeecom-hstack__item waykeecom-hstack__item--no-shrink">
            <div class="waykeecom-logo">
              <img src="${logoUrl}" alt="Tillverkarens logotyp för ${name}" class="waykeecom-logo__image" />
            </div>
          </div>
        </div>

      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        ${
          image
            ? `
              <ul class="waykeecom-overflow-gallery">
                <li class="waykeecom-overflow-gallery__item">
                  <img src="${image}" alt="${name}" class="waykeecom-overflow-gallery__image" />
                </li>
              </ul>
            `
            : ''
        }
      </div>
      
      <div class="waykeecom-stack waykeecom-stack--3">
        ${
          salePrice
            ? `<div class="waykeecom-font-medium">${prettyNumber(salePrice, {
                postfix: 'kr',
              })}<span class="waykeecom-text waykeecom-text--tone-alt waykeecom-text--line-through">(${prettyNumber(
                price,
                {
                  postfix: 'kr',
                }
              )})</span></div>`
            : `<div class="waykeecom-font-medium">${prettyNumber(price, { postfix: 'kr' })}</div>`
        }
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-content waykeecom-font-medium">
          <p>${shortDescription}</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-content">
          <p>${longDescription}</p>
        </div>
      </div>
    `;

    this.node.querySelector('button')?.addEventListener('click', () => onClose());
  }
}

export default AccessoryItemInfo;
