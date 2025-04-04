type Tones = 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  tone?: Tones;
  children?: string | Element;
  polite?: boolean;
}

const Alert = ({ tone, children, polite }: AlertProps) => `
  <div class="waykeecom-alert ${tone ? `waykeecom-alert--${tone}` : ''}" role="${polite ? 'status' : 'alert'}" ${polite ? 'aria-live="polite"' : ''}>
    <div class="waykeecom-alert__icon">
      <div class="waykeecom-alert__icon-badge">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          class="waykeecom-icon"
          data-icon="Info"
        >
          <path d="M7 6h2v8H7V6zm0-4v2h2V2H7z" />
        </svg>
      </div>
    </div>
    <div class="waykeecom-alert__content">
     ${children}
    </div>
  </div>
`;

export default Alert;
