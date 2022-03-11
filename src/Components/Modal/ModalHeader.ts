import HtmlNode from '../Extension/HtmlNode';

interface ModalHeaderProps {
  readonly title: string;
  readonly id: string;
  readonly onClose?: () => void;
}

class ModalHeader extends HtmlNode {
  private readonly props: ModalHeaderProps;

  constructor(element: HTMLElement, props: ModalHeaderProps) {
    super(element, {
      htmlTag: 'header',
      className: 'waykeecom-modal__header',
      id: props.id,
    });
    this.props = props;
    this.render();
  }

  render() {
    const { title, onClose } = this.props;
    this.node.innerHTML = `
      <div class="waykeecom-header">
        ${
          false && this.props.onClose
            ? `
          <button title="Stäng modalen" class="waykeecom-header__close-btn">
            <span class="waykeecom-sr-only">Stäng modalen</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="waykeecom-icon"
              aria-hidden="true"
            >
              <path d="M9.1 8l5.9 5.9-1.1 1.1L8 9.1 2.1 15 1 13.9 6.9 8 1 2.1 2.1 1 8 6.9 13.9 1 15 2.1 9.1 8z" />
            </svg>
          </button>
        `
            : ''
        }
        
        <div class="waykeecom-header__logo">
          <h2 class="waykeecom-no-margin">
            <span class="waykeecom-sr-only" id="wayke-ecom-title">${title}</span>
            <svg class="waykeecom-header__logo--wordmark" viewBox="0 0 548.95 123.3" preserveAspectRatio="xMinYMid" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <title>Wayke wordmark</title>
              <g>
                <path d="M275.16,48.31l-18.69,53.3h-12L219.59,28h15.08l16.84,52.57,18-52.88h12.29l18.08,53L316.68,28h13.64l-24.17,73.65H293.75Z"></path>
                <path d="M348.51,102c-12.8,0-26.41-9.45-26.41-27s13.61-27,26.41-27c5.12,0,12.39,2,16,7.48l.76,1.16V49h12.92v52.29H365.26V93.18l-.77,1.22C361,100,353,102,348.51,102Zm1.92-41.62c-7.37,0-15,5.48-15,14.65a14.67,14.67,0,0,0,15,14.65c7.39,0,14.87-5,14.87-14.65S357.63,60.36,350.42,60.36Z"></path>
                <path d="M408.36,123.3H395.14l9.92-22.93L381.51,49h14.88l15.39,35.53L427.16,49h13.43Z"></path>
                <path d="M456.35,77.54V101.3h-13V25.83h13V70.31l24-21.28h17.25L469.78,73.41,499,101.3H481.34Z"></path>
                <path d="M548.95,75.88v1.45H507.43c.52,8.16,6.5,14.36,15.18,14.36,8.37,0,11.78-4.23,12.71-5.68h13c-.83,5.37-8,16.63-25.72,16.63-16.94,0-28.4-11.77-28.4-27.47,0-16.22,11.36-27.47,27.37-27.47S548.95,58.84,548.95,75.88Zm-41.11-7.64h27.27c-2-6.61-6.82-10.33-13.53-10.33C514.45,57.92,509.49,61.73,507.84,68.24Z"></path>
              </g>
              <g>
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
              </g>
            </svg>
            <svg class="waykeecom-header__logo--symbol" viewBox="0 0 185.57 109.13" preserveAspectRatio="xMinYMid" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
          </h2>
        </div>
      </div>
    `;
    if (onClose) {
      this.node.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
        button.addEventListener('click', () => onClose());
      });
    }
  }
}

export default ModalHeader;
