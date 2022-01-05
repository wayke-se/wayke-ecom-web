import Li from './Li';

interface Stage2Props {
  node: HTMLElement;
  active?: boolean;
  canActivate?: boolean;
  onThis: () => void;
  onNext: () => void;
}

const ID = 'wayke-view-2-stage-2';

class Stage2 {
  private props: Stage2Props;

  constructor(props: Stage2Props) {
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
      title: 'Steg 2 - Leverans',
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

export default Stage2;
