import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { Vehicle } from '../../App';

interface ItemProps {
  vehicle: Vehicle;
  order?: OrderOptionsResponse;
}

const Item = ({ vehicle, order }: ItemProps) => `
  <div class="stack stack--3">
    <div style="border: 1px solid black">
      <img src="${vehicle.imageUrl}"/>

      <div>${order?.getContactInformation()?.name}</div>
      <p><b>${vehicle.title}</b> ${vehicle.shortDescription}</p>
      <p>${vehicle.price} kr</p>
    </div>
  </div>
`;

export default Item;
