import { IAddress } from '@wayke-se/ecom';
import { Customer, CustomerSocialId } from '../../../@types/Customer';
import AppendChild from '../../../Components/Extension/AppendChild';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonAsLink from '../../../Components/Button/ButtonAsLink';
import InputField from '../../../Components/Input/InputField';
import { getAddressBySsn } from '../../../Data/getAddress';
import { setSocialIdAndAddress } from '../../../Redux/action';
import store from '../../../Redux/store';
import Alert from '../../../Templates/Alert';
import { renderConditional } from '../../../Utils/render';
import { validationMethods } from '../../../Utils/validationMethods';

const SOCIAL_ID_NODE = 'contact-socialId-node';
const SOCIAL_ID_INPUT_ID = 'contact-socialId';
const SOCIAL_ID_INFO = 'contact-social-id-info';

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

class FullAddressBySocialId extends AppendChild {
  private lastStage: boolean;
  private state: Part2SocialIdState;
  private requestError: boolean = false;
  private contexts: {
    socialId?: InputField;
    buttonFetch?: ButtonArrowRight;
    buttonLinkToggle?: ButtonAsLink;
  } = {};
  private onToggleMethod: () => void;

  constructor(element: HTMLElement, lastStage: boolean, onToggleMethod: () => void) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--2' });
    this.lastStage = lastStage;
    this.onToggleMethod = onToggleMethod;

    const state = store.getState();
    this.state = initalState(state.customer);

    this.render();
  }

  async onFetchAddress() {
    this.requestError = false;
    this.render();

    try {
      const cache = SOCIAL_ID_CACHE[this.state.value.socialId];
      if (cache) {
        setSocialIdAndAddress(this.state.value.socialId, cache, this.lastStage);
        return;
      }
      this.contexts.buttonFetch?.loading(true);
      this.contexts.buttonLinkToggle?.disabled(true);

      const response = await getAddressBySsn(this.state.value.socialId);
      const address = response.getAddress();
      SOCIAL_ID_CACHE[this.state.value.socialId] = address;
      setSocialIdAndAddress(this.state.value.socialId, address, this.lastStage);
    } catch (e) {
      this.requestError = true;
    } finally {
      this.contexts.buttonFetch?.loading(false);
      this.contexts.buttonLinkToggle?.disabled(false);
      this.render();
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
    this.contexts[name]?.setError(this.state.interact[name] && !this.state.validation[name]);
  }

  updateProceedButton() {
    this.contexts.buttonFetch?.disabled(!this.state.validation.socialId);
  }

  render() {
    this.content.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <hr class="waykeecom-separator" />
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <div class="waykeecom-stack waykeecom-stack--3">
          <h4 class="waykeecom-heading waykeecom-heading--4">Personuppgifter</h4>
          <div class="waykeecom-content">
            <p>Ange ditt personnummer för att hämta ditt namn och din adress.</p>
          </div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${SOCIAL_ID_NODE}"></div>

        ${renderConditional(
          this.requestError,
          `
          <div class="waykeecom-stack waykeecom-stack--3" id="${SOCIAL_ID_NODE}">
            ${Alert({
              tone: 'error',
              children: '<p>Tyvärr fick vi ingen träff på personnumret du angav.</p>',
            })}
          </div>`
        )}
        <div class="waykeecom-stack waykeecom-stack--3" id="${SOCIAL_ID_INFO}">
          ${Alert({
            tone: 'info',
            children: `
              <p>Vi kommer hämta följande uppgifter om dig:</p>
              <ul>
                <li>Namn</li>
                <li>Folkbokföringsadress</li>
              </ul>
            `,
          })}
        </div>
        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--2" id="${PROCEED_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--2">
            <div class="waykeecom-disclaimer">
              <div class="waykeecom-disclaimer__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  class="waykeecom-icon"
                >
                  <title>Ikon: hänlås</title>
                  <path d="M13 6h-1V4c0-2.2-1.8-4-4-4S4 1.8 4 4v2H3c-1.1 0-2 .9-2 2v8h14V8c0-1.1-.9-2-2-2zM6 4c0-1.1.9-2 2-2s2 .9 2 2v2H6V4zm7 10H3V8h10v6z" />
                </svg>
              </div>
              <div class="waykeecom-disclaimer__text">
                Dina uppgifter lagras och sparas säkert. Läs mer i vår <a href="#" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">personuppgiftspolicy</a>.
              </div>
            </div>
          </div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-text-center" id="${LINK_TOGGLE_METHOD_NODE}"></div>
        </div>
      </div>
    `;

    this.contexts.socialId = new InputField(
      this.content.querySelector<HTMLDivElement>(`#${SOCIAL_ID_NODE}`),
      {
        title: 'Personnummer',
        value: this.state.value.socialId,
        id: SOCIAL_ID_INPUT_ID,
        error: this.state.interact.socialId && !this.state.validation.socialId,
        errorMessage: 'Ange personnummer i formatet ÅÅÅÅMMDD-XXXX.',
        name: 'socialId',
        placeholder: 'ÅÅÅÅMMDD-XXXX',
        onChange: (e) => this.onChange(e),
        onBlur: (e) => this.onBlur(e),
      }
    );

    Object.keys(this.state.value).forEach((key) =>
      this.updateUiError(key as keyof CustomerSocialId)
    );

    this.contexts.buttonFetch = new ButtonArrowRight(
      this.content.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`),
      {
        title: 'Hämta uppgifter',
        id: PROCEED,
        disabled: !this.state.validation.socialId,
        onClick: () => this.onFetchAddress(),
      }
    );

    this.contexts.buttonLinkToggle = new ButtonAsLink(
      this.content.querySelector<HTMLDivElement>(`#${LINK_TOGGLE_METHOD_NODE}`),
      {
        title: 'Jag vill hämta uppgifter med Mobilt BankID',
        id: LINK_TOGGLE_METHOD,
        onClick: () => this.onToggleMethod(),
      }
    );

    this.updateProceedButton();
  }
}

export default FullAddressBySocialId;
