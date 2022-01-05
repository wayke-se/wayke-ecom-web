import { Contact } from '..';
interface Stage1Props {
    node: HTMLElement;
    active?: boolean;
    canActivate?: boolean;
    contact: Contact;
    onThis: () => void;
    onNext: (contact: Contact) => void;
}
export interface ContactValidation {
    email: boolean;
    telephone: boolean;
    ssn: boolean;
    zip: boolean;
}
export interface Stage1State {
    value: Contact;
    validation: ContactValidation;
    interact: ContactValidation;
}
declare class Stage1 {
    private props;
    private stage;
    private state;
    private elements;
    constructor(props: Stage1Props);
    onChange(e: Event): void;
    onBlur(e: Event): void;
    update(): void;
    onNext(): void;
    render(): void;
}
export default Stage1;
