import { MarketCode } from '../../@types/MarketCode';
import { getWordmarkLogotype } from '../../Templates/Logotype';
import HtmlNode from '../Extension/HtmlNode';

interface ModalHeaderProps {
  readonly title: string;
  readonly id: string;
  readonly logo?: string;
  readonly logoX2?: string;
  readonly onClose?: () => void;
  readonly marketCode: MarketCode;
}

class ModalHeader extends HtmlNode {
  private readonly props: ModalHeaderProps;

  constructor(element: HTMLElement, props: ModalHeaderProps) {
    super(element, {
      htmlTag: 'header',
      className: 'waykeecom-modal__header',
      id: props.id,
    });
    this.props = props;
    this.render();
  }

  render() {
    const { title, logo, logoX2, onClose } = this.props;
    this.node.innerHTML = `
      <div class="waykeecom-header">
        <div class="waykeecom-header__logo">
          <h2 class="waykeecom-no-margin">
          ${
            logo
              ? `
                <img
                  src="${logo}"
                  ${logoX2 ? `srcset="${logoX2} 2x"` : ''}
                  alt="${title}"
                  class="waykevaluation-image"
                />
              `
              : getWordmarkLogotype({
                  market: this.props.marketCode,
                  className: 'waykevaluation-header__logo--svg',
                })
          }
          </h2>
        </div>
      </div>
    `;
    if (onClose) {
      this.node.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
        button.addEventListener('click', () => onClose());
      });
    }
  }
}

export default ModalHeader;
