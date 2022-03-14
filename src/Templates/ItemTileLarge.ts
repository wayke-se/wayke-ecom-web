import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { IOrderVehicle } from '@wayke-se/ecom/dist-types/orders/types';
import { prettyNumber } from '../Utils/format';

interface ItemTileLargeProps {
  vehicle?: IOrderVehicle;
  order?: OrderOptionsResponse;
  meta?: string;
}

const ItemTileLarge = ({ vehicle, order, meta }: ItemTileLargeProps) => {
  const imageUrls = vehicle?.imageUrls;
  const vehicleTitle = vehicle?.title;
  const shortDescription = vehicle?.shortDescription;
  const price = prettyNumber(vehicle?.price || NaN);

  const sellerName = order?.getContactInformation()?.name;
  return `
  <div class="waykeecom-product-card">
    ${
      imageUrls?.length
        ? `
          <div class="waykeecom-product-card__media">
            ${imageUrls
              .slice(0, 3)
              .map(
                (imageUrl) => `
              <div class="waykeecom-product-card__media-item">
                <img src="${imageUrl}?spec=800x&format=webp" alt="" class="waykeecom-product-card__image" />
              </div>
            `
              )
              .join('')}
          </div>
        `
        : ''
    }
    <div class="waykeecom-product-card__body">
      <div class="waykeecom-product-card__seller" aria-label="Säljare">
        ${sellerName}
      </div>
      <div class="waykeecom-product-card__heading" aria-label="Modell">
        <span class="waykeecom-product-card__title">${vehicleTitle}</span> ${shortDescription}
      </div>
      <div class="waykeecom-product-card__footer">
        <div class="waykeecom-product-card__price" aria-label="Pris">${price} kr</div>
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
};

export default ItemTileLarge;
