import store from '../../Redux/store';
import StackItem from '../View2/TradeIn/StackItem';

class Disclaimer {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const state = store.getState();
    if (!state.order) throw 'no order';

    const conditionsPdfUri = state.order?.getConditionsPdfUri();

    const content = StackItem(this.element);

    content.innerHTML = `
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
          <p>Genom att gå vidare godkänner jag Waykes <a href="${conditionsPdfUri}" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">användarvillkor</a>.</p>
          <p>Vi reserverar oss för eventuell ändring i tillgången av utbjudna bilar.</p>
        </div>
      </div>
    `;
  }
}

export default Disclaimer;