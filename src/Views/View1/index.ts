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
        <div>
          <button id="${PROCEED_BUTTON}">Gå vidare</button>
          <div id="${PROCEED_BUTTON}-loader">Laddar...</div>
        </div>
      `;
      container
        .querySelector(`#${PROCEED_BUTTON}`)
        ?.addEventListener('click', () => this.props.onNext());
    }
  }
}

export default View1;
