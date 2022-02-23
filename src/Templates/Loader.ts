type LoaderType = 'inline';

interface LoaderProps {
  type?: LoaderType;
}

const getType = (type?: LoaderType) => {
  switch (type) {
    case 'inline':
      return 'waykeecom-loader--inline-block';
    default:
      return '';
  }
};

const Loader = (props?: LoaderProps) => {
  const classList = ['waykeecom-loader'];
  const classType = getType(props?.type);
  if (classType) {
    classList.push(classType);
  }

  return `
  <div class="${classList.join('')}" >
    <div class="waykeecom-loader__spinner" aria-hidden="true"></div>
    <div class="waykeecom-sr-only">Laddar...</div>
  </div>
`;
};

export default Loader;
