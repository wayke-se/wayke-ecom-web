import ItemTileLarge from '../../Templates/ItemTileLarge';

import { getOrder } from '../../Data/getOrder';
import { proceedToView2Stage1, setOrder } from '../../Redux/action';
import store from '../../Redux/store';
import HowTo from './HowTo';
import watch from 'redux-watch';
import ButtonArrowRight from '../../Components/ButtonArrowRight';

const PROCEED_BUTTON = 'wayke-view-1-proceed';
const PROCEED_BUTTON_NODE = `${PROCEED_BUTTON}-node`;
const PROCEED_BUTTON_LOADER = `${PROCEED_BUTTON}-loader`;

class View1v2 {
  private element: Element;
  private loader?: HTMLDivElement;
  private proceedButton?: HTMLButtonElement;

  constructor(element: Element) {
    this.element = element;

    const w = watch(store.getState, 'order');
    store.subscribe(
      w(() => {
        this.render();
      })
    );

    this.init();
    this.render();
  }

  async init() {
    const state = store.getState();

    if (!state.vehicle) {
      throw 'No vehicle present';
    }
    try {
      this.proceedButton?.setAttribute('disabled', '');
      if (this.loader) {
        this.loader.style.display = '';
      }
      const order = await getOrder(state.vehicle.id);
      setOrder(order);
      this.proceedButton?.removeAttribute('disabled');
    } catch (e) {
      throw e;
    } finally {
      if (this.loader) {
        this.loader.style.display = 'none';
      }
    }
  }

  render() {
    const state = store.getState();

    if (!state.order) {
      this.element.innerHTML = `
        <div class="page">
          <div class="page__body">
            <div class="container container--narrow">
              <div class="stack stack--3">
                <h2 class="heading heading--3 no-margin">Vad roligt att du vill köpa denna bil!</h2>
              </div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    this.element.innerHTML = `
      <div class="page">
        <div class="page__body">
          <div class="container container--narrow">
            <div class="stack stack--3">
              <h2 class="heading heading--3 no-margin">Vad roligt att du vill köpa denna bil!</h2>
            </div>
            <div class="stack stack--3" style="${
              state.order ? 'display: none;' : ''
            }" id="${PROCEED_BUTTON_LOADER}-loader">
              <div>Laddar...</div>
            </div>
            ${ItemTileLarge({ vehicle: state.vehicle, order: state.order })}
            ${HowTo({ order: state.order })}
            <div class="stack stack--3" id="${PROCEED_BUTTON_NODE}">
              <button type="button" id="${PROCEED_BUTTON}" disabled="" title="Gå vidare" class="button button--full-width button--action">
                <span class="button__content">Gå vidare</span>
                <span class="button__content">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    class="icon"
                  >
                    <title>Ikon: pil höger</title>
                    <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
        <footer class="page__footer">
          <div class="container container--narrow">
            <h2 class="heading heading--4">Köp online hos Wayke</h2>
            <ul class="checklist">
              <li class="checklist__item">Trygg hantering av personuppgifter</li>
              <li class="checklist__item">Reservera bilen nu – betalning och avtalsskrivning sker senare med handlaren</li>
              <li class="checklist__item">Inte bindande förrän avtal skrivits ihop med handlaren</li>
              <li class="checklist__item">Bara kontrollerade bilar</li>
            </ul>
          </div>
        </footer>
      </div>
    `;

    new ButtonArrowRight(document.querySelector<HTMLDivElement>(`#${PROCEED_BUTTON_NODE}`), {
      id: PROCEED_BUTTON,
      title: 'Gå vidare',
      onClick: () => proceedToView2Stage1(),
    });

    const loader = document.querySelector<HTMLDivElement>(`#${PROCEED_BUTTON_LOADER}`);
    if (loader) {
      this.loader = loader;
    }
  }
}

export default View1v2;
