import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Vehicle } from '../App';

interface ItemTileSmallProps {
  vehicle: Vehicle;
  order?: OrderOptionsResponse;
}

const ItemTileSmall = ({ vehicle, order }: ItemTileSmallProps) => `
  <div>
    <img src="${vehicle.imageUrls[0]}?spec=80x&format=webp"/>

    <div>${order?.getContactInformation()?.name}</div>
    <p><b>${vehicle.title}</b> ${vehicle.shortDescription}</p>
    <p>${vehicle.price} kr</p>
  </div>
`;

export default ItemTileSmall;
