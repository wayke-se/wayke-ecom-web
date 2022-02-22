type Tones = 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  tone?: Tones;
  children?: string | Element;
  hidden?: boolean;
}

class Alert {
  private element: HTMLDivElement;
  private props: AlertProps;

  constructor(element: HTMLDivElement, props: AlertProps) {
    this.element = element;
    this.props = props;
  }

  hidden(hidden: boolean) {
    this.props.hidden = hidden;
  }

  render() {
    if (this.props.hidden) {
      this.element.innerHTML = '';
      return;
    }

    this.element.innerHTML = `
      <div
        class="waykeecom-alert ${this.props.tone ? `waykeecom-alert--${this.props.tone}` : ''}"
        role="alert"
      >
        <div class="waykeecom-alert__icon">
          <div class="waykeecom-alert__icon-badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="waykeecom-icon"
            >
              <title>Ikon: info</title>
              <path d="M7 6h2v8H7V6zm0-4v2h2V2H7z" />
            </svg>
          </div>
        </div>
        <div class="waykeecom-alert__content">
          ${this.props.children}
        </div>
      </div>
    `;
  }
}

export default Alert;
