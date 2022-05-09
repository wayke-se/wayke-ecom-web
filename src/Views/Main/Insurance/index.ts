import HtmlNode from '../../../Components/Extension/HtmlNode';
import StageCompleted from '../../../Components/StageCompleted';
import { addOrRemoveInsurance, completeStage, goTo } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import { KeyValueListItemProps } from '../../../Templates/KeyValueListItem';
import { translateDrivingDistance } from '../../../Utils/constants';
import ListItem from '../../../Templates/ListItem';
import watch from '../../../Redux/watch';
import IfInsurance from './IfInsurance';
import DefaultInsurance from './DefaultInsurance';
import { prettyNumber } from '../../../Utils/format';
import userEvent, { Step, UserEvent } from '../../../Utils/userEvent';

interface InsuranceProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class Insurance extends HtmlNode {
  private readonly props: InsuranceProps;

  constructor(element: HTMLDivElement, props: InsuranceProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.render();
  }

  private onSkipInsurances() {
    addOrRemoveInsurance()(this.props.store.dispatch);
    completeStage(this.props.lastStage)(this.props.store.dispatch);
    userEvent(UserEvent.INSURANCE_SKIPPED, Step.INSURANCE);
  }

  private onEdit() {
    goTo('main', this.props.index)(this.props.store.dispatch);
    userEvent(UserEvent.INSURANCE_EDIT, Step.INSURANCE);
  }

  render() {
    const { store, index, lastStage } = this.props;
    const state = store.getState();

    const completed = state.topNavigation.stage > index;
    const content = ListItem(this.node, {
      completed,
      title: 'Försäkring',
      active: state.navigation.stage === index,
      id: 'insurance',
    });

    if (state.navigation.stage > index || (completed && state.navigation.stage !== index)) {
      const keyValueOptions: KeyValueListItemProps[] = [];
      if (state.insurance) {
        keyValueOptions.push({
          key: 'Uppskattad körsträcka',
          value: translateDrivingDistance[state.drivingDistance],
        });
        keyValueOptions.push({
          key: state.insurance.name,
          value: prettyNumber(state.insurance.price, { postfix: 'kr/mån' }),
        });

        if (state.insuranceAddOns?.insurance === state.insurance.name) {
          state.insuranceAddOns.addOns.forEach((addon) =>
            keyValueOptions.push({
              key: addon.title,
              value: prettyNumber(addon.monthlyPrice, { postfix: 'kr/mån' }),
            })
          );
        }
      } else if (state.freeInsurance) {
        keyValueOptions.push({
          key: 'Försäkring',
          value: state.freeInsurance.title,
        });
      } else {
        keyValueOptions.push({
          key: 'Försäkring',
          value: 'Ingen',
        });
      }

      new StageCompleted(content, {
        keyValueList: keyValueOptions,
        changeButtonTitle: 'Ändra försäkring',
        onEdit: !state.createdOrderId ? () => this.onEdit() : undefined,
      });
    } else if (state.navigation.stage === index) {
      const insuranceOptions = state.order?.insuranceOption;
      if (!insuranceOptions) throw 'Missing insurance';

      switch (insuranceOptions?.institute) {
        case 'IF':
          new IfInsurance(content, {
            store,
            lastStage,
            onSkip: () => this.onSkipInsurances(),
          });
          break;

        default:
          new DefaultInsurance(content, {
            store,
            lastStage,
            insurance: insuranceOptions,
          });
          break;
      }
    }
    if (state.navigation.stage === index) {
      content.parentElement?.scrollIntoView();
    }
  }
}

export default Insurance;
