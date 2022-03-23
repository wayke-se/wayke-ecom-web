import HtmlNode from '../Extension/HtmlNode';

interface ArrowProps {
  direction: 'left' | 'right';
  hide?: boolean;
  onClick: () => void;
}

class Arrow extends HtmlNode {
  private props: ArrowProps;

  constructor(element: HTMLElement | null, props: ArrowProps) {
    super(element);
    this.props = props;
    this.render();
  }

  hide(hide: boolean) {
    if (this.props.hide !== hide) {
      this.props.hide = hide;
      this.render();
    }
  }

  private render() {
    if (this.props.hide) {
      this.node.innerHTML = '';
      return;
    }

    const { title, dataIcon, path } =
      this.props.direction === 'left'
        ? {
            title: 'Visa föregående',
            dataIcon: 'Chevron left',
            path: '<path d="m5.4 7 5.2-5 1 1-5.2 5 5.2 5-1.1 1-5.2-5-1-1 1.1-1z" />',
          }
        : {
            title: 'Visa nästa',
            dataIcon: 'Chevron right',
            path: '<path d="m10.5 9-5.2 5-1-1 5.2-5-5.2-5 1.1-1 5.2 5 1 1-1.1 1z" />',
          };

    this.node.innerHTML = `
      <button type="button" title="${title}" class="waykeecom-icon-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          class="waykeecom-icon"
          data-icon="${dataIcon}"
        >
          ${path}
        </svg>
      </button>
    `;

    this.node
      .querySelector<HTMLUListElement>(`button`)
      ?.addEventListener('click', () => this.props.onClick());
  }
}

export default Arrow;
