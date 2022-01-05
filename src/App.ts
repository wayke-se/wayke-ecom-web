import View1 from './Views/View1/index';
import View2 from './Views/View2/index';

import './styles/styles.scss';

export interface AppState {
  stage: number;
}

interface AppProps {
  id: string;
}

const initalState = (): AppState => ({
  stage: 1,
});

class App {
  private props: AppProps;
  private state: AppState;

  constructor(props: AppProps) {
    this.props = props;
    this.state = initalState();
    this.init();
  }

  setStage(nextStage: number) {
    this.state = {
      ...this.state,
      stage: nextStage,
    };
    switch (this.state.stage) {
      case 1:
        new View1({
          id: this.props.id,
          onNext: () => this.setStage(2),
        });
        break;

      case 2:
        new View2({
          onNext: () => this.setStage(3),
        });
        break;

      default:
        break;
    }
  }

  init() {
    this.setStage(1);
  }
}

export default App;
