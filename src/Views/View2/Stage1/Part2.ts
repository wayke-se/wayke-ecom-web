import { IAddress } from '@wayke-se/ecom';
import { Stage1State } from '.';
import { getAddressBySsn } from '../../../Data/getAddress';

interface Stage1Part2Props {
  content: HTMLDivElement;
  id: string;
  state: Stage1State;
  edit: boolean;
  proceed: HTMLButtonElement;
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
          <div class="alert alert--info">
            <div class="alert__icon">
              <div class="alert__icon-badge">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  class="icon"
                >
                  <title>Ikon: info</title>
                  <path d="M7 6h2v8H7V6zm0-4v2h2V2H7z" />
                </svg>
              </div>
            </div>
            <div class="alert__content">
              <p>Vi kommer hämta följande uppgifter om dig:</p>
              <ul>
                <li>Personnummer</li>
                <li>Namn</li>
                <li>Folkbokföringsadress</li>
              </ul>
            </div>
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

      this.props.proceed.innerText = 'Hämta uppgifter';
      this.props.proceed.addEventListener('click', () => this.onFetchAddress());

      const disclaimer = document.createElement('div');
      disclaimer.innerHTML = `
        <div class="disclaimer m-t--2">
          <div class="disclaimer__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="icon"
            >
              <title>Ikon: hänglås</title>
              <path d="M13 6h-1V4c0-2.2-1.8-4-4-4S4 1.8 4 4v2H3c-1.1 0-2 .9-2 2v8h14V8c0-1.1-.9-2-2-2zM6 4c0-1.1.9-2 2-2s2 .9 2 2v2H6V4zm7 10H3V8h10v6z" />
            </svg>
          </div>
          <div class="disclaimer__text">Dina uppgifter lagras och sparas säkert.<br />Läs mer i vår <a href="#" title="" class="link">personsuppgiftspolicy</a>.</div>
        </div>
      `;
      this.props.proceed.parentNode?.appendChild(disclaimer);
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
