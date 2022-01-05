interface View2Props {
    onNext: () => void;
}
export interface Contact {
    email: string;
    telephone: string;
    ssn: string;
    zip: string;
}
export interface View2State {
    stage: number;
    maxStage: number;
    contact: Contact;
}
declare class View2 {
    private props;
    private state;
    constructor(props: View2Props);
    setStage(nextStage: number): void;
    stage1Next(contact: Contact): void;
    render(): void;
}
export default View2;
