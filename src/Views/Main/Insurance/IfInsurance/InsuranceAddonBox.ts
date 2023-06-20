import HtmlNode from '../../../../Components/Extension/HtmlNode';

class InsuracenAddonBox extends HtmlNode {
  constructor(element: HTMLElement | null) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--1' });
    this.render();
  }

  render() {
    this.node.innerHTML = `<div class="waykeecom-box"></div>`;

    return this.node.querySelector<HTMLElement>('.waykeecom-box') as HTMLElement;
  }
}

export default InsuracenAddonBox;
