interface Stage5Props {
    node: HTMLElement;
    active?: boolean;
    canActivate?: boolean;
    onThis: () => void;
    onNext: () => void;
}
declare class Stage5 {
    private props;
    constructor(props: Stage5Props);
    render(): void;
}
export default Stage5;
