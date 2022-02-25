interface AppendChildSettings {
  htmlTag: keyof HTMLElementTagNameMap;
  className?: string;
}

class AppendChild {
  private element: HTMLElement;
  content: HTMLElement;

  constructor(
    element: HTMLElement | null | undefined,
    settings: AppendChildSettings,
    key?: string
  ) {
    if (!element) throw 'Missing element';
    this.element = element;
    const existingElement = key ? this.element.querySelector<HTMLElement>(`#${key}`) : undefined;
    if (existingElement) {
      // Reuse node
      existingElement.className = settings.className || '';
      this.content = existingElement;
    } else {
      const item = document.createElement(settings.htmlTag);
      if (key) {
        item.id = key;
      }
      item.className = settings.className || '';

      element.appendChild(item);

      this.content = item;
    }
  }
}

export default AppendChild;
