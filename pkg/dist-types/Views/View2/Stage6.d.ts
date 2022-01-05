interface Stage6Props {
    node: HTMLElement;
    active?: boolean;
    canActivate?: boolean;
    onThis: () => void;
    onNext: () => void;
}
declare class Stage6 {
    private props;
    constructor(props: Stage6Props);
    render(): void;
}
export default Stage6;
