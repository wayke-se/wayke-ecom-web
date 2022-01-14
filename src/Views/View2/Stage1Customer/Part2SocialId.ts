import { IAddress } from '@wayke-se/ecom';
import { Customer, CustomerSocialId } from '../../../@types/Customer';
import Alert from '../../../Components/Alert';
import { getAddressBySsn } from '../../../Data/getAddress';
import { setSocialIdAndAddress } from '../../../Redux/action';
import store from '../../../Redux/store';
import { validationMethods } from '../../../Utils/validationMethods';

const SOCIAL_ID_INPUT_ID = 'contact-socialId';
const SOCIAL_ID_ERROR_ID = `${SOCIAL_ID_INPUT_ID}-error`;
const SOCIAL_ID_FETCH_ERROR_ID = `${SOCIAL_ID_INPUT_ID}-fetch-error`;

const PROCEED = `${SOCIAL_ID_INPUT_ID}-proceed`;

const validation = {
  socialId: validationMethods.requiredSsn,
};

export interface SocialIdValidation {
  socialId: boolean;
}

interface Part2SocialIdState {
  value: CustomerSocialId;
  validation: SocialIdValidation;
  interact: SocialIdValidation;
}

const initalState = (customer?: Customer): Part2SocialIdState => {
  const value = {
    socialId: customer?.socialId || '',
  };
  return {
    value,
    validation: {
      socialId: validation.socialId(value.socialId),
    },
    interact: { socialId: false },
  };
};

const SOCIAL_ID_CACHE: { [key: string]: IAddress | undefined } = {};

class Part2SocialId {
  private element: HTMLDivElement;
  private state: Part2SocialIdState;

  constructor(element: HTMLDivElement) {
    this.element = element;

    const state = store.getState();
    this.state = initalState(state.customer);

    this.render();
  }

  async onFetchAddress() {
    const errorAlert = document.querySelector<HTMLDivElement>(`#${SOCIAL_ID_FETCH_ERROR_ID}`);
    if (!errorAlert) return;
    errorAlert.style.display = 'none';

    const proceed = this.element.querySelector<HTMLDivElement>(`#${PROCEED}`);
    if (proceed) {
      const cache = SOCIAL_ID_CACHE[this.state.value.socialId];
      if (cache) {
        setSocialIdAndAddress(this.state.value.socialId, cache);
        return;
      }

      try {
        if (this.state.validation.socialId) {
          proceed.setAttribute('disabled', '');
          const response = await getAddressBySsn(this.state.value.socialId);
          const address = response.getAddress();
          SOCIAL_ID_CACHE[this.state.value.socialId] = address;
          setSocialIdAndAddress(this.state.value.socialId, address);
        }
      } catch (e) {
        errorAlert.style.display = '';
      } finally {
        proceed.removeAttribute('disabled');
      }
    }
  }

  onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof CustomerSocialId;
    const value = currentTarget.value;

    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  onBlur(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof CustomerSocialId;

    this.state.interact[name] = true;
    this.state.validation[name] = validation[name](this.state.value[name]);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  updateUiError(name: keyof SocialIdValidation) {
    const errorElement = this.element.querySelector<HTMLDivElement>(`#contact-${name}-error`);
    if (errorElement) {
      if (this.state.interact[name] && !this.state.validation[name]) {
        errorElement.style.display = '';
      } else {
        errorElement.style.display = 'none';
      }
    }
  }

  updateProceedButton() {
    const proceed = this.element.querySelector<HTMLButtonElement>(`#${PROCEED}`);
    if (proceed) {
      if (this.state.validation.socialId) {
        proceed.removeAttribute('disabled');
      } else {
        proceed.setAttribute('disabled', '');
      }
    }
  }

  attach(element: HTMLInputElement) {
    element.addEventListener('input', (e) => this.onChange(e));
    element.addEventListener('blur', (e) => this.onBlur(e));
  }

  render() {
    const subStage = store.getState().navigation.subStage;

    if (subStage > 2) {
      this.element.innerHTML = `
      <div class="stack stack--2">
        <ul class="key-value-list">
          <li class="key-value-list__item">
            <div class="key-value-list__key">Personnummer</div>
            <div class="key-value-list__value">${this.state.value.socialId}</div>
          </li>
        </ul>
      </div>
      `;
    } else {
      this.element.innerHTML = `
      <div class="stack stack--2">
        <hr class="separator" />
      </div>
      <div class="stack stack--2">
        <div class="stack stack--3">
          <div class="input-label">
            <label for="${SOCIAL_ID_INPUT_ID}" class="input-label__label">Personnummer</label>
          </div>
          <input
            id="${SOCIAL_ID_INPUT_ID}"
            value="${this.state.value.socialId}"
            name="socialId"
            placeholder="ÅÅÅÅMMDD-XXXX"
            class="input-text"
          />
          <div id="${SOCIAL_ID_ERROR_ID}" class="input-error">Ange personnummer i formatet ÅÅÅÅMMDD-XXXX</div>
        </div>

        <div class="stack stack--3" style="display:none;" id="${SOCIAL_ID_FETCH_ERROR_ID}">
          ${Alert({
            tone: 'error',
            children: '<p>Tyvärr fick vi ingen träff på personnumret du angav.</p>',
          })}
        </div>
        
        <div class="stack stack--3">
          ${Alert({
            tone: 'info',
            children: `
              <p>Vi kommer hämta följande uppgifter om dig:</p>
              <ul>
                <li>Personnummer</li>
                <li>Namn</li>
                <li>Folkbokföringsadress</li>
              </ul>
            `,
          })}
        </div>
        <div class="stack stack--3">
          <wayke-alert tone="error">
            <div slot="content">
              <p>Vi kommer hämta följande uppgifter om dig:</p>
              <ul>
                <li>Personnummer</li>
                <li>Namn</li>
                <li>Folkbokföringsadress</li>
              </ul>
            </div>
          </wayke-alert>
        </div>
      </div>
      <div class="stack stack--3">
        <button type="button" id="${PROCEED}" title="Fortsätt till nästa steg" class="button button--full-width button--action">
          <span class="button__content">Hämta uppgifter</span>
          <span class="button__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="icon"
            >
              <title>Ikon: pil höger</title>
              <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
            </svg>
          </span>
        </button>
      </div>
    `;

      const emailElement = this.element.querySelector<HTMLInputElement>(`#${SOCIAL_ID_INPUT_ID}`);
      if (emailElement) {
        this.attach(emailElement);
      }

      const proceed = this.element.querySelector<HTMLButtonElement>(`#${PROCEED}`);
      if (proceed) {
        proceed.addEventListener('click', () => this.onFetchAddress());
      }

      Object.keys(this.state.value).forEach((key) =>
        this.updateUiError(key as keyof CustomerSocialId)
      );

      this.updateProceedButton();
    }
  }
}

export default Part2SocialId;
