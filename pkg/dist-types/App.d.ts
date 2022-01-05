import './styles/styles.scss';
export interface AppState {
    stage: number;
}
declare class App {
    private state;
    constructor();
    setStage(nextStage: number): void;
    init(): void;
}
export default App;
