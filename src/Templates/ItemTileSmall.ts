import { OrderOptions } from '../@types/OrderOptions';
import { Vehicle } from '../@types/Vehicle';
import { waykeImage } from '../Utils/cdn';
import { formatShortDescription, prettyNumber } from '../Utils/format';

interface ItemTileSmallProps {
  vehicle?: Vehicle;
  order?: OrderOptions;
}

const ItemTileSmall = ({ vehicle, order }: ItemTileSmallProps) => {
  const imageUrl = vehicle?.imageUrls?.[0];
  const vehicleTitle = vehicle?.title;
  const price = prettyNumber(vehicle?.price || NaN);

  const sellerName = order?.contactInformation?.name;

  return `
  <div class="waykeecom-preview-card">
  ${
    imageUrl
      ? `
    <div class="waykeecom-preview-card__media">
      <img src="${waykeImage(imageUrl, { width: 225, format: 'webp' })}" alt="" class="waykeecom-preview-card__image" />
    </div>
    `
      : ''
  }
    <dl class="waykeecom-preview-card__body">
      <dt class="waykeecom-sr-only">Säljare</dt>
      <dd class="waykeecom-preview-card__seller">${sellerName}</dd>
      <dt class="waykeecom-sr-only">Modell</dt>
      <dd class="waykeecom-preview-card__heading">
        <span class="waykeecom-preview-card__title">${vehicleTitle}</span> ${formatShortDescription(
          vehicle
        )}
      </dd>
      <dt class="waykeecom-sr-only">Pris</dt>
      <dd class="waykeecom-preview-card__price">${price} kr</dd>
    </dl>
  </div>
`;
};

export default ItemTileSmall;
