import { IOrderVehicle } from '@wayke-se/ecom/dist-types/orders/types';
import { OrderOptions } from '../@types/OrderOptions';
import { toCdnMedia } from '../Utils/cdn';
import { formatShortDescription, prettyNumber } from '../Utils/format';

interface ItemTileLargeProps {
  vehicle?: IOrderVehicle;
  order?: OrderOptions;
  meta?: string;
  cdnMedia?: string;
}

const ItemTileLarge = ({ vehicle, order, meta, cdnMedia }: ItemTileLargeProps) => {
  const imageUrls = vehicle?.imageUrls;
  const vehicleTitle = vehicle?.title;
  const price = prettyNumber(vehicle?.price || NaN);

  const sellerName = order?.contactInformation?.name;
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
                <img src="${toCdnMedia(imageUrl, cdnMedia)}?spec=800x&format=webp" alt="" class="waykeecom-product-card__image" />
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
        <span class="waykeecom-product-card__title">${vehicleTitle}</span> ${formatShortDescription(
          vehicle
        )}
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
