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
    li.className = active ? 'stepper__item stepper__item--is-active' : 'stepper__item';
    node.appendChild(li);
  }

  li.innerHTML = `
    <header class="stepper__header">
      <h3 class="heading heading--3 no-margin">${title}</h3>
    </header>
    <div class="stepper__body">
      <button id="${id}-activate">Gå till</button>
      <div id="${id}-content"></div>
      <button id="${id}-proceed" title="Fortsätt till nästa steg">Fortsätt</button>
    </div>
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
