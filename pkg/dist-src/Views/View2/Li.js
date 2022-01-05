const Li = ({ node, id, title, active }) => {
    let li = node.querySelector(`#${id}-li`);
    if (!li) {
        li = document.createElement("li");
        li.id = `${id}-li`;
        node.appendChild(li);
    }
    li.style.backgroundColor = active ? "green" : "inherit";
    li.innerHTML = `
        <div>
          <h2>${title}</h2>
          <button id="${id}-activate">Gå till</button>
          <div id="${id}-content"></div>
          <button id="${id}-proceed">Fortsätt</button>
        </div>
      `;
    const activate = li.querySelector(`#${id}-activate`);
    const content = li.querySelector(`#${id}-content`);
    const proceed = li.querySelector(`#${id}-proceed`);
    if (!activate || !content || !proceed)
        throw "err";
    return {
        li,
        activate,
        content,
        proceed,
    };
};
export default Li;
