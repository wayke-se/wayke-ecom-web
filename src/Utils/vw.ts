const setVw = () => {
  const vw = document.documentElement.clientWidth / 100;
  document.documentElement.style.setProperty('--waykeecom-vw', `${vw}px`);
};

export const useVwListner = () => {
  setVw();
  window.addEventListener('resize', setVw);

  return () => window.removeEventListener('resize', setVw);
};
