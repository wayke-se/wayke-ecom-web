import HtmlNode from '../../../Components/Extension/HtmlNode';
import StageCompleted from '../../../Components/StageCompleted';
import { completeStage, goTo } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import { KeyValueListItemProps } from '../../../Templates/KeyValueListItem';
import { translateDrivingDistance } from '../../../Utils/constants';
import ListItem from '../../../Templates/ListItem';
import watch from '../../../Redux/watch';
import IfInsurance from './IfInsurance';
import DefaultInsurance from './DefaultInsurance';

interface InsuranceProps {
  store: WaykeStore;
  index: number;
  lastStage: boolean;
}

class Insurance extends HtmlNode {
  private props: InsuranceProps;

  constructor(element: HTMLDivElement, props: InsuranceProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      this.render();
    });

    this.render();
  }

  private onSkipInsurances() {
    completeStage(this.props.lastStage)(this.props.store.dispatch);
  }

  private onEdit() {
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  render() {
    const state = this.props.store.getState();

    const completed = state.topNavigation.stage > this.props.index;
    const content = ListItem(this.node, {
      completed,
      title: 'Försäkring',
      active: state.navigation.stage === this.props.index,
      id: 'insurance',
    });

    if (
      state.navigation.stage > this.props.index ||
      (completed && state.navigation.stage !== this.props.index)
    ) {
      const keyValueOptions: KeyValueListItemProps[] = [];
      if (state.insurance) {
        keyValueOptions.push({
          key: 'Uppskattad körsträcka',
          value: translateDrivingDistance[state.drivingDistance],
        });
        keyValueOptions.push({
          key: 'Försäkring',
          value: state.insurance.name,
        });
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
        onEdit: () => this.onEdit(),
      });
    } else if (state.navigation.stage === this.props.index) {
      const insuranceOptions = state.order?.getInsuranceOption();
      if (!insuranceOptions) throw 'Missing insurance';

      switch (insuranceOptions?.institute) {
        case 'if':
          new IfInsurance(content, {
            store: this.props.store,
            lastStage: this.props.lastStage,
            onSkip: () => this.onSkipInsurances(),
          });
          break;

        default:
          new DefaultInsurance(content, {
            store: this.props.store,
            lastStage: this.props.lastStage,
            insurance: insuranceOptions,
          });
          break;
      }
    }
    if (state.navigation.stage === this.props.index) {
      content.parentElement?.scrollIntoView();
    }
  }
}

export default Insurance;
