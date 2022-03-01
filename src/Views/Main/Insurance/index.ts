import { IInsuranceOption, PaymentType } from '@wayke-se/ecom';
import watch from 'redux-watch';
import StageCompleted from '../../../Components/StageCompleted';
import { getInsurance } from '../../../Data/getInsurance';
import { setInsurance, goTo } from '../../../Redux/action';
import store from '../../../Redux/store';
import Alert from '../../../Templates/Alert';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import Loader from '../../../Templates/Loader';
import ListItem from '../ListItem';
import InsuranceList from './InsuranceList';

const PROCEED = 'button-insurance-proceed';
const CHANGE_BUTTON = 'button-insurance-change';
const INSURANCE_GRID_LIST_NODE = 'insurance-grid-list-node';

class Insurance {
  private element: HTMLDivElement;
  private index: number;
  private lastStage: boolean;
  private insurances?: IInsuranceOption[];
  private requestError: boolean = false;

  constructor(element: HTMLDivElement, index: number, lastStage: boolean) {
    this.element = element;
    this.index = index;
    this.lastStage = lastStage;

    const w = watch(store.getState, 'navigation');
    store.subscribe(w(() => this.render()));
    const w2 = watch(store.getState, 'edit');
    store.subscribe(w2(() => this.render()));

    const w3 = watch(store.getState, 'drivingDistance');
    store.subscribe(w3(() => this.fetchInsurance()));

    const w4 = watch(store.getState, 'customer.socialId');
    store.subscribe(w4(() => this.fetchInsurance()));

    this.fetchInsurance();
    this.render();
  }

  fetchInsurance() {
    const state = store.getState();
    if (state.customer.socialId) {
      this.getInsurances();
    }
  }

  async getInsurances() {
    this.requestError = false;
    try {
      const state = store.getState();
      const [responseWithLoan, responseWithoutLoan] = await Promise.all([
        getInsurance(PaymentType.Loan, state.drivingDistance),
        getInsurance(PaymentType.Cash, state.drivingDistance),
      ]);

      const insuranceWithLoan = responseWithLoan.getInsuranceOption();
      const insuranceWithoutLoan = responseWithoutLoan.getInsuranceOption();

      const isSame =
        JSON.stringify(insuranceWithLoan).localeCompare(JSON.stringify(insuranceWithoutLoan)) === 0;
      if (isSame) {
        this.insurances = [insuranceWithoutLoan];
      } else {
        this.insurances = [insuranceWithLoan, insuranceWithoutLoan];
      }
    } catch (e) {
      this.requestError = true;
    } finally {
      this.render();
    }
  }

  private onProceed() {
    setInsurance(this.lastStage);
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
        <div class="waykeecom-stack waykeecom-stack--3" id="${INSURANCE_GRID_LIST_NODE}"></div>


        <div class="waykeecom-stack waykeecom-stack--3">
          <button type="button" id="${PROCEED}" title="Fortsätt till nästa steg" class="waykeecom-button waykeecom-button--full-width waykeecom-button--action">
            <span class="waykeecom-button__content">Fortsätt</span>
            <span class="waykeecom-button__content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                class="waykeecom-icon"
              >
                <title>Ikon: pil höger</title>
                <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
              </svg>
            </span>
          </button>
        </div>
      `;

      const insuranceListNode = part.querySelector<HTMLDivElement>(`#${INSURANCE_GRID_LIST_NODE}`);
      if (insuranceListNode) {
        if (this.requestError) {
          insuranceListNode.innerHTML = Alert({
            tone: 'error',
            children: '<p>Det gick inte att hämta försäkringar.</p>',
          });
        } else {
          const insurances = this.insurances;
          if (insurances?.length) {
            new InsuranceList(insuranceListNode, insurances);
          } else {
            insuranceListNode.innerHTML = Loader();
          }
        }
      }

      part
        .querySelector<HTMLButtonElement>(`#${PROCEED}`)
        ?.addEventListener('click', () => this.onProceed());
    }

    content.appendChild(part);
  }
}

export default Insurance;
