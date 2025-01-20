import i18next from 'i18next';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import ListItem from '../../../Templates/ListItem';
import Payment from './Payment';
import VerifyByBankId from './VerifyByBankId';

interface ConfirmationProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class Confirmation extends HtmlNode {
  private readonly props: ConfirmationProps;
  private view = 1;

  constructor(element: HTMLElement, props: ConfirmationProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.render();
  }

  render() {
    const { store, index } = this.props;
    const { topNavigation, navigation, order } = store.getState();

    const completed = topNavigation.stage > index;

    const content = ListItem(this.node, {
      completed,
      title: order?.isPaymentRequired
        ? i18next.t('confirmation.paymentTitle')
        : i18next.t('confirmation.title'),
      id: 'confirmation',
      active: navigation.stage === index,
      index: index,
    });

    if (navigation.stage === index) {
      if (navigation.subStage === 2) {
        new Payment(content, { store });
      } else {
        new VerifyByBankId(content, { lastStage: true, index, store: this.props.store });
      }
      content.parentElement?.scrollIntoView();
    }
  }
}

export default Confirmation;
