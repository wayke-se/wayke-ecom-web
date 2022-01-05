import Li from "./Li";

interface Stage6Props {
  node: HTMLElement;
  active?: boolean;
  canActivate?: boolean;
  onThis: () => void;
  onNext: () => void;
}

const ID = "wayke-view-2-stage-6";

class Stage6 {
  private props: Stage6Props;

  constructor(props: Stage6Props) {
    this.props = props;
    this.render();
  }

  render() {
    const { li, activate, content, proceed } = Li({
      node: this.props.node,
      id: ID,
      title: "Steg 6 - Sammanställning",
      active: this.props.active,
    });

    if (this.props.canActivate) {
      activate.addEventListener("click", () => this.props.onThis());
    } else {
      activate.setAttribute("disabled", "");
    }

    proceed.addEventListener("click", () => this.props.onNext());
  }
}

export default Stage6;
