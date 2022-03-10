import HtmlNode from '../../../Components/Extension/HtmlNode';
import StageCompleted from '../../../Components/StageCompleted';
import { completeStage, goTo } from '../../../Redux/action';
import store from '../../../Redux/store';
import { KeyValueListItemProps } from '../../../Templates/KeyValueListItem';
import { translateDrivingDistance } from '../../../Utils/constants';
import ListItem from '../../../Templates/ListItem';
import watch from '../../../Redux/watch';
import IfInsurance from './IfInsurance';
import DefaultInsurance from './DefaultInsurance';

class Insurance extends HtmlNode {
  private index: number;
  private lastStage: boolean;

  constructor(element: HTMLDivElement, index: number, lastStage: boolean) {
    super(element);
    this.index = index;
    this.lastStage = lastStage;

    watch('navigation', () => {
      this.render();
    });

    this.render();
  }

  private onSkipInsurances() {
    completeStage(this.lastStage);
  }

  private onEdit() {
    goTo('main', this.index);
  }

  render() {
    const state = store.getState();

    const completed = state.topNavigation.stage > this.index;
    const content = ListItem(this.node, {
      completed,
      title: 'Försäkring',
      active: state.navigation.stage === this.index,
      id: 'insurance',
    });

    if (
      state.navigation.stage > this.index ||
      (completed && state.navigation.stage !== this.index)
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
    } else if (state.navigation.stage === this.index) {
      const insuranceOptions = state.order?.getInsuranceOption();
      if (!insuranceOptions) throw 'Missing insurance';

      switch (insuranceOptions?.institute) {
        case 'if':
          new IfInsurance(content, {
            lastStage: this.lastStage,
            onSkip: () => this.onSkipInsurances(),
          });
          break;

        default:
          new DefaultInsurance(content, {
            lastStage: this.lastStage,
            insurance: insuranceOptions,
          });
          break;
      }
    }
    if (state.navigation.stage === this.index) {
      content.parentElement?.scrollIntoView();
    }
  }
}

export default Insurance;
