import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Vehicle } from '../App';

interface ItemTileLargeProps {
  vehicle: Vehicle;
  order?: OrderOptionsResponse;
}

const ItemTileLarge = ({ vehicle, order }: ItemTileLargeProps) => `
  <div class="stack stack--3">
    <div class="product-card">
      <div class="product-card__media">
        <div class="product-card__media-item">
          <img src="${
            vehicle.imageUrls[0]
          }?spec=800x&format=webp" alt="" class="product-card__image" />
        </div>
        <div class="product-card__media-item">
          <img src="${
            vehicle.imageUrls[0]
          }?spec=800x&format=webp" alt="" class="product-card__image" />
        </div>
        <div class="product-card__media-item">
          <img src="${
            vehicle.imageUrls[0]
          }?spec=800x&format=webp" alt="" class="product-card__image" />
          <div class="product-card__media-item-overlay">+10</div>
        </div>
      </div>
      <div class="product-card__body">
        <div class="product-card__seller">
          ${order?.getContactInformation()?.name}
        </div>
        <div class="product-card__heading">
          <span class="product-card__title">${vehicle.title}</span> ${vehicle.shortDescription}
        </div>
        <div class="product-card__footer">
          <div class="product-card__price">${vehicle.price} kr</div>
          <div class="product-card__branding">
            <img src="http://placehold.it/70x13" alt="" class="product-card__branding-logo" />
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export default ItemTileLarge;
