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
            >
              <title>Ikon: pil vänster</title>
              <path d="m.8 7.2 4.8-4.8 1.7 1.7-2.7 2.7h10.2c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2H4.6l2.7 2.7-1.7 1.7L.8 8.8 0 8l.8-.8z"/>
            </svg>
          </span>
          <span class="waykeecom-link__content">Tillbaka</span>
        </button>
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        ${name}
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        ${image ? `<img src="${image}" alt="" />` : ''}
        <img src="${logoUrl}" alt="" />
      </div>
      
      <div class="waykeecom-stack waykeecom-stack--2">
        ${
          salePrice
            ? `<div>${prettyNumber(salePrice, {
                postfix: 'kr',
              })}<span style="text-decoration=line-through">(${prettyNumber(price, {
                postfix: 'kr',
              })})</span></div>`
            : `<div>${prettyNumber(price, { postfix: 'kr' })}</div>`
        }
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
          ${shortDescription}
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
          ${longDescription}
      </div>
    `;

    this.node.querySelector('button')?.addEventListener('click', () => onClose());
  }
}

export default AccessoryItemInfo;
