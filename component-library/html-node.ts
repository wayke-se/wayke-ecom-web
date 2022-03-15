interface Attribute {
  key: string;
  value: string;
}

export interface HtmlNodeSettings {
  htmlTag: keyof HTMLElementTagNameMap;
  className?: string;
  id?: string;
  attributes?: Attribute[];
}

class HtmlNode {
  private element: HTMLElement;
  node: HTMLElement;

  constructor(element: HTMLElement | null | undefined, settings?: HtmlNodeSettings) {
    if (!element) throw 'Missing element';
    if (!settings) {
      // Attch only to given node
      this.element = element;
      this.node = element;
      return;
    }

    // Append to given node
    this.element = element;
    const existingElement = settings.id
      ? this.element.querySelector<HTMLElement>(`#${settings.id}`)
      : undefined;

    if (existingElement) {
      // Reuse node
      existingElement.className = settings.className || '';
      settings.attributes?.forEach((attribute) => {
        existingElement.setAttribute(attribute.key, attribute.value);
      });
      this.node = existingElement;
    } else {
      const item = document.createElement(settings.htmlTag);
      if (settings.id) {
        item.id = settings.id;
      }
      item.className = settings.className || '';
      settings.attributes?.forEach((attribute) => {
        item.setAttribute(attribute.key, attribute.value);
      });
      element.appendChild(item);

      this.node = item;
    }
  }
}

export default HtmlNode;
