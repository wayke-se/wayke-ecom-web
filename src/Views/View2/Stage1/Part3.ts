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
      <div class="stack stack--1">
        <ul class="key-value-list">
          <li class="key-value-list__item">
            <div class="key-value-list__key">E-post</div>
            <div class="key-value-list__value">${this.props.customer.email}</div>
          </li>
          <li class="key-value-list__item">
            <div class="key-value-list__key">Telefonnummer</div>
            <div class="key-value-list__value">${this.props.customer.phone}</div>
          </li>
          <li class="key-value-list__item">
            <div class="key-value-list__key">Personnummer</div>
            <div class="key-value-list__value">${maskSSn(this.props.customer.socialId)}</div>
          </li>
          ${
            this.props.address &&
            `
            <li class="key-value-list__item">
              <div class="key-value-list__key">Namn</div>
              <div class="key-value-list__value">${maskText(
                this.props.address.givenName
              )} ${maskText(this.props.address.surname)}</div>
            </li>
            <li class="key-value-list__item">
              <div class="key-value-list__key">Adress</div>
              <div class="key-value-list__value">${this.props.address.street}</div>
            </li>
            <li class="key-value-list__item">
              <div class="key-value-list__key">Postnummer</div>
              <div class="key-value-list__value">${this.props.address.postalCode}</div>
            </li>
            <li class="key-value-list__item">
              <div class="key-value-list__key">Stad</div>
              <div class="key-value-list__value">${this.props.address.city}</div>
            </li>
          `
          }
        </ul>
      </div>
      <div class="stack stack--1">
        <button title="Ändra dina uppgifter" class="link">Ändra</button>
      </div>
    `;
    this.props.content
      .querySelector('button')
      ?.addEventListener('click', () => this.props.onEdit());
  }
}

export default Part3;
