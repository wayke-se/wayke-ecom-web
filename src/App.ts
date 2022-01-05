import View1 from "./Views/View1";
import View2 from "./Views/View2";

export interface AppState {
  stage: number;
}

const initalState = (): AppState => ({
  stage: 1,
});

class App {
  private state: AppState;

  constructor() {
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
        const stage1 = new View1({
          onNext: () => this.setStage(2),
        });
        break;

      case 2:
        const stage2 = new View2({
          onNext: () => this.setStage(3),
        });
        break;

      default:
        break;
    }
  }

  init() {
    this.setStage(2);
  }
}

export default App;
