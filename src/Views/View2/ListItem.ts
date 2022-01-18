const ListItem = (element: HTMLElement, title: string, active?: boolean, completed?: boolean) => {
  const item = document.createElement('div');

  const className = ['stepper__item'];
  if (active) {
    className.push('stepper__item--is-active');
  } else if (completed) {
    className.push('stepper__item--is-complete');
  } else {
    className.push('stepper__item--is-disabled');
  }

  item.className = className.join(' ');
  item.innerHTML = `
    <header class="stepper__header">
      <div class="stepper__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          class="icon"
        >
          <title>Ikon: pil höger</title>
          <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
        </svg>
      </div>
      <h3 class="heading heading--3 no-margin">
        <span class="stepper__stage">
          Steg <span class="stepper__stage-count"></span> –
        </span>
        ${title}
      </h3>
    </header>
    <div class="stepper__body"></div>
  `;

  element.appendChild(item);

  const content = item.querySelector<HTMLDivElement>('.stepper__body');
  if (!content) throw 'Err no element';
  return content;
};

export default ListItem;
