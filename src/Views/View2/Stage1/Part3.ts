import { IAddress } from '@wayke-se/ecom';
import { Customer } from '..';
import { maskSSn, maskText } from '../../../Utils/mask';

interface Part3Props {
  customer: Customer;
  address?: IAddress;
  content: HTMLDivElement;
  onEdit: () => void;
}

class Part3 {
  private props: Part3Props;

  constructor(props: Part3Props) {
    this.props = props;
    this.render();
  }

  render() {
    this.props.content.innerHTML = `
        <div>
          <p><b>E-post</b>: ${this.props.customer.email}</p>
          <p><b>Telefonnummer</b>: ${this.props.customer.phone}</p>
          <p><b>Personnummer</b>: ${maskSSn(this.props.customer.socialId)}</p>

          ${
            this.props.address &&
            `
              <p><b>Namn</b>: ${maskText(this.props.address.givenName)} ${maskText(
              this.props.address.surname
            )}</p>
              <p><b>Gata</b>: ${this.props.address.street}</p>
              <p><b>Postnummer</b>: ${this.props.address.postalCode}</p>
              <p><b>Stad</b>: ${this.props.address.city}</p>
            `
          }

         
          <button>Ändra</button>
        </div>
      `;
    this.props.content
      .querySelector('button')
      ?.addEventListener('click', () => this.props.onEdit());
  }
}

export default Part3;
