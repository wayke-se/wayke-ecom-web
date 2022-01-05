import Li from './Li';

interface Stage4Props {
  node: HTMLElement;
  active?: boolean;
  canActivate?: boolean;
  onThis: () => void;
  onNext: () => void;
}

const ID = 'wayke-view-2-stage-4';

class Stage4 {
  private props: Stage4Props;

  constructor(props: Stage4Props) {
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
      title: 'Steg 4 - Finansiering',
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

export default Stage4;
