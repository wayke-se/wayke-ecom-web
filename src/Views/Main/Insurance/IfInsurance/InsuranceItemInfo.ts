import { IInsuranceAddon, IInsuranceOption } from '@wayke-se/ecom';
import i18next from 'i18next';
import Accordion from '../../../../Components/Accordion';
import ButtonAddRemove from '../../../../Components/Button/ButtonAddRemove';
import ButtonAsLinkArrowLeft from '../../../../Components/Button/ButtonAsLinkArrowLeft';
import ButtonClear from '../../../../Components/Button/ButtonClear';
import ButtonSuccess from '../../../../Components/Button/ButtonSuccess';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import InputCheckbox from '../../../../Components/Input/InputCheckbox';
import { addOrRemoveInsuranceAddon } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import ecomEvent, { EcomEvent, EcomView, EcomStep } from '../../../../Utils/ecomEvent';
import { prettyNumber } from '../../../../Utils/format';
import { scrollTop } from '../../../../Utils/scroll';
import InsuracenAddonBox from './InsuranceAddonBox';

const BUTTON_TOP_LEFT_NODE = 'insurance-button-top-left-node';
const BUTTON_BOTTOM_LEFT_NODE = 'insurance-button-bottom-left-node';
const BUTTON_INSURANCE_ADD_REMOVE_NODE = 'insurance-add-remove-node';

const ADDONS_NODE = 'insurance-addons-node';
const ACCORDION_NODE = 'insurance-accordion-node';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

interface InsuranceItemInfoProps {
  readonly store: WaykeStore;
  readonly insurance: IInsuranceOption;
  readonly selected: boolean;
  readonly onClose: () => void;
}

class InsuranceItemInfo extends HtmlNode {
  private readonly props: InsuranceItemInfoProps;
  private initialAddons: IInsuranceAddon[] = [];
  private addons: IInsuranceAddon[] = [];
  private contexts: {
    updateButton?: ButtonSuccess | ButtonAddRemove;
    checkboxes: { [key: string]: InputCheckbox | undefined };
  } = { checkboxes: {} };

  constructor(element: HTMLElement, props: InsuranceItemInfoProps) {
    super(element);
    this.props = props;

    const { insuranceAddOns } = this.props.store.getState();
    if (!!insuranceAddOns?.insurance && insuranceAddOns.insurance === this.props.insurance.name) {
      this.addons = [...insuranceAddOns.addOns];
    }

    this.initialAddons = [...this.addons];

    this.render();
  }

  private static containChanges(_initialAddons: IInsuranceAddon[], _addons: IInsuranceAddon[]) {
    const initialAddons = [..._initialAddons].sort();
    const addons = [..._addons].sort();
    return initialAddons.join().localeCompare(addons.join()) !== 0;
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
        ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_ADDON_SELECTED, EcomStep.INSURANCE_IF);
        this.addons.push(selectedAddon);
      } else {
        ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_ADDON_UNSELECTED, EcomStep.INSURANCE_IF);
        const index = this.addons.findIndex((x) => x.name === selectedAddon.name);
        if (index > -1) {
          this.addons.splice(index, 1);
        }
      }

      this.contexts.checkboxes[name]?.checked(checked);

      [...new Set(this.addons.map((a) => a.exclude).flat())].forEach((exclude) =>
        this.contexts.checkboxes[exclude as string]?.disabled(true)
      );
    }

    const containChanges = InsuranceItemInfo.containChanges(this.initialAddons, this.addons);
    this.contexts.updateButton?.disabled(this.props.selected ? !containChanges : false);
    this.render();
  }

  onUpdate() {
    const { insurance } = this.props.store.getState();
    if (!insurance || (insurance && this.props.insurance.name !== insurance.name)) {
      ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_SELECTED, EcomStep.INSURANCE_IF);
    } else {
      ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_UNSELECTED, EcomStep.INSURANCE_IF);
    }

    addOrRemoveInsuranceAddon(this.props.insurance, this.addons)(this.props.store.dispatch);
    this.props.onClose();
  }

  render() {
    const { insurance, selected, onClose } = this.props;
    const { name, description, legalDescription, legalUrl, insuranceItems } = insurance;
    const addons = insurance.addOns;

    const containChanges = InsuranceItemInfo.containChanges(this.initialAddons, this.addons);

    const price = this.addons.reduce((prev, curr) => {
      return prev + curr.monthlyPrice;
    }, insurance.price);

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
              <img src="${''}" alt="${i18next.t('insurance.logoAlt', { title: name })}" class="waykeecom-logo__image waykeecom-logo__image--right" />
            </div>
          </div>
          `
              : ''
          }
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-text waykeecom-text--font-bold">${prettyNumber(price, {
          postfix: i18next.t('insurance.perMonth'),
        })}</div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-content waykeecom-text waykeecom-text--font-medium">
          <p class="waykeecom-content__p">${description}</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <a 
          href="${legalUrl}"
          rel="noopener noreferrer"
          target="_blank"
          class="waykeecom-link"
        >${legalDescription}</a>
      </div>
      ${
        addons?.length
          ? `<div class="waykeecom-stack waykeecom-stack--3">
              <fieldset class="waykeecom-input-group">
                <legend class="waykeecom-input-label"><div class="waykeecom-input-label__label">${i18next.t('insurance.addons')}</div></legend>
                <div id="${ADDONS_NODE}"></div>
              </fieldset>
            </div>`
          : ''
      }
      ${
        insuranceItems?.length
          ? `
            <div class="waykeecom-stack waykeecom-stack--3">
              <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">${i18next.t('insurance.includes')}</h4>
            </div>
            <div class="waykeecom-stack waykeecom-stack--3" id="${ACCORDION_NODE}"></div>
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

    if (!!addons?.length) {
      const node = this.node.querySelector<HTMLElement>(`#${ADDONS_NODE}`);
      addons.forEach((addon) => {
        const subNode = new InsuracenAddonBox(node);
        this.contexts.checkboxes[addon.name] = new InputCheckbox(subNode.render(), {
          id: slugify(addon.name),
          name: addon.name,
          title: addon.title,
          meta: `<div class="waykeecom-text waykeecom-text--font-bold">${prettyNumber(
            addon.monthlyPrice,
            { postfix: i18next.t('insurance.perMonth') }
          )}</div>`,
          description: `<div class="waykeecom-text waykeecom-text--tone-alt">${addon.description}</div>`,
          append: true,
          value: addon.name,
          checked: this.addons.findIndex((x) => x.name === addon.name) > -1,
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

    new ButtonAsLinkArrowLeft(this.node.querySelector(`#${BUTTON_TOP_LEFT_NODE}`), {
      title: i18next.t('insurance.backButton'),
      onClick: () => onClose(),
    });

    new ButtonClear(this.node.querySelector(`#${BUTTON_BOTTOM_LEFT_NODE}`), {
      title: i18next.t('insurance.backButton'),
      onClick: () => onClose(),
    });

    if (selected) {
      this.contexts.updateButton = new ButtonSuccess(
        this.node.querySelector(`#${BUTTON_INSURANCE_ADD_REMOVE_NODE}`),
        {
          title: selected ? i18next.t('insurance.update') : i18next.t('insurance.select'),
          disabled: selected ? !containChanges : undefined,
          onClick: () => this.onUpdate(),
        }
      );
    } else {
      this.contexts.updateButton = new ButtonAddRemove(
        this.node.querySelector(`#${BUTTON_INSURANCE_ADD_REMOVE_NODE}`),
        {
          selected: false,
          fullSize: true,
          disabled: selected ? !containChanges : undefined,
          onClick: () => this.onUpdate(),
        }
      );
    }

    scrollTop();
  }
}

export default InsuranceItemInfo;
