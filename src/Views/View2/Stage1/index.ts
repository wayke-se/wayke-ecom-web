import { Contact } from '..';
import { validationMethods } from '../../../Utils/validationMethods';
import Li from '../Li';
import Part1 from './Part1';
import Part2 from './Part2';

const validation = {
  email: validationMethods.requiredEmail,
  telephone: validationMethods.requiredTelephone,
  ssn: () => true,
  zip: () => true,
};

interface Stage1Props {
  node: HTMLElement;
  active?: boolean;
  canActivate?: boolean;
  contact: Contact;
  onThis: () => void;
  onNext: (contact: Contact) => void;
}

export interface ContactValidation {
  email: boolean;
  telephone: boolean;
  ssn: boolean;
  zip: boolean;
}

export interface Stage1State {
  value: Contact;
  validation: ContactValidation;
  interact: ContactValidation;
}

interface Elements {
  li?: HTMLLIElement;
  activate?: HTMLButtonElement;
  content1?: HTMLDivElement;
  content2?: HTMLDivElement;
  proceed?: HTMLButtonElement;
}

const ID = 'wayke-view-2-stage-1';

class Stage1 {
  private props: Stage1Props;
  private stage: number;
  private state: Stage1State = {
    value: { email: '', telephone: '', ssn: '', zip: '' },
    validation: {
      email: false,
      telephone: false,
      ssn: true,
      zip: true,
    },
    interact: { email: false, telephone: false, ssn: false, zip: false },
  };
  private elements: Elements = {};

  constructor(props: Stage1Props) {
    this.props = props;
    this.stage = 1;
    this.state = {
      value: { ...props.contact },
      validation: {
        email: validation.email(props.contact.email),
        telephone: validation.telephone(props.contact.telephone),
        ssn: true,
        zip: true,
      },
      interact: { email: false, telephone: false, ssn: false, zip: false },
    };

    this.render();
  }

  onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof Contact;
    const value = currentTarget.value;
    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);
    this.update();
  }

  onBlur(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof Contact;

    this.state.interact[name] = true;
    this.state.validation[name] = validation[name](this.state.value[name]);
    console.log(this.state);
    this.update();
  }

  update() {
    console.log('update', this.state);
    Object.keys(this.state.value).forEach((_key) => {
      const key = _key as keyof Contact;
      const element =
        this.elements?.content1?.querySelector<HTMLInputElement>(`#${ID}-contact-${key}-error`) ||
        this.elements?.content2?.querySelector<HTMLInputElement>(`#${ID}-contact-${key}-error`);

      if (element) {
        if (this.state.interact[key] && !this.state.validation[key]) {
          element.style.display = '';
        } else {
          element.style.display = 'none';
        }
      }
    });
  }

  onNext() {
    if (this.stage === 2) {
      this.props.onNext(this.state.value);
    } else {
      if (!this.state.validation.email || !this.state.validation.telephone) {
        this.state.interact.email = true;
        this.state.interact.telephone = true;
        this.render();
      } else {
        this.stage = 2;
        this.render();
      }
    }
  }

  render() {
    const { li, activate, content, proceed } = Li({
      node: this.props.node,
      id: ID,
      title: 'Steg 1 - Dina uppgifter',
      active: this.props.active,
    });

    const content1 = document.createElement('div');
    const content2 = document.createElement('div');
    content.appendChild(content1);
    content.appendChild(content2);

    this.elements = {
      li,
      activate,
      content1,
      content2,
      proceed,
    };

    new Part1({
      id: ID,
      content: content1,
      state: this.state,
      edit: this.stage === 1,
      onChange: this.onChange.bind(this),
      onBlur: this.onBlur.bind(this),
    });

    if (this.stage === 2) {
      new Part2({
        id: ID,
        content: content2,
        state: this.state,
        edit: this.stage === 2,
        onChange: this.onChange.bind(this),
        onBlur: this.onBlur.bind(this),
      });
    }

    if (this.props.canActivate) {
      activate.addEventListener('click', () => this.props.onThis());
    } else {
      activate.setAttribute('disabled', '');
    }

    proceed.addEventListener('click', () => this.onNext());
  }
}

export default Stage1;
