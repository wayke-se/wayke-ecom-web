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
      <h3 class="heading heading--3 no-margin">
        Steg <span class="stepper__stage-count"></span> – ${title}
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
