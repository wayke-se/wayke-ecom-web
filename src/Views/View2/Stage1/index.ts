import { IAddress } from '@wayke-se/ecom';
import { Customer } from '..';
import { validationMethods } from '../../../Utils/validationMethods';
import Li from '../Li';
import Part1 from './Part1';
import Part2 from './Part2';
import Part3 from './Part3';

const validation = {
  email: validationMethods.requiredEmail,
  phone: validationMethods.requiredTelephone,
  socialId: validationMethods.requiredSsn,
};

interface Stage1Props {
  node: HTMLElement;
  active?: boolean;
  canActivate?: boolean;
  customer: Customer;
  address?: IAddress;
  onThis: () => void;
  onNext: (customer: Customer, address?: IAddress) => void;
}

export interface CustomerValidation {
  email: boolean;
  phone: boolean;
  socialId: boolean;
}

export interface Stage1State {
  value: Customer;
  validation: CustomerValidation;
  interact: CustomerValidation;
}

interface Elements {
  li?: HTMLDivElement;
  activate?: HTMLButtonElement;
  content1?: HTMLDivElement;
  content2?: HTMLDivElement;
  proceed?: HTMLButtonElement;
}

const ID = 'wayke-view-2-stage-1';

const initalState = (customer?: Customer): Stage1State => ({
  value: customer
    ? { ...customer }
    : { email: '', phone: '', socialId: '', surname: '', givenName: '' },
  validation: {
    email: customer ? validation.email(customer.email) : false,
    phone: customer ? validation.phone(customer.phone) : false,
    socialId: customer ? validation.socialId(customer.socialId) : false,
  },
  interact: { email: false, phone: false, socialId: false },
});

class Stage1 {
  private props: Stage1Props;
  private stage: number;
  private state: Stage1State;
  private elements: Elements = {};
  private address: IAddress | undefined;

  constructor(props: Stage1Props) {
    this.props = props;
    this.stage = 1;
    this.state = initalState(props.customer);
    this.address = props.address;
    this.render();
  }

  onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof CustomerValidation;
    const value = currentTarget.value;
    this.state.value[name] = value;
    this.state.validation[name] = validation[name](value);
    this.update();
  }

  onBlur(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as keyof CustomerValidation;

    this.state.interact[name] = true;
    this.state.validation[name] = validation[name](this.state.value[name]);
    this.update();
  }

  verifyButton() {
    if (!this.elements.proceed) return;
    if (this.stage === 1) {
      if (this.state.validation.email && this.state.validation.phone) {
        this.elements.proceed.removeAttribute('disabled');
      } else {
        this.elements.proceed.setAttribute('disabled', '');
      }
    } else if (this.stage === 2) {
      if (this.state.validation.socialId) {
        this.elements.proceed.removeAttribute('disabled');
      } else {
        this.elements.proceed.setAttribute('disabled', '');
      }
    }
  }

  update() {
    Object.keys(this.state.value).forEach((_key) => {
      const key = _key as keyof CustomerValidation;
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
    this.verifyButton();
  }

  onAddress(address: IAddress) {
    this.address = address;
    this.stage = 3;
    this.render();
    this.props.onNext(this.state.value, this.address);
  }

  onNext() {
    if (this.stage === 2) {
      if (!this.state.validation.socialId) {
        this.state.interact.socialId = true;
        this.render();
      } else {
        this.props.onNext(this.state.value);
      }
    } else if (this.stage === 3) {
      this.props.onNext(this.state.value, this.address);
    } else {
      if (!this.state.validation.email || !this.state.validation.phone) {
        this.state.interact.email = true;
        this.state.interact.phone = true;
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
      title: 'Dina uppgifter',
      active: this.props.active,
    });

    this.elements = {
      li,
      activate,
      proceed,
    };

    this.verifyButton();

    if (!this.props.active) {
      new Part3({
        customer: this.state.value,
        address: this.address,
        content,
        onEdit: () => this.props.onThis(),
      });
      proceed.remove();
    } else {
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
          proceed,
          onChange: this.onChange.bind(this),
          onBlur: this.onBlur.bind(this),
          onAddress: this.onAddress.bind(this),
        });
      } else {
        proceed.addEventListener('click', () => this.onNext());
      }
    }

    if (this.props.canActivate) {
      activate.addEventListener('click', () => this.props.onThis());
    } else {
      activate.setAttribute('disabled', '');
    }
  }
}

export default Stage1;
