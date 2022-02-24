import { goTo, initTradeIn } from '../../Redux/action';
import store from '../../Redux/store';
import KeyValueListItem from '../../Templates/KeyValueListItem';
import { translateTradeInCondition } from '../../Utils/constants';
import { prettyNumber } from '../../Utils/format';
import StackItem from '../Main/TradeIn/StackItem';

const EDIT_TRADE_IN = 'edit-trade-in';

class TradeIn {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const state = store.getState();
    const { order, tradeIn, tradeInVehicle } = state;
    if (!order?.allowsTradeIn) return;

    const content = StackItem(this.element);

    content.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--4">
        <div class="waykeecom-stack waykeecom-stack--2">
          <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Inbytesbil</h4>
        </div>
        
        ${
          tradeIn && tradeIn.condition && tradeInVehicle
            ? `<div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-balloon">
            <div class="waykeecom-stack waykeecom-stack--2">
              <div class="waykeecom-stack waykeecom-stack--05">
                <div class="waykeecom-label">${tradeIn.registrationNumber}</div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--05">
                <span class="waykeecom-font-medium">${tradeInVehicle.manufacturer} ${
                tradeInVehicle.modelSeries
              }</span> ${tradeInVehicle.modelName} ${tradeInVehicle.modelYear}
              </div>
            </div>
            <div class="waykeecom-stack waykeecom-stack--2">
              <hr class="waykeecom-separator" />
            </div>
            <div class="waykeecom-stack waykeecom-stack--2">
              <ul class="waykeecom-key-value-list">
                ${KeyValueListItem({
                  key: 'Mätarställning',
                  value: `${tradeIn.mileage} mil`,
                })}
                ${KeyValueListItem({
                  key: 'Bilens skick',
                  value: translateTradeInCondition[tradeIn.condition],
                })}
                ${KeyValueListItem({
                  key: 'Beskrivning',
                  value: `${tradeIn.description}`,
                })}
                ${KeyValueListItem({
                  key: 'Ungefärligt värde',
                  value: `~ ${prettyNumber(tradeInVehicle.valuation, { postfix: 'kr' })}`,
                })}
              </ul>
            </div>
          </div>
        </div>`
            : `<div class="waykeecom-stack waykeecom-stack--2">Nej</div>`
        }
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-align waykeecom-align--end">
            <button id="${EDIT_TRADE_IN}" title="Ändra inbytesbil" class="waykeecom-link">Ändra</button>
          </div>
        </div>
      </div>
    `;

    const editTradeInIndex = state.stages?.findIndex((x) => x.name === 'tradeIn');
    if (editTradeInIndex !== undefined && state.stages) {
      const lastStage = editTradeInIndex === state.stages.length - 1;

      document
        .querySelector<HTMLButtonElement>(`#${EDIT_TRADE_IN}`)
        ?.addEventListener('click', () => {
          initTradeIn(lastStage);
          goTo('main', editTradeInIndex + 1);
        });
    }
  }
}

export default TradeIn;
