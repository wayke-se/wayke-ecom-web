import i18next from 'i18next';
import HtmlNode from '../Extension/HtmlNode';

const helpClassName = 'waykeecom-input-label__help';
const foldoutClassName = 'waykeecom-input-label__foldout';

interface InputInformationProps {
  readonly information?: string;
  readonly onClickInformation?: (visible: boolean) => void;
}

class InputInformation extends HtmlNode {
  private readonly props: InputInformationProps;
  private open: boolean = false;

  constructor(element: HTMLElement | null | undefined, props: InputInformationProps) {
    super(element);
    this.props = props;

    this.render();
  }

  onClick() {
    this.open = !this.open;
    if (this.props.onClickInformation) {
      this.props.onClickInformation(this.open);
    }
    this.render();
  }

  render() {
    const { information } = this.props;
    if (information) {
      const existHelp = this.node.querySelector(`.${helpClassName}`);
      const existFoldout = this.node.querySelector(`.${foldoutClassName}`);

      const label = existHelp || document.createElement('div');
      if (!existHelp) {
        label.className = helpClassName;
      }

      if (this.open) {
        label.innerHTML = `
          <button class="waykeecom-input-label__help-btn" title="${i18next.t('glossary.whatDoesThisMean')}">
            <span class="waykeecom-sr-only">${i18next.t('glossary.closeHelp')}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="waykeecom-icon"
              aria-hidden="true"
              data-icon="Close circle"
            >
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm3.5-8.1L9.4 8l2.1 2.1-1.4 1.4L8 9.4l-2.1 2.1-1.4-1.4L6.6 8 4.5 5.9l1.4-1.4L8 6.6l2.1-2.1 1.4 1.4z" />
            </svg>
          </button>
        `;
        const informationElement = document.createElement('div');
        informationElement.className = foldoutClassName;
        informationElement.innerHTML = information;
        label.parentNode?.appendChild(informationElement);
      } else {
        existFoldout?.remove();
        label.innerHTML = `
          <button class="waykeecom-input-label__help-btn" title="${i18next.t('glossary.whatDoesThisMean')}">
            <span class="waykeecom-sr-only">${i18next.t('glossary.showHelp')}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="waykeecom-icon"
              aria-hidden="true"
              data-icon="Questionmark circle"
            >
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm-1.4-3.8h1.9V12H6.6v-1.8zm3.8-3.4c0 1-.5 1.5-1.4 2l-.4.3c-.3.1-.3.2-.3.4v.1H6.7v-.3c0-.6.1-.9.8-1.3l.7-.4c.3-.2.6-.4.6-.8s-.3-.7-.7-.7c-.5 0-.8.3-.8.8v.3H5.7v-.4c0-1.2.8-2 2.3-2 1.5 0 2.4.7 2.4 2z" />
            </svg>
          </button>
        `;
      }

      label.querySelector('button')?.addEventListener('click', () => this.onClick());
      if (!existHelp) {
        this.node.appendChild(label);
      }
    }
  }
}

export default InputInformation;
