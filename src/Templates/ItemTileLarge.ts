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
    <dl class="waykeecom-product-card__body">
      <dt class="waykeecom-sr-only">Säljare</dt>
      <dd class="waykeecom-product-card__seller">${sellerName}</dd>
      <dt class="waykeecom-sr-only">Modell</dt>
      <dd class="waykeecom-product-card__heading">
        <span class="waykeecom-product-card__title">${vehicleTitle}</span> ${formatShortDescription(
          vehicle
        )}
      </dd>
      <dt class="waykeecom-sr-only">Pris</dt>
      <dd class="waykeecom-product-card__price">${price} kr</dd>
      ${
        meta
          ? `
            <div class="waykeecom-product-card__meta">
              ${meta}
            </div>
          `
          : ''
      }
    </dl>
  </div>
`;
};

export default ItemTileLarge;
