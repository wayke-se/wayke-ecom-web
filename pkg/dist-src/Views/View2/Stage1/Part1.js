class Part1 {
    constructor(props) {
        this.props = props;
        this.render();
    }
    attach(element, name) {
        element.addEventListener('input', (e) => this.props.onChange(e));
        element.addEventListener('blur', (e) => this.props.onBlur(e));
        const emailError = this.props.content.querySelector(`#${this.props.id}-contact-${name}-error`);
        if (emailError) {
            if (this.props.state.interact[name] && !this.props.state.validation[name]) {
                emailError.style.display = '';
            }
            else {
                emailError.style.display = 'none';
            }
        }
    }
    render() {
        if (this.props.edit) {
            this.props.content.innerHTML = `
      <div>
        <div>
          <div>E-post</div>
          <input
            id="${this.props.id}-contact-email"
            value="${this.props.state.value.email}"
            name="email"
            placeholder="Ange din e-postadress"
          />
          <div id="${this.props.id}-contact-email-error">Error</div>
        </div>
        <div>
        <div>Telefonnummer</div>
          <input
            id="${this.props.id}-contact-telephone"
            value="${this.props.state.value.telephone}"
            name="telephone"
            placeholder="Ange ditt telefonnummer"
          />
          <div id="${this.props.id}-contact-telephone-error">Error</div>
        </div>
      </div>
    `;
            const email = this.props.content.querySelector(`#${this.props.id}-contact-email`);
            const telephone = this.props.content.querySelector(`#${this.props.id}-contact-telephone`);
            if (email) {
                this.attach(email, 'email');
            }
            if (telephone) {
                this.attach(telephone, 'telephone');
            }
        }
        else {
            this.props.content.innerHTML = `
        <div>
          <p><b>E-post</b>: ${this.props.state.value.email}</p>
          <p><b>Telefonnummer</b>: ${this.props.state.value.telephone}</p>
        </div>
      `;
        }
    }
}
export default Part1;
