import { Stage1State } from '.';
interface Stage1Part1Props {
    content: HTMLDivElement;
    id: string;
    state: Stage1State;
    edit: boolean;
    onChange: (e: Event) => void;
    onBlur: (e: Event) => void;
}
declare class Part1 {
    private props;
    constructor(props: Stage1Part1Props);
    attach(element: HTMLInputElement, name: 'email' | 'telephone'): void;
    render(): void;
}
export default Part1;
