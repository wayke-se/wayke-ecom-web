import { WAYKE_ECOM_MODAL_ID } from '../App';

export const scrollTop = () => {
  const element = document.getElementById(WAYKE_ECOM_MODAL_ID);
  if (element) {
    element.scrollTop = 0;
  }
};
