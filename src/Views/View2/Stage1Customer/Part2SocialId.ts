import { IAddress } from '@wayke-se/ecom';
import { Customer, CustomerSocialId } from '../../../@types/Customer';
import Alert from '../../../Templates/Alert';
import { getAddressBySsn } from '../../../Data/getAddress';
import { setSocialIdAndAddress } from '../../../Redux/action';
import store from '../../../Redux/store';
import { validationMethods } from '../../../Utils/validationMethods';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import ButtonArrowRight from '../../../Components/ButtonArrowRight';
import InputField from '../../../Components/InputField';

const SOCIAL_ID_NODE = 'contact-socialId-node';
const SOCIAL_ID_INPUT_ID = 'contact-socialId';
const SOCIAL_ID_ERROR_ID = `${SOCIAL_ID_INPUT_ID}-error`;
const SOCIAL_ID_FETCH_ERROR_ID = `${SOCIAL_ID_INPUT_ID}-fetch-error`;

const PROCEED = `${SOCIAL_ID_INPUT_ID}-proceed`;
const PROCEED_NODE = `${SOCIAL_ID_INPUT_ID}-proceed-node`;

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

  render() {
    const subStage = store.getState().navigation.subStage;

    if (subStage > 2) {
      const keyValueItems: { key: string; value: string }[] = [
        { key: 'Personnummer', value: this.state.value.socialId },
      ];

      this.element.innerHTML = `
      <div class="stack stack--2">
        <ul class="key-value-list">
        ${keyValueItems.map((kv) => KeyValueListItem(kv)).join('')}
        </ul>
      </div>
      `;
    } else {
      this.element.innerHTML = `
      <div class="stack stack--2">
        <hr class="separator" />
      </div>
      <div class="stack stack--2">
        <div class="stack stack--3" id="${SOCIAL_ID_NODE}"></div>

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
        <div class="stack stack--3" id="${PROCEED_NODE}"></div>
      </div>
    `;

      const socialIdNode = this.element.querySelector<HTMLDivElement>(`#${SOCIAL_ID_NODE}`);
      if (socialIdNode) {
        new InputField(socialIdNode, {
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
      }

      Object.keys(this.state.value).forEach((key) =>
        this.updateUiError(key as keyof CustomerSocialId)
      );

      const proceedNode = this.element.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`);
      if (proceedNode) {
        new ButtonArrowRight(proceedNode, {
          title: 'Hämta uppgifter',
          id: PROCEED,
          onClick: () => this.onFetchAddress(),
        });
      }

      this.updateProceedButton();
    }
  }
}

export default Part2SocialId;
