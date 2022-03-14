import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Vehicle } from '../@types/Vehicle';
import { prettyNumber } from '../Utils/format';

interface ItemTileSmallProps {
  vehicle?: Vehicle;
  order?: OrderOptionsResponse;
}

const ItemTileSmall = ({ vehicle, order }: ItemTileSmallProps) => {
  const imageUrl = vehicle?.imageUrls?.[0];
  const vehicleTitle = vehicle?.title;
  const shortDescription = vehicle?.shortDescription;
  const price = prettyNumber(vehicle?.price || NaN);

  const sellerName = order?.getContactInformation()?.name;

  return `
  <div class="waykeecom-preview-card">
  ${
    imageUrl
      ? `
    <div class="waykeecom-preview-card__media">
      <img src="${imageUrl}?spec=200x&format=webp" alt="" class="waykeecom-preview-card__image" />
    </div>
    `
      : ''
  }
    <div class="waykeecom-preview-card__body">
      <div class="waykeecom-preview-card__seller">${sellerName}</div>
      <div class="waykeecom-preview-card__heading">
        <span class="waykeecom-preview-card__title">${vehicleTitle}</span> ${shortDescription}
      </div>
      <div class="waykeecom-preview-card__footer">
        <div class="waykeecom-preview-card__price">${price} kr</div>
      </div>
    </div>
  </div>
`;
};

export default ItemTileSmall;
