import { IInsuranceAddon, IInsuranceOption } from '@wayke-se/ecom';
import ButtonAsLinkArrowLeft from '../../../../Components/Button/ButtonAsLinkArrowLeft';
import ButtonClear from '../../../../Components/Button/ButtonClear';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import { prettyNumber } from '../../../../Utils/format';
import { scrollTop } from '../../../../Utils/scroll';
import Accordion from '../../../../Components/Accordion';
import InputCheckbox from '../../../../Components/Input/InputCheckbox';
import { addOrRemoveInsuranceAddon } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import ButtonSuccess from '../../../../Components/Button/ButtonSuccess';
import ButtonAddRemove from '../../../../Components/Button/ButtonAddRemove';
import InsuracenAddonBox from './InsuranceAddonBox';

const BUTTON_TOP_LEFT_NODE = 'insurance-button-top-left-node';
const BUTTON_BOTTOM_LEFT_NODE = 'insurance-button-bottom-left-node';
const BUTTON_INSURANCE_ADD_REMOVE_NODE = 'insurance-add-remove-node';

const ADDONS_NODE = 'insurance-addons-node';
const ACCORDION_NODE = 'insurance-accordion-node';

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
      this.contexts.checkboxes[name]?.checked(checked);

      if (checked) {
        this.addons.push(selectedAddon);
      } else {
        const index = this.addons.findIndex((x) => x.name === selectedAddon.name);
        if (index > -1) {
          this.addons.splice(index, 1);
        }
      }

      [...new Set(this.addons.map((a) => a.exclude).flat())].forEach((exclude) =>
        this.contexts.checkboxes[exclude as string]?.disabled(true)
      );
    }

    const containChanges = InsuranceItemInfo.containChanges(this.initialAddons, this.addons);
    this.contexts.updateButton?.disabled(this.props.selected ? !containChanges : false);
  }

  onUpdate() {
    addOrRemoveInsuranceAddon(this.props.insurance, this.addons)(this.props.store.dispatch);
    this.props.onClose();
  }

  render() {
    const { insurance, selected, onClose } = this.props;
    const { name, description, legalDescription, legalUrl, insuranceItems } = insurance;
    const addons = insurance.addOns;

    const containChanges = InsuranceItemInfo.containChanges(this.initialAddons, this.addons);

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
                <legend class="waykeecom-input-label"><div class="waykeecom-input-label__label">Tillval</div></legend>
                <div id="${ADDONS_NODE}"></div>
              </fieldset>
            </div>`
          : ''
      }
      ${
        insuranceItems?.length
          ? `
            <div class="waykeecom-stack waykeecom-stack--3">
              <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Försäkringen innehåller</h4>
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
      title: 'Tillbaka',
      onClick: () => onClose(),
    });

    if (!!addons?.length) {
      const node = this.node.querySelector<HTMLElement>(`#${ADDONS_NODE}`);
      addons.forEach((addon) => {
        const subNode = new InsuracenAddonBox(node);
        this.contexts.checkboxes[addon.name] = new InputCheckbox(subNode.render(), {
          id: addon.name,
          name: addon.name,
          title: addon.title,
          meta: `<div class="waykeecom-text waykeecom-text--font-medium">${prettyNumber(
            addon.monthlyPrice,
            { postfix: 'kr/mån' }
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
      title: 'Tillbaka',
      onClick: () => onClose(),
    });

    new ButtonClear(this.node.querySelector(`#${BUTTON_BOTTOM_LEFT_NODE}`), {
      title: 'Tillbaka',
      onClick: () => onClose(),
    });

    if (selected) {
      this.contexts.updateButton = new ButtonSuccess(
        this.node.querySelector(`#${BUTTON_INSURANCE_ADD_REMOVE_NODE}`),
        {
          title: selected ? 'Uppdatera' : 'Välj',
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
