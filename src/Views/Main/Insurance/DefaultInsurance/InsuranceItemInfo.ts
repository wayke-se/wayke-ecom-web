import i18next from '@i18n';
import { IAvailableInsuranceOption } from '@wayke-se/ecom';
import ButtonAddRemove from '../../../../Components/Button/ButtonAddRemove';
import ButtonAsLinkArrowLeft from '../../../../Components/Button/ButtonAsLinkArrowLeft';
import ButtonClear from '../../../../Components/Button/ButtonClear';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import { asHtml } from '../../../../Utils/parser';
import { scrollTop } from '../../../../Utils/scroll';

const BUTTON_TOP_LEFT_NODE = 'insurance-button-top-left-node';
const BUTTON_BOTTOM_LEFT_NODE = 'insurance-button-bottom-left-node';
const BUTTON_INSURANCE_ADD_REMOVE_NODE = 'insurance-add-remove-node';

interface InsuranceItemInfoProps {
  readonly freeInsurance: IAvailableInsuranceOption;
  readonly selected: boolean;
  readonly onClick: () => void;
  readonly onClose: () => void;
}

class InsuranceItemInfo extends HtmlNode {
  private readonly props: InsuranceItemInfoProps;

  constructor(element: HTMLElement, props: InsuranceItemInfoProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { freeInsurance, selected, onClose, onClick } = this.props;
    const { title, description, logo, longDescription } = freeInsurance;

    this.node.innerHTML = `
      <div class="waykeecom-nav-banner" id="${BUTTON_TOP_LEFT_NODE}"></div>

      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-hstack waykeecom-hstack--align-center waykeecom-hstack--spacing-3">
          <div class="waykeecom-hstack__item waykeecom-hstack__item--grow">
            <h3 class="waykeecom-heading waykeecom-heading--3 waykeecom-no-margin">${title}</h3>
          </div>
          <div class="waykeecom-hstack__item waykeecom-hstack__item--no-shrink">
            <div class="waykeecom-logo">
              <img src="${logo}" alt="${i18next.t('insurance.logoAlt', { title })}" class="waykeecom-logo__image waykeecom-logo__image--right" />
            </div>
          </div>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-content waykeecom-text waykeecom-text--font-medium">
          <p class="waykeecom-content__p">${description}</p>
        </div>
      </div>
      ${
        longDescription
          ? `
        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-content">
            <p class="waykeecom-content__p">${asHtml(longDescription)}</p>
          </div>
        </div>
      `
          : ''
      }
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--1" id="${BUTTON_INSURANCE_ADD_REMOVE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--1" id="${BUTTON_BOTTOM_LEFT_NODE}"></div>
      </div>
    `;

    new ButtonAsLinkArrowLeft(this.node.querySelector(`#${BUTTON_TOP_LEFT_NODE}`), {
      title: i18next.t('insurance.backButton'),
      onClick: () => onClose(),
    });

    new ButtonClear(this.node.querySelector(`#${BUTTON_BOTTOM_LEFT_NODE}`), {
      title: i18next.t('insurance.backButton'),
      onClick: () => onClose(),
    });

    new ButtonAddRemove(this.node.querySelector(`#${BUTTON_INSURANCE_ADD_REMOVE_NODE}`), {
      selected,
      fullSize: true,
      onClick: () => onClick(),
    });

    scrollTop();
  }
}

export default InsuranceItemInfo;
