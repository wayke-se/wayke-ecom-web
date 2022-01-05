import { Stage1State } from '.';
interface Stage1Part2Props {
    content: HTMLDivElement;
    id: string;
    state: Stage1State;
    edit: boolean;
    onChange: (e: Event) => void;
    onBlur: (e: Event) => void;
}
declare class Part2 {
    private props;
    constructor(props: Stage1Part2Props);
    attach(element: HTMLInputElement, name: 'ssn' | 'zip'): void;
    render(): void;
}
export default Part2;
