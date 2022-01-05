import { IAddress } from '@wayke-se/ecom';
import { Stage1State } from '.';
import { getAddressBySsn } from '../../../Data/getAddress';

interface Stage1Part2Props {
  content: HTMLDivElement;
  id: string;
  state: Stage1State;
  edit: boolean;
  onChange: (e: Event) => void;
  onBlur: (e: Event) => void;
  onAddress: (address: IAddress) => void;
}

class Part2 {
  private props: Stage1Part2Props;

  constructor(props: Stage1Part2Props) {
    this.props = props;
    this.render();
  }

  attach(element: HTMLInputElement, name: 'socialId') {
    element.addEventListener('input', (e) => this.props.onChange(e));
    element.addEventListener('blur', (e) => this.props.onBlur(e));
    const emailError = this.props.content.querySelector<HTMLDivElement>(
      `#${this.props.id}-contact-${name}-error`
    );
    if (emailError) {
      if (this.props.state.interact[name] && !this.props.state.validation[name]) {
        emailError.style.display = '';
      } else {
        emailError.style.display = 'none';
      }
    }
  }

  async onFetchAddress() {
    try {
      if (this.props.state.validation.socialId) {
        const response = await getAddressBySsn(this.props.state.value.socialId);
        const address = response.getAddress();
        this.props.onAddress(address);
      }
    } catch (e) {
      throw e;
    }
  }

  render() {
    if (this.props.edit) {
      this.props.content.innerHTML = `
      <div class="stack stack--2">
        <hr class="separator" />
      </div>
      <div class="stack stack--2">
        <div class="stack stack--3">
          <div class="input-label">
            <label for="${this.props.id}-contact-socialId" class="input-label__label">Personnummer</label>
          </div>
          <input
            id="${this.props.id}-contact-socialId"
            value="${this.props.state.value.socialId}"
            name="socialId"
            placeholder="ÅÅÅÅMMDD-XXXX"
            class="input-text"
          />
          <div id="${this.props.id}-contact-socialId-error" class="input-error">Error</div>
        </div>
        <div class="stack stack--3">
          <div>ALERT</div>
        </div>
        <div class="stack stack--3">
          <div class="stack stack--2">
            <button id="${this.props.id}-contact-fetch-address" class="button button--full-width button--action">Hämta uppgifter</button>
          </div>
          <div class="stack stack--2">
            [ICON] Dina uppgifter lagras och sparas säkert. Läs mer i vår personsuppgiftspolicy.
          </div>
        </div>
      </div>
    `;

      const socialId = this.props.content.querySelector<HTMLInputElement>(
        `#${this.props.id}-contact-socialId`
      );
      if (socialId) {
        this.attach(socialId, 'socialId');
      }

      this.props.content
        .querySelector<HTMLButtonElement>(`#${this.props.id}-contact-fetch-address`)
        ?.addEventListener('click', () => this.onFetchAddress());
    } else {
      this.props.content.innerHTML = `
        <div>
          <p><b>Personnummer</b>: ${this.props.state.value.socialId}</p>
        </div>
      `;
    }
  }
}

export default Part2;
