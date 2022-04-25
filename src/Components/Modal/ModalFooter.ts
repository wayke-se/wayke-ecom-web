import HtmlNode from '../Extension/HtmlNode';

interface ModalFooterProps {
  readonly id: string;
}
class ModalFooter extends HtmlNode {
  private readonly props: ModalFooterProps;

  constructor(element: HTMLElement, props: ModalFooterProps) {
    super(element, {
      htmlTag: 'footer',
      className: 'waykeecom-modal__footer',
      id: props.id,
    });

    this.props = props;
    this.render();
  }

  render() {
    this.node.innerHTML = `
      <div class="waykeecom-hstack waykeecom-hstack--spacing-1 waykeecom-hstack--align-center">
        <div class="waykeecom-hstack__item waykeecom-hstack__item--no-shrink">
          <svg class="waykeecom-modal__footer-logo" viewBox="0 0 185.57 109.13" preserveAspectRatio="xMinYMid" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <title>Wayke symbol</title>
            <circle cx="4.25" cy="39.68" r="4.25"></circle>
            <circle cx="25.15" cy="68.03" r="4.96"></circle>
            <circle cx="46.04" cy="96.38" r="6.38"></circle>
            <circle cx="66.93" cy="68.03" r="7.09"></circle>
            <circle cx="87.82" cy="39.68" r="8.5"></circle>
            <circle cx="108.72" cy="68.03" r="10.63"></circle>
            <circle cx="129.61" cy="96.38" r="12.76"></circle>
            <circle cx="150.5" cy="68.03" r="13.47"></circle>
            <circle cx="171.4" cy="39.68" r="14.17"></circle>
            <circle cx="129.61" cy="39.68" r="12.05"></circle>
            <circle cx="66.93" cy="11.34" r="7.09"></circle>
            <circle cx="150.5" cy="11.34" r="11.34"></circle>
            <circle cx="108.72" cy="11.34" r="10.63"></circle>
            <circle cx="46.04" cy="39.68" r="6.38"></circle>
            <circle cx="25.15" cy="11.34" r="4.96"></circle>
          </svg>
        </div>
        <div class="waykeecom-hstack__item">
          Powered by <a href="https://www.wayke.se/" title="Gå till wayke.se" target="_blank" rel="noopener noreferer" class="waykeecom-link waykeecom-link--no-external-icon waykeecom-link--current-color waykeecom-link--underline">Wayke</a>
        </div>
      </div>
    `;
  }
}

export default ModalFooter;
