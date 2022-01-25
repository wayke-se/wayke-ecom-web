interface ListItemProps {
  title: string;
  active?: boolean;
  completed?: boolean;
  id: string;
}

const ListItem = (element: HTMLElement, props: ListItemProps) => {
  const { title, active, completed, id } = props;
  const existingListItem = document.getElementById(id);

  const item = existingListItem ? existingListItem : document.createElement('div');
  if (!existingListItem) {
    item.setAttribute('id', id);
  }

  const className = ['waykeecom-stepper__item'];
  if (active) {
    className.push('waykeecom-stepper__item--is-active');
  } else if (completed) {
    className.push('waykeecom-stepper__item--is-complete');
  } else {
    className.push('waykeecom-stepper__item--is-disabled');
  }

  item.className = className.join(' ');
  item.innerHTML = `
    <header class="waykeecom-stepper__header">
      <div class="waykeecom-stepper__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          class="icon"
        >
          <title>Ikon: bock</title>
          <path d="M12.3 3.3 6 9.6 3.7 7.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l3 3c.4.4 1 .4 1.4 0l7-7c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z"/>
        </svg>
      </div>
      <h3 class="heading heading--3 no-margin">
        <span class="waykeecom-stepper__stage">
          Steg <span class="waykeecom-stepper__stage-count"></span> –
        </span>
        ${title}
      </h3>
    </header>
    <div class="waykeecom-stepper__body"></div>
  `;

  if (!existingListItem) {
    element.appendChild(item);
  }

  const content = item.querySelector<HTMLDivElement>('.waykeecom-stepper__body');
  if (!content) throw 'Err no element';
  return content;
};

export default ListItem;
