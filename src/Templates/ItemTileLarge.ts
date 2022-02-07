import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Vehicle } from '../@types/Vehicle';

import carfaxLogo from '../assets/images/carfax/carfax-logo-70x13.png';
import carfaxLogo2x from '../assets/images/carfax/carfax-logo-70x13@2x.png';

interface ItemTileLargeProps {
  vehicle?: Vehicle;
  order?: OrderOptionsResponse;
  meta?: string;
}

const ItemTileLarge = ({ vehicle, order, meta }: ItemTileLargeProps) => `
  <div class="waykeecom-product-card">
    <div class="waykeecom-product-card__media">
      <div class="waykeecom-product-card__media-item">
        <img src="${
          vehicle?.imageUrls[0]
        }?spec=800x&format=webp" alt="" class="waykeecom-product-card__image" />
      </div>
      <div class="waykeecom-product-card__media-item">
        <img src="${
          vehicle?.imageUrls[0]
        }?spec=800x&format=webp" alt="" class="waykeecom-product-card__image" />
      </div>
      <div class="waykeecom-product-card__media-item">
        <img src="${
          vehicle?.imageUrls[0]
        }?spec=800x&format=webp" alt="" class="waykeecom-product-card__image" />
        <div class="waykeecom-product-card__media-item-overlay">+10</div>
      </div>
    </div>
    <div class="waykeecom-product-card__body">
      <div class="waykeecom-product-card__seller">
        ${order?.getContactInformation()?.name}
      </div>
      <div class="waykeecom-product-card__heading">
        <span class="waykeecom-product-card__title">${vehicle?.title}</span> ${
  vehicle?.shortDescription
}
      </div>
      <div class="waykeecom-product-card__footer">
        <div class="waykeecom-product-card__price">${vehicle?.price} kr</div>
        <div class="waykeecom-product-card__branding">
          <img
            src="${carfaxLogo}"
            srcset="${carfaxLogo2x} 2x"
            alt="Detta fordon är granskat med Carfax Risk Alert"
            class="waykeecom-product-card__branding-logo"
          />
        </div>
      </div>
      ${
        meta
          ? `
      <div class="waykeecom-product-card__meta">
        ${meta}
      </div>
    `
          : ''
      }
    </div>
  </div>
`;

export default ItemTileLarge;
