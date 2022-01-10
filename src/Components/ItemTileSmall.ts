import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Vehicle } from '../@types/Vehicle';

interface ItemTileSmallProps {
  vehicle?: Vehicle;
  order?: OrderOptionsResponse;
}

const ItemTileSmall = ({ vehicle, order }: ItemTileSmallProps) => `
  <div class="preview-card">
    <div class="preview-card__media">
      <img src="${
        vehicle?.imageUrls[0]
      }?spec=200x&format=webp" alt="" class="preview-card__image" />
    </div>
    <div class="preview-card__body">
      <div class="preview-card__seller">${order?.getContactInformation()?.name}</div>
      <div class="preview-card__heading">
        <span class="preview-card__title">${vehicle?.title}</span> ${vehicle?.shortDescription}
      </div>
      <div class="preview-card__footer">
        <div class="preview-card__price">${vehicle?.price} kr</div>
        <div class="preview-card__branding">
          <img src="http://placehold.it/70x13" alt="" class="preview-card__branding-logo" />
        </div>
      </div>
    </div>
  </div>
`;

export default ItemTileSmall;
