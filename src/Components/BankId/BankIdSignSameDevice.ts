import Alert from '../../Templates/Alert';
import Loader from '../../Templates/Loader';
import { Image } from '../../Utils/constants';
import ButtonBankId from '../Button/ButtonBankId';
import HtmlNode from '../Extension/HtmlNode';

interface BankIdSignSameDeviceProps {
  autoLaunchUrl?: string;
  errorMessage?: string;
}

class BankIdSignSameDevice extends HtmlNode {
  private props: BankIdSignSameDeviceProps;

  constructor(element: HTMLElement | null, props: BankIdSignSameDeviceProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    if (this.props.errorMessage) {
      this.node.innerHTML = Alert({
        tone: 'error',
        children: this.props.errorMessage,
      });
      return;
    }

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--4">
        <div class="waykeecom-align waykeecom-align--center">
          <img src="${
            Image.bankid
          }" alt="BankID logotyp" class="waykeecom-image" style="width: 130px" />
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--4">${Loader()}</div>
      `;

    new ButtonBankId(this.node, {
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
