interface LiProps {
    node: HTMLElement;
    id: string;
    title: string;
    active?: boolean;
}
declare const Li: ({ node, id, title, active }: LiProps) => {
    li: HTMLLIElement;
    activate: HTMLButtonElement;
    content: HTMLDivElement;
    proceed: HTMLButtonElement;
};
export default Li;
