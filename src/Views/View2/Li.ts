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
      <h3 class="heading heading--3 no-margin">
        Steg <span class="stepper__stage-count"></span> – ${title}
      </h3>
    </header>
    <div class="stepper__body">
      <div class="stack stack--3">
        <button type="button" id="${id}-activate" title="Gå till">Gå till</button>
      </div>
      <div class="stack stack--3">
        <div id="${id}-content"></div>
      </div>
      <div class="stack stack--3">
        <button type="button" id="${id}-proceed" title="Fortsätt till nästa steg" class="button button--full-width button--action">
          <span class="button__content">Fortsätt</span>
          <span class="button__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="icon"
            >
              <title>Ikon: pil höger</title>
              <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
            </svg>
          </span>
        </button>
      </div>
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
