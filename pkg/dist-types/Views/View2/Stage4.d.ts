interface Stage4Props {
    node: HTMLElement;
    active?: boolean;
    canActivate?: boolean;
    onThis: () => void;
    onNext: () => void;
}
declare class Stage4 {
    private props;
    constructor(props: Stage4Props);
    render(): void;
}
export default Stage4;
