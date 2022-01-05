class Part2 {
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
          <div>Personnummer</div>
          <input
            id="${this.props.id}-contact-ssn"
            value="${this.props.state.value.ssn}"
            name="ssn"
            placeholder="ÅÅÅÅMMDD-XXXX"
          />
          <div id="${this.props.id}-contact-ssn-error">Error</div>
        </div>
        <div>
        <div>Postnummer</div>
          <input
            id="${this.props.id}-contact-zip"
            value="${this.props.state.value.zip}"
            name="zip"
            placeholder="Ange ditt postnummer"
          />
          <div id="${this.props.id}-contact-zip-error">Error</div>
        </div>
      </div>
    `;
            const ssn = this.props.content.querySelector(`#${this.props.id}-contact-ssn`);
            const zip = this.props.content.querySelector(`#${this.props.id}-contact-zip`);
            if (ssn) {
                this.attach(ssn, 'ssn');
            }
            if (zip) {
                this.attach(zip, 'zip');
            }
        }
        else {
            this.props.content.innerHTML = `
        <div>
          <p><b>Personnummer</b>: ${this.props.state.value.ssn}</p>
          <p><b>Postnummer</b>: ${this.props.state.value.zip}</p>
        </div>
      `;
        }
    }
}
export default Part2;
