import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import Stage4 from './Stage4';
import Stage5 from './Stage5';
import Stage6 from './Stage6';
import Stage7 from './Stage7';
const PROCEED_BUTTON = 'wayke-view-2-proceed';
class View2 {
    constructor(props) {
        this.props = props;
        this.state = {
            stage: 1,
            maxStage: 1,
            contact: {
                email: '',
                telephone: '',
                zip: '',
                ssn: '',
            },
        };
        this.render();
    }
    setStage(nextStage) {
        this.state = {
            ...this.state,
            stage: nextStage,
            maxStage: this.state.maxStage < nextStage ? nextStage : this.state.maxStage,
        };
        this.render();
    }
    stage1Next(contact) {
        this.state = {
            ...this.state,
            contact: { ...contact },
        };
        this.setStage(2);
    }
    render() {
        const container = document.querySelector('#wayke-ecom');
        if (container) {
            container.innerHTML = '';
            const node = document.createElement('ul');
            container.appendChild(node);
            if (!node)
                return;
            console.log(this.state.stage);
            new Stage1({
                node: node,
                canActivate: this.state.maxStage > 0,
                active: this.state.stage === 1,
                contact: this.state.contact,
                onThis: () => this.setStage(1),
                onNext: this.stage1Next.bind(this),
            });
            new Stage2({
                node: node,
                canActivate: this.state.maxStage > 1,
                active: this.state.stage === 2,
                onThis: () => this.setStage(2),
                onNext: () => this.setStage(3),
            });
            new Stage3({
                node: node,
                canActivate: this.state.maxStage > 2,
                active: this.state.stage === 3,
                onThis: () => this.setStage(3),
                onNext: () => this.setStage(4),
            });
            new Stage4({
                node: node,
                canActivate: this.state.maxStage > 3,
                active: this.state.stage === 4,
                onThis: () => this.setStage(4),
                onNext: () => this.setStage(5),
            });
            new Stage5({
                node: node,
                canActivate: this.state.maxStage > 4,
                active: this.state.stage === 5,
                onThis: () => this.setStage(5),
                onNext: () => this.setStage(6),
            });
            new Stage6({
                node: node,
                canActivate: this.state.maxStage > 5,
                active: this.state.stage === 6,
                onThis: () => this.setStage(6),
                onNext: () => this.setStage(7),
            });
            new Stage7({
                node: node,
                canActivate: this.state.maxStage > 6,
                active: this.state.stage === 7,
                onThis: () => this.setStage(7),
                onNext: () => this.setStage(8),
            });
        }
    }
}
export default View2;
