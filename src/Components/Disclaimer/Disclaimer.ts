import HtmlNode from '../Extension/HtmlNode';

interface DisclaimerProps {
  readonly text: string;
}
class Disclaimer extends HtmlNode {
  private readonly props: DisclaimerProps;

  constructor(element: HTMLElement | null, props: DisclaimerProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    this.node.innerHTML = `
      <div class="waykeecom-disclaimer">
        <div class="waykeecom-disclaimer__text">
          ${this.props.text}
        </div>
      </div>
    `;
  }
}

export default Disclaimer;
