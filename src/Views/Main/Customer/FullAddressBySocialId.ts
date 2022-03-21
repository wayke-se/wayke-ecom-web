import { Customer, CustomerSocialId } from '../../../@types/Customer';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonAsLink from '../../../Components/Button/ButtonAsLink';
import InputField from '../../../Components/Input/InputField';
import { getAddressBySsn } from '../../../Data/getAddress';
import { setSocialIdAndAddress } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import Alert from '../../../Templates/Alert';
import { renderConditional } from '../../../Utils/render';
import { validationMethods } from '../../../Utils/validationMethods';
import DisclaimerSafe from './DisclaimerSafe';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { regexNumber } from '../../../Utils/regex';

const SOCIAL_ID_NODE = 'contact-socialId-node';
const SOCIAL_ID_INPUT_ID = 'contact-socialId';
const SOCIAL_ID_INFO = 'contact-social-id-info';

const PROCEED = `${SOCIAL_ID_INPUT_ID}-proceed`;
const PROCEED_NODE = `${SOCIAL_ID_INPUT_ID}-proceed-node`;

const DISCLAIMER_SAFE_NODE = 'address-disclaimer-node';

const validation = {
  socialId: validationMethods.requiredSsnOver18,
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

interface FullAddressBySocialIdProps {
  readonly store: WaykeStore;
  readonly lastStage: boolean;
}

class FullAddressBySocialId extends HtmlNode {
  private readonly props: FullAddressBySocialIdProps;
  private state: Part2SocialIdState;
  private requestError: boolean = false;
  private contexts: {
    socialId?: InputField;
    buttonFetch?: ButtonArrowRight;
    buttonLinkToggle?: ButtonAsLink;
  } = {};

  constructor(element: HTMLElement, props: FullAddressBySocialIdProps) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--2' });
    this.props = props;

    const state = this.props.store.getState();
    this.state = initalState(state.customer);

    this.render();
  }

  private async onFetchAddress() {
    const { store, lastStage } = this.props;
    this.requestError = false;
    this.render();

    try {
      this.contexts.buttonFetch?.loading(true);

      const response = await getAddressBySsn(this.state.value.socialId);
      const address = response.getAddress();
      setSocialIdAndAddress(
        this.state.value.socialId.replace(regexNumber, ''),
        address,
        lastStage
      )(store.dispatch);
    } catch (e) {
      this.requestError = true;
    } finally {
      this.contexts.buttonFetch?.loading(false);
      this.render();
    }
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof CustomerSocialId;
    const value = currentTarget.value;

    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  private onBlur(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof CustomerSocialId;

    this.state.interact[name] = true;
    this.state.validation[name] = validation[name](this.state.value[name]);
    this.updateUiError(name);
    this.updateProceedButton();
  }

  private updateUiError(name: keyof SocialIdValidation) {
    this.contexts[name]?.setError(this.state.interact[name] && !this.state.validation[name]);
  }

  private updateProceedButton() {
    this.contexts.buttonFetch?.disabled(!this.state.validation.socialId);
  }

  render() {
    this.node.innerHTML = `
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
          <div class="waykeecom-stack waykeecom-stack--2" id="${DISCLAIMER_SAFE_NODE}"></div>
        </div>
      </div>
    `;

    this.contexts.socialId = new InputField(
      this.node.querySelector<HTMLDivElement>(`#${SOCIAL_ID_NODE}`),
      {
        title: 'Personnummer',
        value: this.state.value.socialId,
        id: SOCIAL_ID_INPUT_ID,
        error: this.state.interact.socialId && !this.state.validation.socialId,
        errorMessage: 'Ange personnummer i formatet ÅÅÅÅMMDD-XXXX. Måste vara över 18 år.',
        name: 'socialId',
        placeholder: 'ÅÅÅÅMMDD-XXXX',
        pattern: '[0-9]*',
        inputmode: 'numeric',
        onChange: (e) => this.onChange(e),
        onBlur: (e) => this.onBlur(e),
      }
    );

    Object.keys(this.state.value).forEach((key) =>
      this.updateUiError(key as keyof CustomerSocialId)
    );

    this.contexts.buttonFetch = new ButtonArrowRight(
      this.node.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`),
      {
        title: 'Hämta uppgifter',
        id: PROCEED,
        disabled: !this.state.validation.socialId,
        onClick: () => this.onFetchAddress(),
      }
    );

    new DisclaimerSafe(this.node.querySelector(`#${DISCLAIMER_SAFE_NODE}`));

    this.updateProceedButton();
  }
}

export default FullAddressBySocialId;
