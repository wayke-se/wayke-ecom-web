interface ButtonArrowRightProps {
  id: string;
  title: string;
}

const ButtonArrowRight = ({ id, title }: ButtonArrowRightProps) => `
  <button type="button" id="${id}" title="${title}" class="button button--full-width button--action">
    <span class="button__content">${title}</span>
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
`;

export default ButtonArrowRight;
