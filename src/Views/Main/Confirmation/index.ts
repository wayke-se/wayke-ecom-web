import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import ListItem from '../../../Templates/ListItem';
import VerifyByBankId from './VerifyByBankId';

interface ConfirmationProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class Confirmation extends HtmlNode {
  private readonly props: ConfirmationProps;

  constructor(element: HTMLDivElement, props: ConfirmationProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.render();
  }

  render() {
    const { store, index } = this.props;
    const { topNavigation, navigation } = store.getState();

    const completed = topNavigation.stage > index;

    const content = ListItem(this.node, {
      completed,
      title: 'Slutför order',
      id: 'confirmation',
      active: navigation.stage === index,
    });

    new VerifyByBankId(content, { lastStage: true, index, store: this.props.store });

    if (navigation.stage === index) {
      content.parentElement?.scrollIntoView();
    }
  }
}

export default Confirmation;
