import Li from './Li';

interface Stage5Props {
  node: HTMLElement;
  active?: boolean;
  canActivate?: boolean;
  onThis: () => void;
  onNext: () => void;
}

const ID = 'wayke-view-2-stage-5';

class Stage5 {
  private props: Stage5Props;

  constructor(props: Stage5Props) {
    this.props = props;
    this.render();
  }

  render() {
    const {
      li: _li,
      activate,
      content: _content,
      proceed,
    } = Li({
      node: this.props.node,
      id: ID,
      title: 'Steg 5 - Försäkring',
      active: this.props.active,
    });

    if (this.props.canActivate) {
      activate.addEventListener('click', () => this.props.onThis());
    } else {
      activate.setAttribute('disabled', '');
    }

    proceed.addEventListener('click', () => this.props.onNext());
  }
}

export default Stage5;
