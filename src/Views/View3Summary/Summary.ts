import store from '../../Redux/store';
import StackItem from '../View2/TradeIn/StackItem';

class Summary {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const state = store.getState();
    const contactInformation = state.order?.getContactInformation();

    const content = StackItem(this.element);

    content.innerHTML = `
      <h2 class="waykeecom-heading waykeecom-heading--2">Sammanställning</h2>
      <div class="waykeecom-content">
        <p>
          <strong>Strax klart!</strong>
        </p>
        <p>Granska och godkänn din order för att reservera bilen. Efter det kommer ${contactInformation?.name} att kontakta dig för att slutföra köpet.</p>
        <p>Köpet blir bindande först när du signerat det definitiva affärsförslaget med ${contactInformation?.name}. Det är även då betalningen sker. </p>
      </div>

      <div style="margin: 100px 0">
        <div class="waykeecom-overflow-grid">
          <div class="waykeecom-overflow-grid__list-wrapper">
            <ul class="waykeecom-overflow-grid__list">
              <li class="waykeecom-overflow-grid__item">
                <div class="waykeecom-tile">
                  <img src="https://via.placeholder.com/400x300" alt="" class="waykeecom-tile__hero" />
                  <div class="waykeecom-tile__body">
                    <div class="waykeecom-tile__header">
                      <div class="waykeecom-tile__title">Helförsäkring</div>
                      <div class="waykeecom-tile__image">
                        <div class="waykeecom-logo">
                          <img src="https://via.placeholder.com/80x24" alt="" class="waykeecom-logo__image" />
                        </div>
                      </div>
                    </div>
                    <div class="waykeecom-tile__price">424 kr/mån</div>
                    <div class="waykeecom-tile__description">Med finansering via Volvofinans Bank</div>
                    <div class="waykeecom-tile__read-more">
                      <button type="button" title="" class="waykeecom-link">Läs mer</button>
                    </div>
                  </div>
                  <div class="waykeecom-tile__footer">
                    <button type="button" title="Lägg till" class="waykeecom-button waykeecom-button--action waykeecom-button--size-small">
                      <span class="waykeecom-button__content">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          class="waykeecom-icon"
                        >
                          <title>Ikon: plus</title>
                          <path d="M14 7v2H9v5H7V9H2V7h5V2h2v5h5z" />
                        </svg>
                      </span>
                      <span class="waykeecom-button__content">Lägg till</span>
                    </button>
                  </div>
                </div>
              </li>
              <li class="waykeecom-overflow-grid__item">
                <div class="waykeecom-tile">
                  <img src="https://via.placeholder.com/400x300" alt="" class="waykeecom-tile__hero" />
                  <div class="waykeecom-tile__body">
                    Body
                  </div>
                  <div class="waykeecom-tile__footer">
                    Footer
                  </div>
                </div>
              </li>
              <li class="waykeecom-overflow-grid__item">
                <div class="waykeecom-tile">
                  <img src="https://via.placeholder.com/400x300" alt="" class="waykeecom-tile__hero" />
                  <div class="waykeecom-tile__body">
                    Body
                  </div>
                  <div class="waykeecom-tile__footer">
                    Footer
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="waykeecom-overflow-grid__nav waykeecom-overflow-grid__nav--prev">
            <button type="button" title="Visa föregående försäkring" class="waykeecom-icon-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                class="waykeecom-icon"
              >
                <title>Ikon: vinkel vänster</title>
                <path d="m5.4 7 5.2-5 1 1-5.2 5 5.2 5-1.1 1-5.2-5-1-1 1.1-1z" />
              </svg>
            </button>
          </div>
          <div class="waykeecom-overflow-grid__nav waykeecom-overflow-grid__nav--next">
            <button type="button" title="Visa nästa försäkring" class="waykeecom-icon-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                class="waykeecom-icon"
              >
                <title>Ikon: vinkel höger</title>
                <path d="m10.5 9-5.2 5-1-1 5.2-5-5.2-5 1.1-1 5.2 5 1 1-1.1 1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

export default Summary;
