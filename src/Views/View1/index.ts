import { getOrder } from '../../Data/getOrder';

interface View1Props {
  id: string;
  onNext: () => void;
}

const PROCEED_BUTTON = 'wayke-view-1-proceed';

class View1 {
  private props: View1Props;

  constructor(props: View1Props) {
    this.props = props;
    this.render();
    this.init();
  }

  async init() {
    const container = document.getElementById('wayke-ecom');
    if (container) {
      const button = document.querySelector<HTMLButtonElement>(`#${PROCEED_BUTTON}`);
      const loader = document.querySelector<HTMLDivElement>(`#${PROCEED_BUTTON}-loader`);
      if (button && loader) {
        try {
          button.setAttribute('disabled', '');
          loader.style.display = '';
          const _response = await getOrder(this.props.id);
          button.removeAttribute('disabled');
        } catch (e) {
          throw e;
        } finally {
          loader.style.display = 'none';
        }
      }
    }
  }

  render() {
    const container = document.getElementById('wayke-ecom');
    if (container) {
      container.innerHTML = `
        <div style="padding: 32px 16px">
          <div class="stack stack--3">
            <h3 class="heading heading--3 no-margin">Vad roligt att du vill köpa denna bil!</h3>
          </div>
          <div class="stack stack--3">
            <div id="${PROCEED_BUTTON}-loader">Laddar...</div>
          </div>
          <div class="stack stack--3">
            <button type="button" id="${PROCEED_BUTTON}" title="Gå vidare" class="button button--full-width button--action">
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
      `;
      container
        .querySelector(`#${PROCEED_BUTTON}`)
        ?.addEventListener('click', () => this.props.onNext());
    }
  }
}

export default View1;
