import Alert from '../../Templates/Alert';
import Loader from '../../Templates/Loader';
import { Image } from '../../Utils/constants';
import ButtonBankId from '../Button/ButtonBankId';
import HtmlNode from '../Extension/HtmlNode';

interface BankIdSignSameDeviceProps {
  readonly autoLaunchUrl?: string;
  readonly errorMessage?: string;
}

class BankIdSignSameDevice extends HtmlNode {
  private readonly props: BankIdSignSameDeviceProps;

  constructor(element: HTMLElement | null, props: BankIdSignSameDeviceProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { autoLaunchUrl, errorMessage } = this.props;
    if (errorMessage) {
      this.node.innerHTML = Alert({
        tone: 'error',
        children: errorMessage,
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
      disabled: !autoLaunchUrl,
      onClick: () => window.open(autoLaunchUrl, '_blank'),
      htmlNodesettings: {
        htmlTag: 'div',
        className: 'waykeecom-stack waykeecom-stack--4',
      },
    });
  }
}

export default BankIdSignSameDevice;
