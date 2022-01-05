import { Stage1State } from '.';

interface Stage1Part1Props {
  content: HTMLDivElement;
  id: string;
  state: Stage1State;
  edit: boolean;
  onChange: (e: Event) => void;
  onBlur: (e: Event) => void;
}

class Part1 {
  private props: Stage1Part1Props;

  constructor(props: Stage1Part1Props) {
    this.props = props;
    this.render();
  }

  attach(element: HTMLInputElement, name: 'email' | 'phone') {
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

  render() {
    if (this.props.edit) {
      this.props.content.innerHTML = `
      <div>
        <div>
          <div class="input-label">
            <label for="${this.props.id}-contact-email" class="input-label__label">E-post</label>
            <div class="input-label__help">
              HELP???
            </div>
          </div>
          <input
            type="text"
            id="${this.props.id}-contact-email"
            value="${this.props.state.value.email}"
            name="email"
            placeholder="Ange din e-postadress"
            class="input-text"
          />
          <div id="${this.props.id}-contact-email-error" class="input-error">Error</div>
        </div>
        <div>
        <div>Telefonnummer</div>
          <input
            id="${this.props.id}-contact-phone"
            value="${this.props.state.value.phone}"
            name="phone"
            placeholder="Ange ditt telefonnummer"
          />
          <div id="${this.props.id}-contact-phone-error">Error</div>
        </div>
      </div>
    `;

      const email = this.props.content.querySelector<HTMLInputElement>(
        `#${this.props.id}-contact-email`
      );
      const phone = this.props.content.querySelector<HTMLInputElement>(
        `#${this.props.id}-contact-phone`
      );

      if (email) {
        this.attach(email, 'email');
      }

      if (phone) {
        this.attach(phone, 'phone');
      }
    } else {
      this.props.content.innerHTML = `
        <div>
          <p><b>E-post</b>: ${this.props.state.value.email}</p>
          <p><b>Telefonnummer</b>: ${this.props.state.value.phone}</p>
        </div>
      `;
    }
  }
}

export default Part1;
