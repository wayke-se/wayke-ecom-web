interface Stage3Props {
    node: HTMLElement;
    active?: boolean;
    canActivate?: boolean;
    onThis: () => void;
    onNext: () => void;
}
declare class Stage3 {
    private props;
    constructor(props: Stage3Props);
    render(): void;
}
export default Stage3;
