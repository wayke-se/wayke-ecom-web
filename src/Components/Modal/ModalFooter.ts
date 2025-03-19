import i18next from '@i18n';
import { MarketCode } from '../../@types/MarketCode';
import { getSymbolLogotype } from '../../Templates/Logotype';
import HtmlNode from '../Extension/HtmlNode';

interface ModalFooterProps {
  readonly id: string;
  readonly marketCode: MarketCode;
}
class ModalFooter extends HtmlNode {
  private readonly props: ModalFooterProps;

  constructor(element: HTMLElement, props: ModalFooterProps) {
    super(element, {
      htmlTag: 'footer',
      className: 'waykeecom-modal__footer',
      id: props.id,
    });

    this.props = props;
    this.render();
  }

  render() {
    this.node.innerHTML = `
      <div class="waykeecom-hstack waykeecom-hstack--spacing-1 waykeecom-hstack--align-center">
        <div class="waykeecom-hstack__item waykeecom-hstack__item--no-shrink">
          ${getSymbolLogotype({
            market: this.props.marketCode,
            className: 'waykeecom-modal__footer-logo',
          })}     
        </div>
        <div class="waykeecom-hstack__item">
          Powered by <a href="${i18next.t('glossary.homeUrl')}" title="${i18next.t('glossary.goToHome')}" target="_blank" rel="noopener noreferer" class="waykeecom-link waykeecom-link--no-external-icon waykeecom-link--current-color waykeecom-link--underline">${i18next.t('glossary.company')}</a>
        </div>
      </div>
    `;
  }
}

export default ModalFooter;
