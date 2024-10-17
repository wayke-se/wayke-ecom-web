import { OrderOptions } from '../@types/OrderOptions';
import { Vehicle } from '../@types/Vehicle';
import { toCdnMedia } from '../Utils/cdn';
import { formatShortDescription, prettyNumber } from '../Utils/format';

interface ItemTileSmallProps {
  vehicle?: Vehicle;
  order?: OrderOptions;
  cdnMedia?: string;
}

const ItemTileSmall = ({ vehicle, order, cdnMedia }: ItemTileSmallProps) => {
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
      <img src="${toCdnMedia(imageUrl, cdnMedia)}?spec=200x&format=webp" alt="" class="waykeecom-preview-card__image" />
    </div>
    `
      : ''
  }
    <div class="waykeecom-preview-card__body">
      <div class="waykeecom-preview-card__seller">${sellerName}</div>
      <div class="waykeecom-preview-card__heading">
        <span class="waykeecom-preview-card__title">${vehicleTitle}</span> ${formatShortDescription(
          vehicle
        )}
      </div>
      <div class="waykeecom-preview-card__footer">
        <div class="waykeecom-preview-card__price">${price} kr</div>
      </div>
    </div>
  </div>
`;
};

export default ItemTileSmall;
