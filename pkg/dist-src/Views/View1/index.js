const PROCEED_BUTTON = "wayke-view-1-proceed";
class View1 {
    constructor(props) {
        this.props = props;
        this.render();
    }
    render() {
        const container = document.getElementById("wayke-ecom");
        if (container) {
            container.innerHTML = `
        <div>
        <button id="${PROCEED_BUTTON}">Gå vidare</button>
        </div>
      `;
            container
                .querySelector(`#${PROCEED_BUTTON}`)
                ?.addEventListener("click", () => this.props.onNext());
        }
    }
}
export default View1;
