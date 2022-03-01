import Alert from '../../Templates/Alert';
import Loader from '../../Templates/Loader';
import { Image } from '../../Utils/constants';
import ButtonBankId from '../Button/ButtonBankId';
import Attach from '../Extension/Attach';

const BANKID_OPEN_ON_DEVICE_NODE = `bankid-open-on-device-node`;
const BANKID_OPEN_ON_DEVICE = `bankid-open-on-device`;

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
      ${
        this.props.autoLaunchUrl
          ? `<div class="waykeecom-stack waykeecom-stack--4" id="${BANKID_OPEN_ON_DEVICE_NODE}">`
          : ''
      }`;

    if (this.props.autoLaunchUrl) {
      new ButtonBankId(
        this.element.querySelector<HTMLDivElement>(`#${BANKID_OPEN_ON_DEVICE_NODE}`),
        {
          title: 'Öppna BankID',
          id: BANKID_OPEN_ON_DEVICE,
          onClick: () => window.open(this.props.autoLaunchUrl, '_blank'),
        }
      );
    }
  }
}

export default BankIdSignSameDevice;
