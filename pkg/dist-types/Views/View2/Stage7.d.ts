interface Stage7Props {
    node: HTMLElement;
    active?: boolean;
    canActivate?: boolean;
    onThis: () => void;
    onNext: () => void;
}
declare class Stage7 {
    private props;
    constructor(props: Stage7Props);
    render(): void;
}
export default Stage7;
