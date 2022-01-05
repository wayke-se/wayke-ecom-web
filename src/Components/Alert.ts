interface AlertProps {
  tone?: 'success' | 'warning' | 'error' | 'info';
  children?: string | Element;
}

const Alert = ({ tone, children }: AlertProps) => `
  <div class="alert ${tone ? `alert--${tone}` : ''}">
    <div class="alert__icon">
      <div class="alert__icon-badge">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          class="icon"
        >
          <title>Ikon: info</title>
          <path d="M7 6h2v8H7V6zm0-4v2h2V2H7z" />
        </svg>
      </div>
    </div>
    <div class="alert__content">
     ${children}
    </div>
  </div>
`;

export default Alert;
