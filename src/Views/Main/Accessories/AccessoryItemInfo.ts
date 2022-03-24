import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import ButtonAddRemove from '../../../Components/Button/ButtonAddRemove';
import ButtonClear from '../../../Components/Button/ButtonClear';
import ButtonAsLinkArrowLeft from '../../../Components/Button/ButtonAsLinkArrowLeft';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { prettyNumber } from '../../../Utils/format';
import { scrollTop } from '../../../Utils/scroll';

const BUTTON_TOP_LEFT_NODE = 'accessory-button-top-left-node';
const BUTTON_BOTTOM_LEFT_NODE = 'accessory-button-bottom-left-node';
const BUTTON_ACCESSORY_ADD_REMOVE_NODE = 'accessory-add-remove-node';

interface AccessoryItemInfoProps {
  readonly accessory: IAccessory;
  readonly selected: boolean;
  readonly onClick: () => void;
  readonly onClose: () => void;
}

class AccessoryItemInfo extends HtmlNode {
  private readonly props: AccessoryItemInfoProps;

  constructor(element: HTMLElement, props: AccessoryItemInfoProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { accessory, selected, onClick, onClose } = this.props;
    const { name, media, logoUrl, price, shortDescription, longDescription, salePrice } = accessory;

    this.node.innerHTML = `
      <div class="waykeecom-nav-banner" id="${BUTTON_TOP_LEFT_NODE}"></div>

      <div class="waykeecom-stack waykeecom-stack--3">

        <div class="waykeecom-hstack waykeecom-hstack--align-center waykeecom-hstack--spacing-3">
          <div class="waykeecom-hstack__item waykeecom-hstack__item--grow">
            <h3 class="waykeecom-heading waykeecom-heading--3 waykeecom-no-margin">${name}</h3>
          </div>
          <div class="waykeecom-hstack__item waykeecom-hstack__item--no-shrink">
            <div class="waykeecom-logo">
              <img src="${logoUrl}" alt="Tillverkarens logotyp för ${name}" class="waykeecom-logo__image waykeecom-logo__image--right" />
            </div>
          </div>
        </div>

      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        ${
          !!media.length
            ? `
              <div class="waykeecom-overflow-gallery">
                <ul class="waykeecom-overflow-gallery__list">
                  ${media
                    .map(
                      (m) => `
                      <li class="waykeecom-overflow-gallery__item">
                        <img src="${m.url}" alt="${name}" class="waykeecom-overflow-gallery__image" />
                      </li>
                      `
                    )
                    .join('')}
                </ul>
                <div class="waykeecom-overflow-gallery__nav waykeecom-overflow-gallery__nav--prev">
                  <button type="button" title="Visa föegående bild" class="waykeecom-icon-button">
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
                <div class="waykeecom-overflow-gallery__nav waykeecom-overflow-gallery__nav--next">
                  <button type="button" title="Visa nästa bild" class="waykeecom-icon-button">
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
              </div>
            `
            : ''
        }
      </div>
      
      <div class="waykeecom-stack waykeecom-stack--3">
        ${
          salePrice
            ? `<div class="waykeecom-text waykeecom-text--font-bold">${prettyNumber(salePrice, {
                postfix: 'kr',
              })}<span class="waykeecom-text waykeecom-text--tone-alt waykeecom-text--line-through">(${prettyNumber(
                price,
                {
                  postfix: 'kr',
                }
              )})</span></div>`
            : `<div class="waykeecom-text waykeecom-text--font-bold">${prettyNumber(price, {
                postfix: 'kr',
              })}</div>`
        }
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-content waykeecom-text waykeecom-text--font-medium">
          <p class="waykeecom-content__p">${shortDescription}</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-content">
          <p class="waykeecom-content__p">${longDescription}</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--1" id="${BUTTON_ACCESSORY_ADD_REMOVE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--1" id="${BUTTON_BOTTOM_LEFT_NODE}"></div>
      </div>
    `;

    new ButtonAsLinkArrowLeft(this.node.querySelector(`#${BUTTON_TOP_LEFT_NODE}`), {
      title: 'Tillbaka',
      onClick: () => onClose(),
    });

    new ButtonClear(this.node.querySelector(`#${BUTTON_BOTTOM_LEFT_NODE}`), {
      title: 'Tillbaka',
      onClick: () => onClose(),
    });

    new ButtonAddRemove(this.node.querySelector(`#${BUTTON_ACCESSORY_ADD_REMOVE_NODE}`), {
      selected,
      fullSize: true,
      onClick: () => onClick(),
    });

    scrollTop();
  }
}

export default AccessoryItemInfo;
