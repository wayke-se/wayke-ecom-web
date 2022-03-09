import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import ButtonAddRemove from '../../../Components/Button/ButtonAddRemove';
import ButtonAsLinkArrowLeft from '../../../Components/Button/ButtonAsLinkArrowLeft';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { prettyNumber } from '../../../Utils/format';
import { scrollTop } from '../../../Utils/scroll';

const BUTTON_TOP_LEFT_NODE = 'accessory-button-top-left-node';
const BUTTON_BOTTOM_LEFT_NODE = 'accessory-button-bottom-left-node';
const BUTTON_ACCESSORY_ADD_REMOVE_NODE = 'accessory-add-remove-node';

interface AccessoryItemInfoProps {
  accessory: IAccessory;
  selected: boolean;
  onClick: () => void;
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
    const { accessory, selected, onClick, onClose } = this.props;
    const { name, media, logoUrl, price, shortDescription, longDescription, salePrice } = accessory;
    const image = media?.[0]?.url;

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2" id="${BUTTON_TOP_LEFT_NODE}"></div>
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
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2" id="${BUTTON_BOTTOM_LEFT_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${BUTTON_ACCESSORY_ADD_REMOVE_NODE}"></div>
      </div>
    `;

    new ButtonAsLinkArrowLeft(this.node.querySelector(`#${BUTTON_TOP_LEFT_NODE}`), {
      title: 'Tillbaka',
      onClick: () => onClose(),
    });

    new ButtonAsLinkArrowLeft(this.node.querySelector(`#${BUTTON_BOTTOM_LEFT_NODE}`), {
      title: 'Tillbaka',
      onClick: () => onClose(),
    });

    new ButtonAddRemove(this.node.querySelector(`#${BUTTON_ACCESSORY_ADD_REMOVE_NODE}`), {
      selected,
      onClick: () => onClick(),
    });

    scrollTop();
  }
}

export default AccessoryItemInfo;
