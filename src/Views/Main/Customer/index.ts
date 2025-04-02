import HtmlNode from '../../../Components/Extension/HtmlNode';
import StageCompleted from '../../../Components/StageCompleted';
import { goTo } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import ListItem from '../../../Templates/ListItem';
import ecomEvent, { EcomStep, EcomEvent, EcomView } from '../../../Utils/ecomEvent';
import { maskSSn, maskText } from '../../../Utils/mask';
import EmailAndPhone from './EmailAndPhone';
import FullAddress from './FullAddress';

interface CustomerProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class Customer extends HtmlNode {
  private readonly props: CustomerProps;

  constructor(element: HTMLElement, props: CustomerProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.render();
  }

  private onChange() {
    ecomEvent(EcomView.MAIN, EcomEvent.CUSTOMER_EDIT, EcomStep.CUSTOMER_EMAIL_AND_PHONE);
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  render() {
    const { store, index, lastStage } = this.props;
    const state = this.props.store.getState();

    const completed = state.topNavigation.stage > index;

    const active = state.navigation.stage === index && !state.createdOrderId;
    if (active) {
      ecomEvent(
        EcomView.MAIN,
        EcomEvent.CUSTOMER_ACTIVE,
        state.navigation.subStage === 1
          ? EcomStep.CUSTOMER_EMAIL_AND_PHONE
          : EcomStep.CUSTOMER_ADDRESS
      );
    }
    const content = ListItem(this.node, {
      completed,
      title: 'Dina uppgifter',
      active,
      id: 'customer',
      index: index,
    });
    content.innerHTML = '';

    const part1 = document.createElement('div');
    part1.className = 'waykeecom-stack waykeecom-stack--2';
    const part2 = document.createElement('div');
    part2.className = 'waykeecom-stack waykeecom-stack--2';

    if (state.navigation.stage > index || (completed && state.navigation.stage !== index)) {
      const keyValueList: { key: string; value: string }[] = [
        { key: 'E-post', value: state.customer.email },
        { key: 'Telefonnummer', value: state.customer.phone },
        { key: 'Personnummer', value: maskSSn(state.customer.socialId) },
        ...(state.address
          ? [
              {
                key: 'Namn',
                value: `${maskText(state.address.givenName)} ${maskText(state.address.surname)}`,
              },
              { key: 'Adress', value: state.address.street },
              { key: 'Postnummer', value: state.address.postalCode },
              { key: 'Stad', value: state.address.city },
            ]
          : []),
      ];
      new StageCompleted(content, {
        keyValueList,
        changeButtonTitle: 'Ändra dina uppgifter',
        onEdit: !state.createdOrderId ? () => this.onChange() : undefined,
      });
    } else if (state.navigation.stage === index) {
      new EmailAndPhone(content, { store });
      if (state.navigation.subStage > 1) {
        new FullAddress(content, { store, lastStage });
      }
    }
    if (state.navigation.stage === index) {
      content.parentElement?.scrollIntoView();
    }
  }
}

export default Customer;
