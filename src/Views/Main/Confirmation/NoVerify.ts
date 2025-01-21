import i18next from 'i18next';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';

interface NoVerifyProps {
  store: WaykeStore;
}

class NoVerify extends HtmlNode {
  private props: NoVerifyProps;

  constructor(element: HTMLElement | null, props: NoVerifyProps) {
    super(element);
    this.props = props;

    this.render();
    // this.init();
  }

  // init() {}

  render() {
    this.node.innerHTML = `
      <div class="confirmation">
        <h1>${i18next.t('confirmation.title')}</h1>
        <p>${i18next.t('confirmation.message')}</p>
        <button id="confirm-button">${i18next.t('confirmation.confirmButton')}</button>
      </div>
    `;
  }
}

export default NoVerify;
