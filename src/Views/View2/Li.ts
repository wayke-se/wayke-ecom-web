interface LiProps {
  node: HTMLElement;
  id: string;
  title: string;
  active?: boolean;
}

const Li = ({ node, id, title, active }: LiProps) => {
  let li = node.querySelector<HTMLLIElement>(`#${id}-li`);
  if (!li) {
    li = document.createElement('li');
    li.id = `${id}-li`;
    li.className = 'stepper__item';
    node.appendChild(li);
  }

  li.style.backgroundColor = active ? 'green' : 'inherit';

  li.innerHTML = `
    <h2>${title}</h2>
    <button id="${id}-activate">Gå till</button>
    <div id="${id}-content"></div>
    <button id="${id}-proceed">Fortsätt</button>
  `;

  const activate = li.querySelector<HTMLButtonElement>(`#${id}-activate`);
  const content = li.querySelector<HTMLDivElement>(`#${id}-content`);
  const proceed = li.querySelector<HTMLButtonElement>(`#${id}-proceed`);
  if (!activate || !content || !proceed) throw 'err';

  return {
    li,
    activate,
    content,
    proceed,
  };
};

export default Li;
