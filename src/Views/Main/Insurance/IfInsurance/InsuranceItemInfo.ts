import { IInsuranceOption } from '@wayke-se/ecom';
import ButtonAddRemove from '../../../../Components/Button/ButtonAddRemove';
import ButtonAsLinkArrowLeft from '../../../../Components/Button/ButtonAsLinkArrowLeft';
import ButtonAsLink from '../../../../Components/Button/ButtonAsLink';
import ButtonClear from '../../../../Components/Button/ButtonClear';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import { prettyNumber } from '../../../../Utils/format';
import { scrollTop } from '../../../../Utils/scroll';
import Accordion from '../../../../Components/Accordion';
import InputCheckbox from '../../../../Components/Input/InputCheckbox';

const BUTTON_TOP_LEFT_NODE = 'insurance-button-top-left-node';
const BUTTON_BOTTOM_LEFT_NODE = 'insurance-button-bottom-left-node';
const BUTTON_INSURANCE_ADD_REMOVE_NODE = 'insurance-add-remove-node';

const ADDONS_NODE = 'insurance-addons-node';
const ACCORDION_NODE = 'insurance-accordion-node';

interface InsuranceItemInfoProps {
  readonly insurance: IInsuranceOption;
  readonly selected: boolean;
  readonly onClick: () => void;
  readonly onClose: () => void;
}

class InsuranceItemInfo extends HtmlNode {
  private readonly props: InsuranceItemInfoProps;
  private contexts: {
    checkboxes: { [key: string]: InputCheckbox | undefined };
  } = { checkboxes: {} };

  constructor(element: HTMLElement, props: InsuranceItemInfoProps) {
    super(element);
    this.props = props;
    this.render();
  }

  onClick(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const { name, checked } = currentTarget;
    const selectedAddon = this.props.insurance.addOns.find((x) => x.name === name);
    if (selectedAddon) {
      Object.keys(this.contexts.checkboxes).forEach((key) => {
        this.contexts.checkboxes[key]?.disabled(false);
      });

      if (checked) {
        selectedAddon.exclude.forEach((exclude) => {
          this.contexts.checkboxes[exclude]?.disabled(true);
        });
      }
    }
  }

  render() {
    const { insurance, selected, onClose, onClick } = this.props;
    const { name, description, legalDescription, legalUrl, insuranceItems } = insurance;
    const addons = insurance.addOns;

    this.node.innerHTML = `
      <div class="waykeecom-nav-banner" id="${BUTTON_TOP_LEFT_NODE}"></div>

      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-hstack waykeecom-hstack--align-center waykeecom-hstack--spacing-3">
          <div class="waykeecom-hstack__item waykeecom-hstack__item--grow">
            <h3 class="waykeecom-heading waykeecom-heading--3 waykeecom-no-margin">${name}</h3>
          </div>
          ${
            false
              ? `
          <div class="waykeecom-hstack__item waykeecom-hstack__item--no-shrink">
            <div class="waykeecom-logo">
              <img src="${''}" alt="Tillverkarens logotyp för ${name}" class="waykeecom-logo__image waykeecom-logo__image--right" />
            </div>
          </div>
          `
              : ''
          }
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-text waykeecom-text--font-medium">${prettyNumber(insurance.price, {
          postfix: 'kr/mån',
        })}</div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-content waykeecom-text waykeecom-text--font-medium">
          <p>${description}</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <a 
          href="${legalUrl}"
          rel="noopener noreferrer"
          target="_blank"
          class="waykeecom-link"
        >
          ${legalDescription}
        </a>
      </div>
      ${
        addons?.length
          ? `<div class="waykeecom-stack waykeecom-stack--3" id="${ADDONS_NODE}"></div>`
          : ''
      }
      ${
        insuranceItems?.length
          ? `<div class="waykeecom-stack waykeecom-stack--3" id="${ACCORDION_NODE}"></div>`
          : ''
      }
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--1" id="${BUTTON_INSURANCE_ADD_REMOVE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--1" id="${BUTTON_BOTTOM_LEFT_NODE}"></div>
      </div>
    `;

    new ButtonAsLinkArrowLeft(this.node.querySelector(`#${BUTTON_TOP_LEFT_NODE}`), {
      title: 'Tillbaka',
      onClick: () => onClose(),
    });

    if (!!addons?.length) {
      const node = this.node.querySelector<HTMLElement>(`#${ACCORDION_NODE}`);
      addons.forEach((addon) => {
        this.contexts.checkboxes[addon.name] = new InputCheckbox(node, {
          id: addon.name,
          name: addon.name,
          title: addon.title,
          description: addon.description,
          append: true,
          value: addon.name,
          checked: false,
          onClick: (e) => this.onClick(e),
        });
      });
    }

    if (!!insuranceItems?.length) {
      const node = this.node.querySelector<HTMLElement>(`#${ACCORDION_NODE}`);
      insuranceItems.forEach(
        (ii) =>
          new Accordion(node, {
            id: ii.name,
            title: ii.name,
            description: ii.description,
            append: true,
          })
      );
    }

    new ButtonAsLink(this.node.querySelector(`#${BUTTON_TOP_LEFT_NODE}`), {
      title: legalDescription,
      onClick: () => onClose(),
    });

    new ButtonClear(this.node.querySelector(`#${BUTTON_BOTTOM_LEFT_NODE}`), {
      title: 'Tillbaka',
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
