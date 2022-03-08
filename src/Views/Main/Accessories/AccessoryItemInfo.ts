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
      <p> info yo </p>
      <button>stäng</button>
    `;

    this.node.querySelector('button')?.addEventListener('click', () => this.props.onClose());
  }
}

export default AccessoryItemInfo;
