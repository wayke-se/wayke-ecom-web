import watch from 'redux-watch';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ButtonSkip from '../../../Components/Button/ButtonSkip';
import StageCompleted from '../../../Components/StageCompleted';
import { setInsurance, goTo, initInsurances } from '../../../Redux/action';
import store from '../../../Redux/store';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import ListItem from '../ListItem';
import InsuranceView from './InsuranceView';

const CHANGE_BUTTON = 'button-insurance-change';

const SHOW_INSURANCES = 'button-insurances-show';
const SHOW_INSURANCES_NODE = `${SHOW_INSURANCES}-node`;

const SKIP_INSURANCES = 'button-insurances-skip';
const SKIP_INSURANCES_NODE = `${SKIP_INSURANCES}-node`;

class Insurance {
  private element: HTMLDivElement;
  private index: number;
  private lastStage: boolean;

  constructor(element: HTMLDivElement, index: number, lastStage: boolean) {
    this.element = element;
    this.index = index;
    this.lastStage = lastStage;

    const w = watch(store.getState, 'navigation');
    store.subscribe(w(() => this.render()));
    const w2 = watch(store.getState, 'edit');
    store.subscribe(w2(() => this.render()));

    this.render();
  }

  private onSkipInsurances() {
    setInsurance(this.lastStage);
  }

  private onShowInsurances() {
    initInsurances(this.lastStage);
  }

  private onEdit() {
    goTo('main', this.index);
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
      new StageCompleted(content, {
        keyValueList: [
          {
            key: 'Försäkring',
            value: 'Ingen',
          },
        ],
        changeButtonTitle: 'Ändra försäkring',
        onEdit: () => this.onEdit(),
      });
    } else if (state.navigation.stage === this.index) {
      if (state.wantInsurance) {
        new InsuranceView(part, { lastStage: this.lastStage });
      } else {
        part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--2">
            <h4 class="waykeecom-heading waykeecom-heading--4">Vill du teckna en försäkring på din nya bil?</h4>
            <div class="waykeecom-content">
              <p>Ange din uppskattade körsträcka för att se din försäkringskostnad. Därefter presenterar vi förslag på försäkringar som passar dig och din nya bil. I både hel- och halvförsäkring ingår trafikförsäkring som är obligatoriskt att ha. Ifall du har valt att finansiera bilen med ett billån är priset du ser rabatterat.</p>
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--2">
            <div class="waykeecom-stack waykeecom-stack--1">
              <ul class="waykeecom-key-value-list">
                ${KeyValueListItem({
                  key: 'Uppskattad körsträcka',
                  value: '0-1 000 mil/år',
                })}
              </ul>
            </div>
            <div class="waykeecom-stack waykeecom-stack--1">
              <div class="waykeecom-align waykeecom-align--end">
                <button id="${CHANGE_BUTTON}" title="Ändra beräknad körsträcka" class="waykeecom-link">Ändra</button>
              </div>
            </div>
          </div>
        </div>

        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--1" id="${SHOW_INSURANCES_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--1" id="${SKIP_INSURANCES_NODE}"></div>
        </div>
      `;

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
