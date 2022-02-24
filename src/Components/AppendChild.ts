interface AppendChildSettings {
  htmlTag: keyof HTMLElementTagNameMap;
  className?: string;
}

class AppendChild {
  private element: HTMLElement;
  content: HTMLElement;

  constructor(element: HTMLElement, settings: AppendChildSettings) {
    this.element = element;
    const item = document.createElement(settings.htmlTag);
    item.className = settings.className || '';

    element.appendChild(item);

    this.content = item;
  }
}

export default AppendChild;
