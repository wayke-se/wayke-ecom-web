import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Vehicle } from '../App';

interface ItemTileLargeProps {
  vehicle: Vehicle;
  order?: OrderOptionsResponse;
}

const ItemTileLarge = ({ vehicle, order }: ItemTileLargeProps) => `
  <div class="stack stack--3">
    <div style="border: 1px solid black">
      <img src="${vehicle.imageUrls[0]}?spec=80x&format=webp"/>

      <div>${order?.getContactInformation()?.name}</div>
      <p><b>${vehicle.title}</b> ${vehicle.shortDescription}</p>
      <p>${vehicle.price} kr</p>
    </div>
  </div>
`;

export default ItemTileLarge;
