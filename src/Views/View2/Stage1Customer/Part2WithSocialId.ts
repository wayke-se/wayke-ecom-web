import { IAddress } from '@wayke-se/ecom';
import { Customer, CustomerSocialId } from '../../../@types/Customer';
import ButtonArrowRight from '../../../Components/ButtonArrowRight';
import InputField from '../../../Components/InputField';
import { getAddressBySsn } from '../../../Data/getAddress';
import { setSocialIdAndAddress } from '../../../Redux/action';
import store from '../../../Redux/store';
import Alert from '../../../Templates/Alert';
import { validationMethods } from '../../../Utils/validationMethods';

const SOCIAL_ID_NODE = 'contact-socialId-node';
const SOCIAL_ID_INPUT_ID = 'contact-socialId';
const SOCIAL_ID_ERROR_ID = `${SOCIAL_ID_INPUT_ID}-error`;
const SOCIAL_ID_FETCH_ERROR_ID = `${SOCIAL_ID_INPUT_ID}-fetch-error`;

const PROCEED = `${SOCIAL_ID_INPUT_ID}-proceed`;
const PROCEED_NODE = `${SOCIAL_ID_INPUT_ID}-proceed-node`;

const LINK_TOGGLE_METHOD_NODE = 'link-toggle-method-node';
const LINK_TOGGLE_METHOD = 'link-toggle-method';

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

const SOCIAL_ID_CACHE: { [key: string]: IAddress | undefined } = {};

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

class Part2WithSocialId {
  private element: HTMLDivElement;
  private state: Part2SocialIdState;
  private onToggleMethod: () => void;

  constructor(element: HTMLDivElement, onToggleMethod: () => void) {
    this.element = element;
    this.onToggleMethod = onToggleMethod;

    const state = store.getState();
    this.state = initalState(state.customer);

    this.render();
  }

  async onFetchAddress() {
    const errorAlert = document.querySelector<HTMLDivElement>(`#${SOCIAL_ID_FETCH_ERROR_ID}`);
    if (!errorAlert) return;
    errorAlert.style.display = 'none';
    const proceed = this.element.querySelector<HTMLDivElement>(`#${PROCEED}`);
    const toggle = this.element.querySelector<HTMLDivElement>(`#${LINK_TOGGLE_METHOD}`);
    if (proceed && toggle) {
      const cache = SOCIAL_ID_CACHE[this.state.value.socialId];
      if (cache) {
        setSocialIdAndAddress(this.state.value.socialId, cache);
        return;
      }

      try {
        if (this.state.validation.socialId) {
          proceed.setAttribute('disabled', '');
          toggle.setAttribute('disabled', '');
          const response = await getAddressBySsn(this.state.value.socialId);
          const address = response.getAddress();
          SOCIAL_ID_CACHE[this.state.value.socialId] = address;
          setSocialIdAndAddress(this.state.value.socialId, address);
        }
      } catch (e) {
        errorAlert.style.display = '';
      } finally {
        proceed.removeAttribute('disabled');
        toggle.removeAttribute('disabled');
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

  render() {
    this.element.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <hr class="waykeecom-separator" />
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <div class="waykeecom-stack waykeecom-stack--3" id="${SOCIAL_ID_NODE}"></div>

        <div class="waykeecom-stack waykeecom-stack--3" style="display:none;" id="${SOCIAL_ID_FETCH_ERROR_ID}">
          ${Alert({
            tone: 'error',
            children: '<p>Tyvärr fick vi ingen träff på personnumret du angav.</p>',
          })}
        </div>
        
        <div class="waykeecom-stack waykeecom-stack--3">
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
      </div>
      <div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_NODE}"></div>
      <div class="waykeecom-stack waykeecom-stack--3" id="${LINK_TOGGLE_METHOD_NODE}"></div>
    `;

    new InputField(this.element.querySelector<HTMLDivElement>(`#${SOCIAL_ID_NODE}`), {
      title: 'Epost',
      value: this.state.value.socialId,
      id: SOCIAL_ID_INPUT_ID,
      errorId: SOCIAL_ID_ERROR_ID,
      error: this.state.interact.socialId && !this.state.validation.socialId,
      errorMessage: 'Ange personnummer i formatet ÅÅÅÅMMDD-XXXX',
      name: 'socialId',
      placeholder: 'ÅÅÅÅMMDD-XXXX',
      onChange: (e) => this.onChange(e),
      onBlur: (e) => this.onBlur(e),
    });

    Object.keys(this.state.value).forEach((key) =>
      this.updateUiError(key as keyof CustomerSocialId)
    );

    new ButtonArrowRight(this.element.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
      title: 'Hämta uppgifter',
      id: PROCEED,
      onClick: () => this.onFetchAddress(),
    });

    new ButtonArrowRight(
      this.element.querySelector<HTMLDivElement>(`#${LINK_TOGGLE_METHOD_NODE}`),
      {
        title: 'Jag vill hämta uppgifter med Mobilt BankID',
        id: LINK_TOGGLE_METHOD,
        onClick: () => this.onToggleMethod(),
      }
    );

    this.updateProceedButton();
  }
}

export default Part2WithSocialId;
