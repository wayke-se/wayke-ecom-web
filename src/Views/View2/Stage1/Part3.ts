import { Contact } from '..';

interface Part3Props {
  contact: Contact;
  content: HTMLDivElement;
  onEdit: () => void;
}

class Part3 {
  private props: Part3Props;

  constructor(props: Part3Props) {
    this.props = props;
    this.render();
  }

  render() {
    this.props.content.innerHTML = `
        <div>
          <p><b>E-post</b>: ${this.props.contact.email}</p>
          <p><b>Telefonnummer</b>: ${this.props.contact.telephone}</p>
          <p><b>Personnummer</b>: ${this.props.contact.ssn}</p>
          <p><b>Postnummer</b>: ${this.props.contact.zip}</p>
          <button>Ändra</button>
        </div>
      `;
    this.props.content.querySelector('button')?.addEventListener('click', () => this.props.onEdit());
  }
}

export default Part3;
