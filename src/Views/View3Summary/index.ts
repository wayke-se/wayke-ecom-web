import watch from 'redux-watch';

import store from '../../Redux/store';
import { maskSSn, maskText } from '../../Utils/mask';
import ItemTileLarge from '../../Templates/ItemTileLarge';
import KeyValueListItem from '../../Templates/KeyValueListItem';
import { edit } from '../../Redux/action';

const EDIT_CUSTOMER = 'edit-customer';
const EDIT_DELIVERY = 'edit-delivery';
const EDIT_TRADE_IN = 'edit-trade-in';
const EDIT_FINANCIAL = 'edit-financial';
const EDIT_INSURANCE = 'edit-insurance';

class View3Summary {
  private element: Element;

  constructor(element: Element) {
    this.element = element;
    const w = watch(store.getState, 'navigation.view');
    store.subscribe(
      w((view) => {
        if (view === 3) {
          this.render();
        }
      })
    );
    this.render();
  }

  render() {
    const state = store.getState();

    const { order, stages } = state;

    const contactInformation = order?.getContactInformation();
    this.element.innerHTML = `
        <div class="waykeecom-page">
          <div class="waykeecom-page__body">
            <div class="waykeecom-container waykeecom-container--narrow">
              <div class="waykeecom-stack waykeecom-stack--4">
                <h2 class="waykeecom-heading waykeecom-heading--2">Sammanställning</h2>
                <div class="waykeecom-content">
                  <p>
                    <strong>Strax klart!</strong>
                  </p>
                  <p>Granska och godkänn din order för att reservera bilen. Efter det kommer ${
                    contactInformation?.name
                  } att kontakta dig för att slutföra köpet.</p>
                  <p>Köpet blir bindande först när du signerat det definitiva affärsförslaget med ${
                    contactInformation?.name
                  }. Det är även då betalningen sker. </p>
                </div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <h3 class="waykeecom-heading waykeecom-heading--3">Din order</h3>
                ${ItemTileLarge({
                  vehicle: state.vehicle,
                  order: state.order,
                  meta: `
                    <div class="waykeecom-stack waykeecom-stack--2">
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <div class="waykeecom-label">Billån</div>
                      </div>
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <ul class="waykeecom-key-value-list">
                          ${KeyValueListItem({
                            key: 'Volvofinans Bank',
                            value: '[PRIS] kr/mån',
                          })}
                        </ul>
                      </div>
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <div class="waykeecom-align waykeecom-align--end">
                          <button id="${EDIT_FINANCIAL}" title="Ändra finansiering" class="waykeecom-link">Ändra</button>
                        </div>
                      </div>
                    </div>
                    <div class="waykeecom-stack waykeecom-stack--2">
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <div class="waykeecom-label">Helförsäkring</div>
                      </div>
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <ul class="waykeecom-key-value-list">
                          ${KeyValueListItem({
                            key: 'Volvia',
                            value: '[PRIS] kr/mån',
                          })}
                        </ul>
                      </div>
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <div class="waykeecom-align waykeecom-align--end">
                          <button id="${EDIT_INSURANCE}" title="Ändra försäkring" class="waykeecom-link">Ändra</button>
                        </div>
                      </div>
                    </div>
                    <div class="waykeecom-stack waykeecom-stack--2">
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <div class="waykeecom-label">Tillägg</div>
                      </div>
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <ul class="waykeecom-key-value-list">
                          ${KeyValueListItem({
                            key: 'Volvia Care',
                            value: '[PRIS] kr/mån',
                          })}
                        </ul>
                      </div>
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <div class="waykeecom-align waykeecom-align--end">
                          <button title="Ändra tillägg" class="waykeecom-link">Ändra</button>
                        </div>
                      </div>
                    </div>
                  `,
                })}
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <div class="waykeecom-stack waykeecom-stack--2">
                  <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Inbytesbil</h4>
                </div>
                <div class="waykeecom-stack waykeecom-stack--2">
                  <div class="waykeecom-balloon">
                    <div class="waykeecom-stack waykeecom-stack--2">
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <div class="waykeecom-label">[REGNR]</div>
                      </div>
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <span class="waykeecom-font-medium">[MANUFACTURER] [MODEL_SERIES]</span> [MODEL_NAME] [MODEL_YEAR]
                      </div>
                    </div>
                    <div class="waykeecom-stack waykeecom-stack--2">
                      <hr class="waykeecom-separator" />
                    </div>
                    <div class="waykeecom-stack waykeecom-stack--2">
                      <ul class="waykeecom-key-value-list">
                        ${KeyValueListItem({
                          key: 'Mätarställning',
                          value: '[MÄTARSTÄLLNING] mil',
                        })}
                        ${KeyValueListItem({
                          key: 'Bilens skick',
                          value: '[SKICK]',
                        })}
                        ${KeyValueListItem({
                          key: 'Beskrivning',
                          value: '[BESKRIVNING]',
                        })}
                        ${KeyValueListItem({
                          key: 'Ungefärligt värde',
                          value: '~ [VÄRDE] kr',
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="waykeecom-stack waykeecom-stack--2">
                  <div class="waykeecom-align waykeecom-align--end">
                    <button id="${EDIT_TRADE_IN}" title="Ändra inbytesbil" class="waykeecom-link">Ändra</button>
                  </div>
                </div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <div class="waykeecom-stack waykeecom-stack--2">
                  <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Leverans</h4>
                </div>
                <div class="waykeecom-stack waykeecom-stack--2">
                  <div class="waykeecom-stack waykeecom-stack--1">
                    <ul class="waykeecom-key-value-list">
                      ${KeyValueListItem({
                        key: 'Leveranssätt',
                        value: state.homeDelivery ? 'Hemleverans' : 'Hämta hos handlaren',
                      })}
                    </ul>
                  </div>
                  <div class="waykeecom-stack waykeecom-stack--1">
                    <div class="waykeecom-align waykeecom-align--end">
                      <button id="${EDIT_DELIVERY}" title="Ändra leveranssätt" class="waykeecom-link">Ändra</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <div class="waykeecom-stack waykeecom-stack--2">
                  <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Kunduppgifter</h4>
                </div>
                <div class="waykeecom-stack waykeecom-stack--2">
                  <div class="waykeecom-stack waykeecom-stack--1">
                    <ul class="waykeecom-key-value-list">
                      ${KeyValueListItem({
                        key: 'För- och efternamn',
                        value: `${maskText(state.address?.givenName || '')} ${maskText(
                          state.address?.surname || ''
                        )}`,
                      })}
                      ${KeyValueListItem({
                        key: 'Personnummer',
                        value: maskSSn(state.customer.socialId),
                      })}
                      ${KeyValueListItem({
                        key: 'Adress',
                        value: `
                          ${maskText(state.address?.givenName || '')} ${maskText(
                          state.address?.surname || ''
                        )}<br />${state.address?.street}<br />${state.address?.postalCode} ${
                          state.address?.city
                        }
                        `,
                      })}
                      ${KeyValueListItem({
                        key: 'E-post',
                        value: state.customer.email,
                      })}
                      ${KeyValueListItem({
                        key: 'Telefonnummer',
                        value: state.customer.phone,
                      })}
                    </ul>
                  </div>
                  <div class="waykeecom-stack waykeecom-stack--1">
                    <div class="waykeecom-align waykeecom-align--end">
                      <button id="${EDIT_CUSTOMER}" title="Ändra kunduppgifter" class="waykeecom-link">Ändra</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <button type="button" title="Genomför order" class="waykeecom-button waykeecom-button--full-width waykeecom-button--action">
                  Genomför order
                </button>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <div class="waykeecom-disclaimer">
                  <div class="waykeecom-disclaimer__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      class="waykeecom-icon"
                    >
                      <title>Ikon: hänlås</title>
                      <path d="M13 6h-1V4c0-2.2-1.8-4-4-4S4 1.8 4 4v2H3c-1.1 0-2 .9-2 2v8h14V8c0-1.1-.9-2-2-2zM6 4c0-1.1.9-2 2-2s2 .9 2 2v2H6V4zm7 10H3V8h10v6z" />
                    </svg>
                  </div>
                  <div class="waykeecom-disclaimer__text">
                    <p>Dina uppgifter lagras och sparas säkert. Läs mer i vår <a href="#" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">personuppgiftspolicy</a>.</p>
                    <p>Genom att gå vidare godkänner jag Waykes <a href="#" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">användarvillkor</a>.</p>
                    <p>Vi reserverar oss för eventuell ändring i tillgången av utbjudna bilar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    `;

    if (stages) {
      const editCustomerIndex = stages?.findIndex((x) => x.name === 'customer');
      document
        .querySelector<HTMLButtonElement>(`#${EDIT_CUSTOMER}`)
        ?.addEventListener('click', () => edit(editCustomerIndex + 1));

      const editDeliveryIndex = stages?.findIndex((x) => x.name === 'delivery');
      document
        .querySelector<HTMLButtonElement>(`#${EDIT_DELIVERY}`)
        ?.addEventListener('click', () => edit(editDeliveryIndex + 1));

      const editTradeInIndex = stages?.findIndex((x) => x.name === 'tradeIn');
      document
        .querySelector<HTMLButtonElement>(`#${EDIT_TRADE_IN}`)
        ?.addEventListener('click', () => edit(editTradeInIndex + 1));

      const editFinancialIndex = stages?.findIndex((x) => x.name === 'financial');
      document
        .querySelector<HTMLButtonElement>(`#${EDIT_FINANCIAL}`)
        ?.addEventListener('click', () => edit(editFinancialIndex + 1));

      const editInsuranceIndex = stages?.findIndex((x) => x.name === 'insurance');
      document
        .querySelector<HTMLButtonElement>(`#${EDIT_INSURANCE}`)
        ?.addEventListener('click', () => edit(editInsuranceIndex + 1));
    }
  }
}

export default View3Summary;
