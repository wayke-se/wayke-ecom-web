import Li from './Li';

interface Stage3Props {
  node: HTMLElement;
  active?: boolean;
  canActivate?: boolean;
  onThis: () => void;
  onNext: () => void;
}

const ID = 'wayke-view-2-stage-3';

class Stage3 {
  private props: Stage3Props;

  constructor(props: Stage3Props) {
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
      title: 'Inbytesbil',
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

export default Stage3;
