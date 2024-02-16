import StackNode from '../../Components/Extension/StackNode';
import { WaykeStore } from '../../Redux/store';
import KeyValueListItem from '../../Templates/KeyValueListItem';
import { translateTradeInCondition } from '../../Utils/constants';
import { prettyNumber } from '../../Utils/format';

interface TradeInProps {
  readonly store: WaykeStore;
}

class TradeIn extends StackNode {
  private readonly props: TradeInProps;
  constructor(element: HTMLElement, props: TradeInProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { store } = this.props;
    const state = store.getState();
    const { order, tradeIn, tradeInVehicle } = state;
    if (!order?.allowsTradeIn) return;

    this.node.innerHTML = `
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
                <span class="waykeecom-text waykeecom-text--font-medium">${
                  tradeInVehicle.manufacturer
                } ${tradeInVehicle.modelSeries}</span> ${tradeInVehicle.modelName} ${
                  tradeInVehicle.modelYear
                }
              </div>
            </div>
            <div class="waykeecom-stack waykeecom-stack--2">
              <hr class="waykeecom-separator" />
            </div>
            <div class="waykeecom-stack waykeecom-stack--2">
              <ul class="waykeecom-key-value-list">
                ${KeyValueListItem({
                  key: 'Miltal',
                  value: `${tradeIn.mileage} mil`,
                })}
                ${KeyValueListItem({
                  key: 'Beskrivning',
                  value: `${tradeIn.description}`,
                })}
                ${KeyValueListItem({
                  key: 'Bilens skick',
                  value: translateTradeInCondition[tradeIn.condition],
                })}
                ${KeyValueListItem({
                  key: 'Ungefärligt värde',
                  value: `~ ${prettyNumber(tradeInVehicle.valuation, { postfix: 'kr' })}`,
                })}
              </ul>
            </div>
          </div>
        </div>`
            : `<div class="waykeecom-stack waykeecom-stack--2">
                <ul class="waykeecom-key-value-list">
                  ${KeyValueListItem({
                    key: 'Inbytesbil',
                    value: 'Nej',
                  })}
                </ul>
            </div>`
        }
      </div>
    `;
  }
}

export default TradeIn;
