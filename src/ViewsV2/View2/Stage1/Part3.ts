import { restartContact } from '../../../Redux/action';
import store from '../../../Redux/store';
import { maskSSn, maskText } from '../../../Utils/mask';

const CHANGE_BUTTON = 'contact-change-button';

class Part3 {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  onChange() {
    restartContact();
  }

  render() {
    const state = store.getState();
    this.element.innerHTML = `
      <div class="stack stack--1">
          <ul class="key-value-list">
            <li class="key-value-list__item">
              <div class="key-value-list__key">E-post</div>
              <div class="key-value-list__value">${state.customer.email}</div>
            </li>
            <li class="key-value-list__item">
              <div class="key-value-list__key">Telefonnummer</div>
              <div class="key-value-list__value">${state.customer.phone}</div>
            </li>
            <li class="key-value-list__item">
              <div class="key-value-list__key">Personnummer</div>
              <div class="key-value-list__value">${maskSSn(state.customer.socialId)}</div>
            </li>
            ${
              state.address &&
              `
              <li class="key-value-list__item">
                <div class="key-value-list__key">Namn</div>
                <div class="key-value-list__value">${maskText(state.address.givenName)} ${maskText(
                state.address.surname
              )}</div>
              </li>
              <li class="key-value-list__item">
                <div class="key-value-list__key">Adress</div>
                <div class="key-value-list__value">${state.address.street}</div>
              </li>
              <li class="key-value-list__item">
                <div class="key-value-list__key">Postnummer</div>
                <div class="key-value-list__value">${state.address.postalCode}</div>
              </li>
              <li class="key-value-list__item">
                <div class="key-value-list__key">Stad</div>
                <div class="key-value-list__value">${state.address.city}</div>
              </li>
            `
            }
          </ul>
        </div>
        <div class="stack stack--1">
          <button id="${CHANGE_BUTTON}" title="Ändra dina uppgifter" class="link">Ändra</button>
        </div>
    `;
    this.element
      .querySelector(`#${CHANGE_BUTTON}`)
      ?.addEventListener('click', () => this.onChange());
  }
}

export default Part3;
