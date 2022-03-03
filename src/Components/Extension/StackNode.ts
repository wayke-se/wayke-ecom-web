import HtmlNode from './HtmlNode';

class StackNode extends HtmlNode {
  constructor(element: HTMLElement) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--4' });
  }
}

export default StackNode;
