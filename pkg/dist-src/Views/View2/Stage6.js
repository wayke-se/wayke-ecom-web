import Li from "./Li";
const ID = "wayke-view-2-stage-6";
class Stage6 {
    constructor(props) {
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
        }
        else {
            activate.setAttribute("disabled", "");
        }
        proceed.addEventListener("click", () => this.props.onNext());
    }
}
export default Stage6;
