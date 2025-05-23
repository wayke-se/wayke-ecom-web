import i18next from '@i18n';
import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import ButtonAddRemove from '../../../Components/Button/ButtonAddRemove';
import ButtonAsLinkArrowLeft from '../../../Components/Button/ButtonAsLinkArrowLeft';
import ButtonClear from '../../../Components/Button/ButtonClear';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import Gallery from '../../../Components/Gallery/Gallery';
import ecomEvent, { EcomEvent, EcomStep, EcomView } from '../../../Utils/ecomEvent';
import { prettyNumber } from '../../../Utils/format';
import { asHtml } from '../../../Utils/parser';
import { scrollTop } from '../../../Utils/scroll';

const BUTTON_TOP_LEFT_NODE = 'accessory-button-top-left-node';
const BUTTON_BOTTOM_LEFT_NODE = 'accessory-button-bottom-left-node';
const BUTTON_ACCESSORY_ADD_REMOVE_NODE = 'accessory-add-remove-node';
const ACCESSORY_GALLERY_NODE = 'accessory-gallery-node';

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

  private onGalleryImagePaging() {
    const { accessory } = this.props;
    ecomEvent(
      EcomView.MAIN,
      EcomEvent.ACCESSORY_INFORMATION_GALLERY_IMAGE_PAGING,
      EcomStep.ACCESSORY,
      {
        id: accessory.id,
        label: accessory.name,
      }
    );
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
              <img src="${logoUrl}" alt="${i18next.t('accessoryItemInfo.logoAlt')} ${name}" class="waykeecom-logo__image waykeecom-logo__image--right" />
            </div>
          </div>
        </div>

      </div>
      <div class="waykeecom-stack waykeecom-stack--3" id="${ACCESSORY_GALLERY_NODE}"></div>
      
      <div class="waykeecom-stack waykeecom-stack--3">
        ${
          salePrice
            ? `<div class="waykeecom-text waykeecom-text--font-bold">${prettyNumber(salePrice, {
                postfix: 'kr',
              })}<span class="waykeecom-text waykeecom-text--tone-alt waykeecom-text--line-through"> (${prettyNumber(
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
          <p class="waykeecom-content__p">${asHtml(longDescription)}</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--1" id="${BUTTON_ACCESSORY_ADD_REMOVE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--1" id="${BUTTON_BOTTOM_LEFT_NODE}"></div>
      </div>
    `;

    new Gallery(this.node.querySelector(`#${ACCESSORY_GALLERY_NODE}`), {
      id: `gallery-${accessory.id}`,
      media: media.map((m, i) => ({ url: m.url, alt: `Bild ${i + 1}` })),
      onGalleryImagePaging: () => this.onGalleryImagePaging(),
    });

    new ButtonAsLinkArrowLeft(this.node.querySelector(`#${BUTTON_TOP_LEFT_NODE}`), {
      title: i18next.t('accessoryItemInfo.backButton'),
      onClick: () => onClose(),
    });

    new ButtonClear(this.node.querySelector(`#${BUTTON_BOTTOM_LEFT_NODE}`), {
      title: i18next.t('accessoryItemInfo.backButton'),
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
