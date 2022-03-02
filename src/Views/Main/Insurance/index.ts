import { DrivingDistance } from '@wayke-se/ecom';
import watch from 'redux-watch';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonSkip from '../../../Components/Button/ButtonSkip';
import Attach from '../../../Components/Extension/Attach';
import InputSelect from '../../../Components/Input/InputSelect';
import StageCompleted from '../../../Components/StageCompleted';
import { completeStage, goTo, setDrivingDistance } from '../../../Redux/action';
import store from '../../../Redux/store';
import { KeyValueListItemProps } from '../../../Templates/KeyValueListItem';
import { translateDrivingDistance } from '../../../Utils/constants';
import ListItem from '../ListItem';
import InsuranceView from './InsuranceView';

const DISTANCE = 'select-insurance-distance';
const DISTANCE_NODE = `${DISTANCE}-node`;

const SHOW_INSURANCES = 'button-insurances-show';
const SHOW_INSURANCES_NODE = `${SHOW_INSURANCES}-node`;

const SKIP_INSURANCES = 'button-insurances-skip';
const SKIP_INSURANCES_NODE = `${SKIP_INSURANCES}-node`;

class Insurance extends Attach {
  private index: number;
  private lastStage: boolean;
  private showInsurances = false;

  constructor(element: HTMLDivElement, index: number, lastStage: boolean) {
    super(element);
    this.index = index;
    this.lastStage = lastStage;

    const w = watch(store.getState, 'navigation');
    store.subscribe(w(() => this.render()));
    const w2 = watch(store.getState, 'edit');
    store.subscribe(w2(() => this.render()));

    this.render();
  }

  private onChangeDistance(e: Event) {
    const currentTarget = e.currentTarget as HTMLSelectElement;
    setDrivingDistance(currentTarget.value as DrivingDistance);
  }

  private onSkipInsurances() {
    completeStage(this.lastStage);
  }

  private onShowInsurances() {
    this.showInsurances = true;
    this.render();
  }

  private onEdit() {
    const state = store.getState();
    this.showInsurances = false;
    if (state.navigation.stage !== this.index) {
      goTo('main', this.index);
    } else {
      this.render();
    }
  }

  render() {
    const state = store.getState();

    const completed = state.topNavigation.stage > this.index;
    const content = ListItem(this.element, {
      completed,
      title: 'Försäkring',
      active: state.navigation.stage === this.index,
      id: 'insurance',
    });

    const part = document.createElement('div');

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
      if (this.showInsurances) {
        new InsuranceView(part, { lastStage: this.lastStage, onEdit: () => this.onEdit() });
      } else {
        part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--2">
            <h4 class="waykeecom-heading waykeecom-heading--4">Vill du teckna en försäkring på din nya bil?</h4>
            <div class="waykeecom-content">
              <p>Ange din uppskattade körsträcka för att se din försäkringskostnad. Därefter presenterar vi förslag på försäkringar som passar dig och din nya bil. I både hel- och halvförsäkring ingår trafikförsäkring som är obligatoriskt att ha. Ifall du har valt att finansiera bilen med ett billån är priset du ser rabatterat.</p>
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--2" id="${DISTANCE_NODE}"></div>
        </div>

        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--1" id="${SHOW_INSURANCES_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--1" id="${SKIP_INSURANCES_NODE}"></div>
        </div>
      `;

        new InputSelect(part.querySelector<HTMLDivElement>(`#${DISTANCE_NODE}`), {
          id: DISTANCE,
          title: 'Visa försäkringar',
          name: 'distance',
          value: state.drivingDistance,
          options: [
            {
              value: DrivingDistance.Between0And1000,
              title: translateDrivingDistance[DrivingDistance.Between0And1000],
            },
            {
              value: DrivingDistance.Between1000And1500,
              title: translateDrivingDistance[DrivingDistance.Between1000And1500],
            },
            {
              value: DrivingDistance.Between1500And2000,
              title: translateDrivingDistance[DrivingDistance.Between1500And2000],
            },
            {
              value: DrivingDistance.Between2000And2500,
              title: translateDrivingDistance[DrivingDistance.Between2000And2500],
            },
            {
              value: DrivingDistance.Over2500,
              title: translateDrivingDistance[DrivingDistance.Over2500],
            },
          ],
          onChange: (e) => this.onChangeDistance(e),
        });

        new ButtonArrowRight(part.querySelector<HTMLDivElement>(`#${SHOW_INSURANCES_NODE}`), {
          id: SHOW_INSURANCES,
          title: 'Visa försäkringar',
          onClick: () => this.onShowInsurances(),
        });

        new ButtonSkip(part.querySelector<HTMLDivElement>(`#${SKIP_INSURANCES_NODE}`), {
          id: SKIP_INSURANCES,
          title: 'Hoppa över detta steg',
          onClick: () => this.onSkipInsurances(),
        });
      }
    }

    content.appendChild(part);
  }
}

export default Insurance;
