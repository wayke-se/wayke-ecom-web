interface Stage2Props {
    node: HTMLElement;
    active?: boolean;
    canActivate?: boolean;
    onThis: () => void;
    onNext: () => void;
}
declare class Stage2 {
    private props;
    constructor(props: Stage2Props);
    render(): void;
}
export default Stage2;
