import HtmlNode from '../../../Components/Extension/HtmlNode';

interface AccessoryItemInfoProps {
  onClose: () => void;
}

class AccessoryItemInfo extends HtmlNode {
  private props: AccessoryItemInfoProps;

  constructor(element: HTMLElement, props: AccessoryItemInfoProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <button type="button" class="waykeecom-link waykeecom-link--has-content" title="Tillbaka">
          <span class="waykeecom-link__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="waykeecom-icon"
            >
              <title>Ikon: pil vänster</title>
              <path d="m.8 7.2 4.8-4.8 1.7 1.7-2.7 2.7h10.2c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2H4.6l2.7 2.7-1.7 1.7L.8 8.8 0 8l.8-.8z"/>
            </svg>
          </span>
          <span class="waykeecom-link__content">Tillbaka</span>
        </button>
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <p>info yo</p>
      </div>
    `;

    this.node.querySelector('button')?.addEventListener('click', () => this.props.onClose());
  }
}

export default AccessoryItemInfo;
