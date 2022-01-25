import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Vehicle } from '../@types/Vehicle';

import carfaxLogo from '../assets/images/carfax/carfax-logo-43x8.png';
import carfaxLogo2x from '../assets/images/carfax/carfax-logo-43x8@2x.png';

interface ItemTileSmallProps {
  vehicle?: Vehicle;
  order?: OrderOptionsResponse;
}

const ItemTileSmall = ({ vehicle, order }: ItemTileSmallProps) => `
  <div class="waykeecom-preview-card">
    <div class="waykeecom-preview-card__media">
      <img src="${
        vehicle?.imageUrls[0]
      }?spec=200x&format=webp" alt="" class="waykeecom-preview-card__image" />
    </div>
    <div class="waykeecom-preview-card__body">
      <div class="waykeecom-preview-card__seller">${order?.getContactInformation()?.name}</div>
      <div class="waykeecom-preview-card__heading">
        <span class="waykeecom-preview-card__title">${vehicle?.title}</span> ${
  vehicle?.shortDescription
}
      </div>
      <div class="waykeecom-preview-card__footer">
        <div class="waykeecom-preview-card__price">${vehicle?.price} kr</div>
        <div class="waykeecom-preview-card__branding">
          <img
            src="${carfaxLogo}"
            srcset="${carfaxLogo2x} 2x"
            alt="Detta fordon är granskat med Carfax Risk Alert"
            class="waykeecom-preview-card__branding-logo"
          />
        </div>
      </div>
    </div>
  </div>
`;

export default ItemTileSmall;
