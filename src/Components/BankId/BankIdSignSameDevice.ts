import Alert from '../../Templates/Alert';
import Loader from '../../Templates/Loader';
import { Image } from '../../Utils/constants';
import ButtonBankId from '../Button/ButtonBankId';
import Attach from '../Extension/Attach';

interface BankIdSignSameDeviceProps {
  autoLaunchUrl?: string;
  errorMessage?: string;
}

class BankIdSignSameDevice extends Attach {
  private props: BankIdSignSameDeviceProps;

  constructor(element: HTMLElement | null, props: BankIdSignSameDeviceProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    if (this.props.errorMessage) {
      this.element.innerHTML = Alert({
        tone: 'error',
        children: this.props.errorMessage,
      });
      return;
    }

    this.element.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--4">
        <div class="waykeecom-align waykeecom-align--center">
          <img src="${
            Image.bankid
          }" alt="BankID logotyp" class="waykeecom-image" style="width: 130px" />
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--4">${Loader()}</div>
      `;

    new ButtonBankId(this.element, {
      title: 'Öppna BankID',
      disabled: !this.props.autoLaunchUrl,
      onClick: () => window.open(this.props.autoLaunchUrl, '_blank'),
      htmlNodesettings: {
        htmlTag: 'div',
        className: 'waykeecom-stack waykeecom-stack--4',
      },
    });
  }
}

export default BankIdSignSameDevice;
